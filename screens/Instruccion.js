import React from 'react';
import {
  Button,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppLoading, } from 'expo';

import * as FileSystem from 'expo-file-system'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import { MonoText, Titulo, Descripcion } from '../components/StyledText';
import BotonListo from '../components/BotonListo';
import BotonCamara from '../components/BotonCamara';
import BotonIcon from '../components/BotonIcon';
import ItemComponente from '../components/ItemComponente';

import Colors from '../constants/Colors';

import formularios from '../data/formularios.json';

export default class Instruccion extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  static navigationOptions = {
    header: null,
  };
  state={
    isLoadingComplete: false,
    modalVisible: false,
    modalVisibleImg: false,
    /*data*/
    selecteds:[],
    traza: {},
    respuestas: {},
    data: {componentes:[]},
    imagenesRespuestas: [],
    /*camara*/
    hasCameraPermission: null,
    photoFile:undefined
  }

  constructor(props){
    super(props);
  }
  /**--------------------------- Eventos -----------------------*/
  /*Loading method*/
  _loadResourcesAsync = async () => {
    /*rescue information*/
    const { navigation } = this.props;

    const traza = navigation.getParam('traza', undefined);
    const data = navigation.getParam('data', {instruccion:'...',componentes:[]});
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    const respuestas = JSON.parse(content)||[];
    const selecteds = await this.pintaComponente(respuestas,traza,data);

    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    const photoFile = await this._loadImagesData(
      traza.id_normatividad_vehiculo,
      traza.instruccion.ensamble.id_ensamble);

    this.setState({ 
      ...this.state, 
      isLoadingComplete: true,
      traza: traza,
      respuestas: respuestas,
      data: data,
      selecteds:selecteds,
      hasCameraPermission: status === 'granted',
      photoFile:photoFile
    });
  };
  _handleLoadingError = error => {
    console.warn(error)
  };
  _handleFinishLoading = () => {
    this.setState({ ...this.state, isLoadingComplete: true });
  };
  async _onChange(index){
    const selecteds = this.state.selecteds;
    selecteds[index] = !selecteds[index];
    
    const componente = this.state.data.componentes[index];
    const compSelected = [];

    for (var i = 0; i < selecteds.length; i++) {
      if(selecteds[i]) {
        compSelected.push(this.state.data.componentes[i]);
      }
    }

    await this.registrarComponente(compSelected);

    this.setState({
      ...this.state,
      selecteds: selecteds,
    });
  }
  async _onItemClick(id_componente,fallas,posiciones){
    this.state.traza.instruccion.ensamble.componente = {};
    this.state.traza.instruccion.ensamble.componente.id_componente = id_componente;
    this.state.traza.instruccion.ensamble.componente.falla = {};
    this.state.traza.instruccion.ensamble.componente.posicion = {};

    this.state.respuestas

    console.log('Go to Fallas');
    console.log('traza', this.state.traza);
    console.log('fallas', fallas);
    console.log('posiciones', posiciones);

    this.props.navigation.navigate('Fallas', 
    {
      traza:this.state.traza,
      fallas: fallas,
      posiciones: posiciones,
    });
  }
  /**--------------------------- Util -----------------------*/
  async pintaComponente(respuestas,traza,data) {
    const componentsList = data.componentes;
    const selecteds = this.state.selecteds;

    const vihiculosAnswer = respuestas.filter((e) => e.id_vehiculo === traza.id_vehiculo 
      && e.id_normatividad === traza.id_normatividad
      && e.id_normatividad_vehiculo === traza.id_normatividad_vehiculo )[0] 
    || {instrucciones:[]};

    const instruccionesAnswer = vihiculosAnswer.instrucciones.filter((e) => e.id_ensamble === traza.instruccion.ensamble.id_ensamble )[0]|| {componentes:[]};
    const componentsAnswer = instruccionesAnswer.componentes || [];
    for (var i = 0; i < componentsList.length; i++) {
      for (var j = 0; j < componentsAnswer.length; j++) {
        if( componentsAnswer[j].id_componente == componentsList[i].id_componente) {
          selecteds[i] = true;
        }
      }
    }
    return selecteds;

  }
  async registrarComponente(componentes) {
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    const respuestas = JSON.parse(content)||[];
    const traza = this.state.traza;

    let comRes=[];
    for (var i = 0; i < respuestas.length; i++) {
      if(respuestas[i].id_vehiculo === traza.id_vehiculo 
        && respuestas[i].id_normatividad === traza.id_normatividad         
        && respuestas[i].id_normatividad_vehiculo === traza.id_normatividad_vehiculo) {
        for (var j = 0; j < respuestas[i].instrucciones.length; j++) {
          if(respuestas[i].instrucciones[j].id_ensamble === traza.instruccion.ensamble.id_ensamble ) {

            /*Interseccion*/
            comRes = respuestas[i].instrucciones[j].componentes.filter(it=>componentes.filter(e=>e.id_componente==it.id_componente)!=false);
            for (var k = 0; k < componentes.length; k++) {
              if(comRes.filter(e=>e.id_componente==componentes[k].id_componente)==false) {
                comRes.push({
                  id_componente : componentes[k].id_componente,
                  fallas:[]
                });
              }
            }
            respuestas[i].instrucciones[j].componentes = comRes;

            await FileSystem.writeAsStringAsync(
              `${this.folderPath}/respuestas.json`, 
              JSON.stringify(respuestas), 
              { encoding: FileSystem.EncodingType.UTF8 });

            this.setState({
              ...this.state,
              respuestas: respuestas,
            });

            return respuestas;
          }
        }
      }
    }
  }
  async _loadImagesData(id_normatividad_vehiculo, id_ensamble) {
    const imagesContent = await this._loadImagesFile(id_normatividad_vehiculo);
    const imageContent = imagesContent.find(e=>
      e.id_normatividad_vehiculo == id_normatividad_vehiculo
      && e.id_ensamble == id_ensamble
      && !e.id_falla
      && !e.id_posicion);

    if(imageContent)
      return {uri:imageContent.uri};
    else
      return undefined;
  }
  async _writeImage(id_normatividad_vehiculo, id_ensamble, photo) {
    console.log('photo',photo);
    const {uri,base64} = photo;
    const fileName = `/images${id_normatividad_vehiculo}`;
    const imagesContent = await this._loadImagesFile(id_normatividad_vehiculo);
    console.log('imagesContent',imagesContent);
    const imageContent = imagesContent.find(e=>
      e.id_normatividad_vehiculo == id_normatividad_vehiculo
      && e.id_ensamble == id_ensamble
      && !e.id_falla
      && !e.id_posicion);

    if(imageContent) {
      imageContent.uri = uri;
      imageContent.data = base64;
    } else {
      imagesContent.push({
        id_normatividad_vehiculo:id_normatividad_vehiculo,
        id_ensamble:id_ensamble,
        uri:uri,
        data:base64,
      });
    }
    await this._saveJSON(imagesContent,fileName);
  }
  async _loadImagesFile(id_normatividad_vehiculo) {
    const fileName = `/images${id_normatividad_vehiculo}`;
    return await this._readJSONFiles(fileName);
  }
  async _terminar() {
    await this._finInstruccion();
    this.props.navigation.goBack();
  }
  async _finInstruccion() {
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    const respuestas = JSON.parse(content)||[];
    const traza = this.state.traza;

    let comRes=[];
    for (var i = 0; i < respuestas.length; i++) {
      if(respuestas[i].id_vehiculo === traza.id_vehiculo 
        && respuestas[i].id_normatividad === traza.id_normatividad 
        && respuestas[i].id_normatividad_vehiculo === traza.id_normatividad_vehiculo ) {
        for (var j = 0; j < respuestas[i].instrucciones.length; j++) {
          if(respuestas[i].instrucciones[j].id_ensamble === traza.instruccion.ensamble.id_ensamble ) {

            const inst = formularios.filter((e) => e.id_normatividad === traza.id_normatividad)[0].instrucciones;

            if((j + 1)< inst.length && (j+1) === respuestas[i].instrucciones.length) {
              respuestas[i].instrucciones.push({
                  id_ensamble:inst[j+1].id_ensamble,
                  componentes:[]
                });

              await FileSystem.writeAsStringAsync(
                `${this.folderPath}/respuestas.json`, 
                JSON.stringify(respuestas), 
                { encoding: FileSystem.EncodingType.UTF8 });
              
              return respuestas;
            }
          }
        }
      }
    }
  }
  _onClose(index) {
    if(index===1) {
      this.setState({...this.state, modalVisible: false})
    } else {
      this.setState({...this.state, modalVisibleImg: false})
    }
  }
  async _snap() {
    let photo = undefined;
    console.log('traza',this.state.traza);
    console.log('traza',this.state.traza);
    if (this.camera) {
      photo = await this.camera.takePictureAsync({quality:0,base64:true,skipProcessing:true});
    }
    await this._writeImage(
      this.state.traza.id_normatividad_vehiculo, 
      this.state.traza.instruccion.ensamble.id_ensamble,
      photo);
    this.setState({...this.state, modalVisible: false, photoFile: photo})
  };
  /*tools*/
  async _saveJSON(content,name) {
    await FileSystem.writeAsStringAsync(`${this.folderPath}/${name}.json`, 
      JSON.stringify(content), 
      { encoding: FileSystem.EncodingType.UTF8 });
  }
  async _readJSONFiles(file) {
    console.log(`read ${this.folderPath}/${file}.json`);
    const fileContent =  await FileSystem.readAsStringAsync(
      `${this.folderPath}/${file}.json`, 
      { encoding: FileSystem.EncodingType.UTF8 });
    const content = JSON.parse(fileContent);
    return content;
  }
  render() {
    let camaraView;
    let foto;
    let iconFoto;
    let botonTerminar;
    /*Cargando...*/
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    /*Camara*/
    if (this.state.hasCameraPermission) {
      camaraView = (
        <View style={{height: '100%',width: '100%'}}>
          <Camera style={{height: '100%',width: '100%'}} 
          type={Camera.Constants.Type.back} 
          ref={ref => { this.camera = ref; }} >
            <View style={{flex: 1,alignItems: 'center', justifyContent: 'flex-end' ,margin: 50 }}>
              <BotonCamara 
              onPress={() => {this._snap()}}>
              </BotonCamara>
            </View>
          </Camera>
        </View>
      );
    } 
    /*Fotos*/
    if(this.state.photoFile) {
      foto =(
        <View style={{
          alignItems: 'center' ,
        }}>
          <Image
            style={{
              width: '85%', 
              height: '85%'}}
            source={{uri: this.state.photoFile.uri}}
            resizeMode="contain"
          />
        </View>
      );
      iconFoto = (
        <BotonIcon
        icon="picture-o" 
        onPress={() => this.setState({...this.state, modalVisibleImg: true})}>
        </BotonIcon>
      );
    }
    /*build itmes*/
    const items = this.state.data.componentes
      .map(({id_componente, descripcion, fallas, posicion}, index) => {
        return (<ItemComponente 
          key={index} 
          onPress={() => this._onItemClick(id_componente,fallas,posicion)}
          value={this.state.selecteds[index]}
          onChange={()=>this._onChange(index)}>
          {descripcion}
        </ItemComponente>);
        }
      );
    /*Boton terminar*/

    if(this.state.selecteds || this.state.selecteds.length<1) {
      botonTerminar = (<Button
      title="Terminar sin daños"
      color={Colors.negro}
      style={{
      }}
      onPress={() => this._terminar() }
      />);
    }
    /*view*/
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
        <View style={{marginBottom: 30}}>
          <Titulo>Instrucción o Prueba</Titulo>
          <Descripcion style={{textAlign: 'justify' }}>
            {this.state.data.instruccion}
          </Descripcion>
        </View>
        <ScrollView style={{paddingLeft: 10}}>
          {items}
        </ScrollView>
        <View style={{
          marginLeft: 10, 
          marginBottom: 20, 
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          alignItems: 'flex-end' 
        }}>
          <BotonCamara 
          onPress={() => this.setState({...this.state, modalVisible: true})}>
          </BotonCamara>
          {iconFoto}
          <BotonListo 
          onPress={() => 
            (this.state.selecteds 
              && this.state.selecteds.length>0)?
            this._terminar():
            this.props.navigation.goBack() }>
          </BotonListo>
        </View>
        <View style={{
        height: 50, 
        marginTop: 5, 
        }} >
        {botonTerminar} 
        </View>
      </View>


      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={()=>this._onClose(1)}>
        {camaraView}
      </Modal>

      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.modalVisibleImg}
        onRequestClose={()=>this._onClose(2)}>
        {foto}
        <View style={{
          marginLeft: 10, 
          marginBottom: 20, 
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          alignItems: 'flex-end' 
        }}>
          <BotonCamara 
          onPress={() => this.setState({...this.state, modalVisibleImg: false, modalVisible: true})}>
          </BotonCamara>
          <BotonListo 
          onPress={() => this.setState({...this.state, modalVisibleImg: false})}>
          </BotonListo>
        </View>
      </Modal>
    </View>
    );
  }

}
