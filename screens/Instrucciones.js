import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { AppLoading, } from 'expo';
import * as FileSystem from 'expo-file-system'

import { MonoText, Titulo, Descripcion } from '../components/StyledText';
import Item from '../components/Item';
import ItemIntruccion from '../components/ItemIntruccion';
import BotonListo from '../components/BotonListo';

import { bookListQuery } from '../constants/Queries';
import Colors from '../constants/Colors';

import formularios from '../data/formularios.json';

export default class Instrucciones extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  static navigationOptions = {
    header: null,
  };
  state = {
    /*View*/
    isLoadingComplete: false,
    respuestas:[],
    respuesta:{},
    traza:{} 
  };
  constructor(props){
    super(props);
  }
  componentDidMount() {
    const didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        console.log("foco");
        this.setState({
          ...this.state,
          isLoadingComplete: false
        });
      }
    );
  }
  
  /*Loading method*/
  _loadResourcesAsync = async () => {
    /*rescue information*/
    const { navigation } = this.props;
    const traza = navigation.getParam('traza', 
      {
        id_vehiculo:-1,
        id_normatividad: -1,
        instruccion:{}
      });

    console.log('traza.id_normatividad');
    console.log(traza.id_normatividad);
    const formulario = formularios.filter((e) => e.id_normatividad === traza.id_normatividad)[0] || {instrucciones:[]};

    console.log('traza4');
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    console.log('traza3.5');
    const obj = JSON.parse(content)||[];
    console.log('respuesta');
    console.log(obj);
    let respuesta;

    /*Buscamos si ya existe el vehicolo en las respuestas*/
    let containAnswer = false;
    console.log('traza3');

    for (var i = 0; i < obj.length; i++) {
      if(obj[i].id_normatividad === traza.id_normatividad 
        && obj[i].id_vehiculo === traza.id_vehiculo
        && obj[i].id_normatividad_vehiculo_persona === traza.id_normatividad_vehiculo_persona) {
        respuesta = obj[i];
        respuesta.instrucciones = respuesta.instrucciones.length > 0 ? respuesta.instrucciones: 
          [{
            id_ensamble:formulario.instrucciones[0].id_ensamble,
            componentes:[]
          }];
        containAnswer = true;
        break;
      }
    }
    console.log('traza2');

    /*Primer entrada*/
    if(!containAnswer) {
      respuesta = {
        id_normatividad_vehiculo_persona: traza.id_normatividad_vehiculo_persona,
        id_vehiculo: traza.id_vehiculo,
        id_normatividad: traza.id_normatividad,
        instrucciones: [{
          id_ensamble:formulario.instrucciones[0].id_ensamble,
          componentes:[]
        }]
      };
      
      obj.push(respuesta);
    }

    console.log('traza1');

    await FileSystem.writeAsStringAsync(
      `${this.folderPath}/respuestas.json`, 
      JSON.stringify(obj), 
      { encoding: FileSystem.EncodingType.UTF8 });

    console.log('traza0');
    console.log(traza);
    this.setState({
      ...this.state,
      respuestas:obj,
      respuesta:respuesta,
      traza:traza 
    });
  };

  _handleLoadingError = error => {
  };
  _handleFinishLoading = () => {
    this.setState({ ...this.state, isLoadingComplete: true });
  };
  _onItemClick(ensamble){
    this.state.traza.instruccion.ensamble = {};
    this.state.traza.instruccion.ensamble.id_ensamble = ensamble.id_ensamble;


    this.props.navigation.navigate('Instruccion', 
    {
      traza:this.state.traza,
      data: ensamble
    });
  };

  render() {
    /*Cargando...*/
    console.log('this.state');
    console.log(this.state);
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } 

    /*find or build information*/
    const formulario = formularios.filter((e) => e.id_normatividad === this.state.traza.id_normatividad)[0] || {instrucciones:[]};
    console.log('this.state.traza.id_normatividad');
    console.log(this.state.traza.id_normatividad);
    console.log('formularios');
    console.log(formularios);
    console.log('formulario');
    console.log(formulario);
    const respuesta = this.state.respuesta;
    /*build items*/
    console.log(formulario);
    console.log(respuesta);
    console.log(items);
    const items = formulario.instrucciones.map((ensamble, index) => {
      const marked = (respuesta.instrucciones.length>0) 
        && (ensamble.id_ensamble <= respuesta.instrucciones[respuesta.instrucciones.length-1].id_ensamble);
      const selected = (respuesta.instrucciones.length>0) 
        && (ensamble.id_ensamble == respuesta.instrucciones[respuesta.instrucciones.length-1].id_ensamble);
      const {componentes} = respuesta.instrucciones.filter((e) => e.id_ensamble === ensamble.id_ensamble)[0]||{};

        return (<ItemIntruccion 
                key={index} 
                onPress={() => this._onItemClick(ensamble)}
                marked={marked}
                selected={selected}>
                  {ensamble.instruccion}
                </ItemIntruccion>)
      }
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
            <Titulo>Procedimiento de verificación</Titulo>
          </View>
          <ScrollView>
            {items}
          </ScrollView>
        </View>
        <View style={{
          margin: 20,
          alignItems: 'flex-end' 
        }}>
          <BotonListo 
          onPress={() => this.props.navigation.goBack()}>
          </BotonListo>
        </View>
      </View>
    );
  }

}
