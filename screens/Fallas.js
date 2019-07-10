import React from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  CheckBox,
} from 'react-native';

import * as FileSystem from 'expo-file-system'

import { MonoText, Titulo, Descripcion, TituloPequeno, ListHeader } from '../components/StyledText';
import Card from '../components/Card';
import ItemFallas from '../components/ItemFallas';
import BotonListo from '../components/BotonListo';

import { bookListQuery } from '../constants/Queries';
import Colors from '../constants/Colors';

import fallas from '../data/fallas.json';
import posicion from '../data/posicion.json';

export default class Fallas extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  static navigationOptions = {
    header: null,
  };
  state = {
    selecteds:[[]],
    traza:{},
    respuestas:[],
    instruccionesA:{},
    fallasAns:[],
    fallas:[],
    posiciones:[],
  };
  
  constructor(props){
    super(props);

  }
  async componentWillMount() {
        /*rescue information*/
    const { navigation } = this.props;

    const traza = navigation.getParam('traza', undefined);
    const listaFallas = navigation.getParam('fallas',[]);
    const listaPosiciones = navigation.getParam('posiciones',[]);

    /*respuestas*/
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    const respuestas = JSON.parse(content)||[];
    console.log('F: respuestas');
    console.log(respuestas);
    const vihiculosA = respuestas.filter((e) => e.id_vehiculo === traza.id_vehiculo 
      && e.id_normatividad === traza.id_normatividad 
      && e.id_normatividad_vehiculo === traza.id_normatividad_vehiculo 
      )[0];
    const instruccionesA = vihiculosA.instrucciones.filter((e) => e.id_ensamble === traza.instruccion.ensamble.id_ensamble )[0];

    const compA = instruccionesA.componentes.filter(e=>e.id_componente===traza.instruccion.ensamble.componente.id_componente);
    const fallasAns = (compA.length>0? (compA[0].fallas||[]) : []);


    const falla = this._findObjectFallas(listaFallas);
    console.log('falla', falla);
    const posiciones = this._findObjectPosiciones(listaPosiciones);
    console.log('posiciones', posiciones);
    const selecteds = this._drawActions(falla,posiciones,fallasAns);

    this.setState({
      ...this.state,
      traza: traza,
      respuestas: respuestas,
      instruccionesA: instruccionesA,
      fallasAns:fallasAns,
      fallas: falla,
      posiciones: posiciones,
      selecteds:selecteds
    });
  }

  async _selectedChange(indexFalla,indexPosicion) {
    console.log('selecteds',this.state.selecteds);
    this.state.selecteds[indexPosicion][indexFalla] = !this.state.selecteds[indexPosicion][indexFalla];
    this._writeChanges();

    await this._saveJSON(this.state.respuestas, 'respuestas');

    console.log('selecteds',this.state.selecteds);
    this.setState({...this.state, selecteds: this.state.selecteds});
  }
  async _saveJSON(content,name) {
    await FileSystem.writeAsStringAsync(`${this.folderPath}/${name}.json`, 
      JSON.stringify(content), 
      { encoding: FileSystem.EncodingType.UTF8 });
  }
  _findObjectFallas(listaFallas) {
    return fallas.filter((e) => {
      for (var i = 0; i < listaFallas.length; i++) {
        if(listaFallas[i]===e.id_falla)
          return true;
      }
    });
  }
  _findObjectPosiciones(listaPosiciones) {
    return posicion.filter((e) => {
      for (var i = 0; i < listaPosiciones.length; i++) {
        if(listaPosiciones[i]===e.id_posicion)
          return true;
      }
    });
  }
  _drawActions(listaFallas,listaPosiciones,listaRespuestas) {
    const selecteds = [];
    // if(!listaRespuestas||listaRespuestas.length<1) {
    //   return selecteds;
    // }

    for (var j = 0; j < listaPosiciones.length; j++) {
      selecteds.push([]);
      for (var i = 0; i < listaFallas.length; i++) {
        const elem = listaRespuestas
          .filter(e=>e.id_falla === listaFallas[i].id_falla
            && e.id_posicion === listaPosiciones[j].id_posicion);

        selecteds[j].push((!(!elem))&&(elem.length>0));
      }
    }

    return selecteds;
  }

  _writeChanges() {
    const traza = this.state.traza;
    const selects = this.state.selecteds;
    const falla = this.state.fallas;
    const posiciones = this.state.posiciones;

    const selectedElem = this._buildSelectedItems();
    const componentes = this.state.instruccionesA.componentes;

    /*Desmarcamos*/
    const falRes = this.state.fallasAns
      .filter(
        it=>selectedElem
          .filter(
            e=>e.id_falla==it.id_falla
              && e.id_posicion==it.id_posicion)
          !=false);

    /*Marcamos los nuevos*/
    for (var j = 0; j < selects.length; j++) {
      for (var i = 0; i < selects[j].length; i++) {
        if(selects[j][i]
          && falRes.filter(
            e=>e.id_falla==falla[i].id_falla
              && e.id_posicion==posiciones.id_posicion) == false) {
          console.log('i',i);
          console.log('falla',falla);
          console.log('falla',falla[i].id_falla);
          falRes.push({
            id_falla : falla[i].id_falla,
            id_posicion : posiciones[j].id_posicion,
            acciones:[]
          });
        }
      }
    }

    /*Asociamos la respuesta al componente*/

    /*Si el componente no esta chequeado el filtro de componentes es null
    por lo que se debe apilar en las espuestas ;)
    */
    const comFilt = componentes.filter(e=>e.id_componente===traza.instruccion.ensamble.componente.id_componente);
    if( (!comFilt) || comFilt.length < 1) {
      componentes.push({
        id_componente : traza.instruccion.ensamble.componente.id_componente,
        fallas:falRes
      });
    } else {
      comFilt[0].fallas = falRes;
    }

  }

  _buildSelectedItems() {
    const selects = this.state.selecteds;
    const fallas = this.state.fallas;
    const posiciones = this.state.posiciones;
    const elems=[];
    for (var i = 0; i < selects.length; i++) {
      for (var j = 0; j < selects[i].length; j++) {
        if(selects[i][j]) {
          elems.push({
            ...posiciones[i],
            ...fallas[j],
          });
        }
      }
    }

    return elems;
  }
  _onPress(id_falla,id_posicion) {
    this.state.traza.instruccion.ensamble.componente.falla = {};
    this.state.traza.instruccion.ensamble.componente.falla.id_falla = id_falla;
    this.state.traza.instruccion.ensamble.componente.falla.id_posicion = id_posicion;

    this.props.navigation.navigate('RegistroFalla', {
      id_falla:id_falla ,
      id_posicion:id_posicion ,
      traza: this.state.traza
    });
  }
  _onInfo(id_falla,id_posicion) {
    this.state.traza.instruccion.ensamble.componente.falla = {};
    this.state.traza.instruccion.ensamble.componente.falla.id_falla = id_falla;
    this.state.traza.instruccion.ensamble.componente.falla.id_posicion = id_posicion;

    this.props.navigation.navigate('Valoracion', {
      id_falla:id_falla ,
      id_posicion:id_posicion ,
      traza: this.state.traza
    });
  }
  render() {
    const { navigation } = this.props;
    const traza = this.state.traza;
    const falla = this.state.fallas;
    const posiciones = this.state.posiciones;
    console.log(posiciones);
    const items = posiciones.map(({id_posicion, descripcion}, indexPosicion) => 
      <View key={indexPosicion}>
        <ListHeader>{descripcion.toUpperCase()}</ListHeader>
        <View
          style={{
            borderBottomColor: Colors.negro,
            borderBottomWidth: 1,
            marginHorizontal: 10,
            marginTop: 2
          }}
        />
        {
          falla.map(({id_falla, descripcion}, indexFalla) => 
            <ItemFallas 
            key={indexFalla} 
            onPress={() => this._onPress(id_falla,id_posicion)}
            onInfo={() => this._onInfo(id_falla,id_posicion)}
            value={this.state.selecteds[indexPosicion]
              && this.state.selecteds[indexPosicion][indexFalla]}
            onChange={()=>this._selectedChange(indexFalla, indexPosicion)}>
            {descripcion}
            </ItemFallas>
          )
        }
      </View>
    );

    return (
      <View style={{
        flex: 1,}}>
        <View style={{
          height: 25,
          backgroundColor: Colors.negro}}>
        </View>
        <View style={{
          flex: 1,
          alignItems: 'stretch',
          backgroundColor: '#fff',
          paddingVertical: 10,
          paddingHorizontal: 20,
          }}>
          <View style={{marginBottom: 20}}>
           <Titulo>Tipo de Falla
            </Titulo>
         </View>
         <ScrollView>
          {items}
         </ScrollView>
         <View style={{marginLeft: 10, marginBottom: 20, alignItems: 'flex-end' }}>
          <BotonListo 
            onPress={() => this.props.navigation.navigate('Instruccion')}
            ></BotonListo>
          </View>
        </View>
      </View>
    );
  }

}
