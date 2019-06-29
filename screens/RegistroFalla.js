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

import { MonoText, Titulo, Descripcion, SubTitulo } from '../components/StyledText';
import ItemAccion from '../components/ItemAccion';
import BotonListo from '../components/BotonListo';
import BotonCamara from '../components/BotonCamara';

import { bookListQuery } from '../constants/Queries';
import Colors from '../constants/Colors';

import accion from '../data/accion.json';

export default class RegistroFalla extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  static navigationOptions = {
    header: null,
  };
  state={
    selecteds:[],

    traza:{},
    respuestas:[],
    fallasAns:[],
    accionesAns:[]
  }
  constructor(props){
    super(props);
  }

  async componentWillMount() {
    const { navigation } = this.props;
    const id_falla = navigation.getParam('id_falla', -1);
    const traza = navigation.getParam('traza', {});

    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    const respuestas = JSON.parse(content)||[];

    const vihiculosA = respuestas.filter((e) => e.id_vehiculo === traza.id_vehiculo 
      && e.id_normatividad === traza.id_normatividad 
      && e.id_normatividad_vehiculo_persona === traza.id_normatividad_vehiculo_persona 
      )[0];
    const instruccionesA = vihiculosA.instrucciones.filter((e) => e.id_ensamble === traza.instruccion.ensamble.id_ensamble )[0];

    const compA = instruccionesA.componentes.filter(e=>e.id_componente===traza.instruccion.ensamble.componente.id_componente);
    const fallasA = (compA.length>0? (compA[0].fallas||[]) : []);

    let fallaA = fallasA.filter(e=>e.id_falla===traza.instruccion.ensamble.componente.falla.id_falla);
    fallaA = this._safeData(fallaA);
    if(!fallaA)
      return;

    const selecteds = this._drawActions(fallaA);
    this.setState({
      selecteds: selecteds,
      traza: traza,
      respuestas: respuestas,
      fallasAns:fallasA,
      accionesAns: fallaA.acciones
    });
  }

  _safeData(fallaA) {
    if(!fallaA || fallaA.length < 1 ) {
      Alert.alert(
        'No se ha registrado la falla',
        '',
        [
          {text: 'OK', onPress: () => this.props.navigation.goBack()},
        ],
        {cancelable: false},
      );
      return undefined;
    }
    return fallaA[0];
  }

  _drawActions(fallaA) {
    const selecteds = [];
    if(!fallaA.acciones) {
      return selecteds;
    }
    for (var i = 0; i < accion.length; i++) {
      selecteds.push(fallaA.acciones.includes(accion[i].id_accion_falla));
    }
    return selecteds;
  }

  async _onChange(index,id_accion_falla) {
    this.state.selecteds[index] = !this.state.selecteds[index];

    this._writeChanges();

    await FileSystem.writeAsStringAsync(`${this.folderPath}/respuestas.json`, 
      JSON.stringify(this.state.respuestas), 
      { encoding: FileSystem.EncodingType.UTF8 });

    this.setState({...this.state, selecteds: this.state.selecteds});
  }

  _writeChanges() {
    const traza = this.state.traza;
    const selects = this.state.selecteds;

    const selectedElem = accion.filter((e,index)=>selects[index]);
    const fallas = this.state.fallasAns;
    const actRes = selectedElem.map((e,index)=>e.id_accion_falla);

    fallas.filter(e=>e.id_falla===traza.instruccion.ensamble.componente.falla.id_falla)[0].acciones = actRes;
  }

  render() {
    const items = accion.map(({id_accion_falla, descripcion}, index) => 
        <ItemAccion key={index} 
        value={this.state.selecteds[index]}
        onChange={()=>this._onChange(index,id_accion_falla)}>
          {descripcion}
        </ItemAccion>

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
    			<Titulo>Corrección de la falla y evidencia</Titulo>
    		</View>
    		<View style={{marginBottom: 20}}>
    			<SubTitulo>Acciones:</SubTitulo>
    		</View>
    		<ScrollView>
          {items}
    		</ScrollView>
        <View style={{
          marginLeft: 10, 
          marginBottom: 20, 
          justifyContent: 'flex-end' ,
          flexDirection: 'row',
          alignItems: 'flex-end' 
        }}>
          <BotonListo 
          onPress={() => this.props.navigation.goBack()}>
          </BotonListo>
        </View>
    	</View>
    </View>
    );
  }

}
