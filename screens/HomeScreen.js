import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  NetInfo,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';

import { MonoText, Titulo, Descripcion,TituloPequeno ,SubTituloPequeno} from '../components/StyledText';
import Item from '../components/Item';
import CheckItem from '../components/CheckItem';
import BotonListo from '../components/BotonListo';

import Colors from '../constants/Colors';
import Params from '../constants/Params';

import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as FileSystem from 'expo-file-system'



export default class HomeScreen extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  state = {
    /*View*/
    isLoadingComplete: false,
    modalVisible: false,
    selectedSerch: ['cliente','ubicacion'],
    selectedStatus: [],
    selectedLoads: [],
    vehiculos: [],
    vehiculos2: [],

    isSendingData:false,
  };

  static navigationOptions = {
    header: null,
  };

  /*                 Eventos          **/
  /*Loading method*/
  _loadResourcesAsync = async () => {
    
    const vehiculos = await this._loadDataVehiculos();

    const props =  await FileSystem.getInfoAsync(`${this.folderPath}`);
    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(this.folderPath, {
        intermediates: true,
      });
    }
    const propsFile =  await FileSystem.getInfoAsync(`${this.folderPath}/respuestas.json`);
    if (!propsFile.exists) {
      await FileSystem.writeAsStringAsync(
        `${this.folderPath}/respuestas.json`, 
        JSON.stringify([]), 
        { encoding: FileSystem.EncodingType.UTF8 });
    }

    await this._imagesFile();

    this.setState({
      ...this.state,
      vehiculos: vehiculos,
      vehiculos2: vehiculos
    });
  };
  _handleLoadingError(error) {
    console.warn(error);
  }
  _handleFinishLoading = () => {
    this.setState({ ...this.state, isLoadingComplete: true });
  };

  _toggleModal = () => {
    console.log('Cerrar modal de filtros', this.state.selectedStatus); 
    /*Especifico para los estatus */
    if(this.state.selectedStatus.includes('pendiente')){
      delete this.state.vehiculos[0];
      delete this.state.vehiculos[2];
    } else if(this.state.selectedStatus.includes('rechazada')){
      delete this.state.vehiculos[1];
      delete this.state.vehiculos[2];
    } else if(this.state.selectedStatus.includes('proceso')){
      delete this.state.vehiculos[1];
      delete this.state.vehiculos[2];
    } else {
      this.state.vehiculos = this.state.vehiculos2;
    }

    this.setState({ modalVisible: !this.state.modalVisible });
  };
  _onClose = () => {   
    this.setState({
      ...this.state,
      modalVisible: false,
    });
  };
  _filtraLista = () => {
    /*if(this.state.selectedSerch.includes('pendiente') 
      || this.state.selectedSerch.includes('proceso') 
      || this.state.selectedSerch.includes('rechazada') 
      || this.state.selectedSerch.includes('aprobada')){

        for(var a in vehiculos) {
          //console.log("norma vehiculo: ",a, vehiculos[a]);
          for (var b in normatividad) {
            if(vehiculos[a].normatividad_vehiculo_persona.id_normatividad === normatividad[b].id_normatividad){
              //console.log("norma coincide norma vehiculo: ", b, normatividad[b]);
              if(normatividad[b].instrucciones.length > 0){
                
                // Borrado de la lista en funcion al filtro
                if (this.state.selectedSerch.includes('pendiente')){
                  delete vehiculos2[0];
                } else if (this.state.selectedSerch.includes('proceso')){
                  delete vehiculos2[1];
                } else if (this.state.selectedSerch.includes('rechazada')){
                  delete vehiculos2[2];
                }
                
              }
            }
          }
        }        
    }*/
  }
  _filtrar = async ({text}) => {
    const vehiculos = await this._readJSONFiles('vihiculo');
    console.log('JSON vehiculos: ', vehiculos);

    const vehiculosF = vehiculos.filter((normatividad_vehiculo_persona, index) => {
      let apply = false;
      apply |= (this.state.selectedSerch.includes('cliente') ? normatividad_vehiculo_persona.vehiculo.codigo_vehiculo.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('ubicacion') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('pendienteCargas') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('error') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('cargada') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);

      return apply;
    });
    this.setState({...this.state,vehiculos:vehiculosF});
  }
  _onUbicationFilterChange(valueFilter, isSelected) {
    if(isSelected && !this.state.selectedSerch.includes(valueFilter)) {
      this.state.selectedSerch.push(valueFilter);

      this.setState({
        ...this.state,
        selectedSerch: this.state.selectedSerch
      });
    } else {
      this.setState({
        ...this.state,
        selectedSerch: this.state.selectedSerch.filter(e=> e!= valueFilter)
      });
    }
  }
  _onStatusFilterChange(valueFilter, isSelected) {
    if(isSelected && !this.state.selectedStatus.includes(valueFilter)) {
      this.state.selectedStatus.push(valueFilter);

      this.setState({
        ...this.state,
        selectedStatus: this.state.selectedStatus
      });
    } else {
      this.setState({
        ...this.state,
        selectedStatus: this.state.selectedStatus.filter(e=> e!= valueFilter)
      });
    }
  }
  _onLoadFilterChange(valueFilter, isSelected) {
    if(isSelected && !this.state.selectedLoads.includes(valueFilter)) {
      this.state.selectedLoads.push(valueFilter);

      this.setState({
        ...this.state,
        selectedLoads: this.state.selectedLoads
      });
    } else {
      this.setState({
        ...this.state,
        selectedLoads: this.state.selectedLoads.filter(e=> e!= valueFilter)
      });
    }
  }
  async _uploading() {
    if(this.state.isSendingData) {
      Alert.alert(
        'La información esta siendo enviada',
        '',
        [
          {text: 'ACEPTAR'},
        ],
        {cancelable: false},
      );
      return;
    }

    const info = await NetInfo.getConnectionInfo();
    if(info.type != 'wifi' && info.type!='cellular') {
      Alert.alert(
        'Error en conexión a internet',
        '',
        [
          {text: 'ACEPTAR'},
        ],
        {cancelable: false},
      );

      this.setState({
        ...this.state,
        isSendingData: false
      });

      return;
    }

    /*si hay conexion intenta descargarlo*/
    const respuestas = await this._readJSONFiles('respuestas');
    const rawResponse = await fetch(Params.respuestas, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(respuestas)
    });
    const content = await rawResponse.json();
    if(content.status && content.status == 'ok') {
      Alert.alert(
        'La información se actualizo correctamente',
        '',
        [
          {text: 'ACEPTAR'},
        ],
        {cancelable: false},
      );
    }
    this.setState({
      ...this.state,
      isSendingData: false
    });
  }
  async _loadDataVehiculos() {
    /*si no hay conexion cargo el archivo*/
    const info = await NetInfo.getConnectionInfo();
    if(info.type != 'wifi' && info.type!='cellular') {
      const vihiculo = await this._readJSONFiles('vihiculo');
      return vihiculo;
    }

    /*si hay conexion intenta descargarlo*/
    const usuario = await this._readJSONFiles('usuario');
    console.log({body: JSON.stringify({id_usuario: usuario.id_usuario})});
    const rawResponse = await fetch(Params.vehiculo, {
      method: 'POST',
      mode: "no-cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id_usuario: usuario.id_usuario})
    });
    console.log(rawResponse);
    const content = await rawResponse.json();
    console.log(content);
    for (var i = 0; i < content.length; i++) {
      if(content[i].vehiculo 
        && content[i].vehiculo.length 
        && content[i].vehiculo.length > 0) {
        content[i].vehiculo = content[i].vehiculo[0];
      }
    }
    console.log(content);
    await FileSystem.writeAsStringAsync(
      `${this.folderPath}/vihiculo.json`, 
      JSON.stringify(content), 
      { encoding: FileSystem.EncodingType.UTF8 });

    return content;
  }

  async _readJSONFiles(file) {
    const fileContent =  await FileSystem.readAsStringAsync(
      `${this.folderPath}/${file}.json`, 
      { encoding: FileSystem.EncodingType.UTF8 });
    const content = JSON.parse(fileContent);
    return content;
  }

  async _imagesFile() {
    let propsFile;
    let id_normatividad_vehiculo;
    const vehiculos = await this._readJSONFiles('vihiculo');

    for (var i = 0; i < vehiculos.length; i++) {
      id_normatividad_vehiculo = vehiculos[i]
        .id_normatividad_vehiculo;

      propsFile =  await FileSystem
        .getInfoAsync(`${this.folderPath}/images${id_normatividad_vehiculo}.json`);

      if (!propsFile.exists) {
        await FileSystem.writeAsStringAsync(
          `${this.folderPath}/images${id_normatividad_vehiculo}.json`, 
          JSON.stringify([]), 
          { encoding: FileSystem.EncodingType.UTF8 });
      }
    }
  }

  render() {
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

    /*Ready*/
    const items = this.state.vehiculos.map((normatividad_vehiculo_persona, index) => 
                     <Item 
                      key={index} 
                      titulo={normatividad_vehiculo_persona.vehiculo.codigo_vehiculo}
                      estatus={normatividad_vehiculo_persona.vehiculo.estatus}
                      onEvaluar={() => this.props.navigation.navigate('Instrucciones', 
                        { 
                          traza: {
                            id_normatividad_vehiculo: normatividad_vehiculo_persona.id_normatividad_vehiculo,
                            id_vehiculo: normatividad_vehiculo_persona.vehiculo.id_vehiculo,
                            id_normatividad: normatividad_vehiculo_persona.id_normatividad,
                            instruccion: {},
                          },
                        })
                      }
                      onGrafica={() => this.props.navigation.navigate('Instrucciones')}
                      onDescargar={() => this._uploading()}>
                        {normatividad_vehiculo_persona.vehiculo.descripcion}
                      </Item> 
                  );
    const placeholder = "Buscar ["+this.state.selectedSerch.join("|")+"]";

    /*View*/
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
              <View>
                <Titulo>Verificaciones</Titulo>
              </View>
              <View style={{marginBottom: 40}}>
                <Descripcion>Recuerda descargar y subir tus formas usando el icono de nube.</Descripcion>
              </View>
              <View style={{
                height: 40,
                backgroundColor: '#fff', 
                padding: 5,
                borderColor: 'gray', 
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 20
                }} >
                <View style={{
                  flex: 1, 
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  }}>
                  <FontAwesome
                    name="search"
                    size={25}
                    color="#e1e1e1"
                    style={{ 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    width: 25,
                    }}
                    />
                  <TextInput style={{ 
                    flex: 1, 
                    marginLeft: 5,
                    }} 
                    placeholder={placeholder}
                    placeholderTextColor="#808080" 
                    onChangeText={(text) => this._filtrar({text})} />
                  <TouchableOpacity
                    onPress={this._toggleModal}>
                    <FontAwesome
                      name="filter"
                      size={25}
                      color={Colors.negro}
                      style={{ 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                      width: 25,
                      }}
                      />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                {items}
              </ScrollView>
            </View>


            <Modal
              animationType="fade"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={()=>this._onClose()}>
              <View style={{marginTop: 22}}>
                <View style={{
                  paddingHorizontal: 20,
                }}>
                  <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'stretch',
                  }}>
                    <TituloPequeno>Filtros</TituloPequeno>
                    <TouchableOpacity
                      onPress={this._toggleModal}>
                      <FontAwesome
                        name="close"
                        size={25}
                        color={Colors.gris}
                        style={{ 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        width: 25,
                        marginTop: 16,
                        }}
                        />
                    </TouchableOpacity>
                  </View>
                  <View style={{
                    borderBottomColor: Colors.grisClaro,
                    borderBottomWidth: 1,
                    }}
                  />
                  
                  <SubTituloPequeno style={{marginTop: 10}}>Busqueda</SubTituloPequeno>
                    <CheckItem value="cliente" 
                    checked={this.state.selectedSerch.includes("cliente")}
                    onChange={(value,isSelected)=>this._onUbicationFilterChange(value, isSelected)}>
                      Cliente
                    </CheckItem>
                    <CheckItem value="ubicacion" 
                    checked={this.state.selectedSerch.includes("ubicacion")}
                    onChange={(value,isSelected)=>this._onUbicationFilterChange(value, isSelected)}>
                      Ubicación
                    </CheckItem>
                  
                  <SubTituloPequeno style={{marginTop: 10}}>Estatus</SubTituloPequeno>
                    <CheckItem value="pendiente" 
                    onChange={(value, isSelected)=>this._onStatusFilterChange(value, isSelected)}
                    checked={this.state.selectedStatus.includes("pendiente")}>
                      Pendiente
                    </CheckItem>
                    <CheckItem value="proceso" 
                    onChange={(value, isSelected)=>this._onStatusFilterChange(value, isSelected)}
                    checked={this.state.selectedStatus.includes("proceso")}>
                      En proceso
                    </CheckItem>
                    <CheckItem value="rechazada" 
                    onChange={(value, isSelected)=>this._onStatusFilterChange(value, isSelected)}
                    checked={this.state.selectedStatus.includes("rechazada")}>
                      Rechazada
                    </CheckItem>
                    <CheckItem value="aprobada" 
                    onChange={(value, isSelected)=>this._onStatusFilterChange(value, isSelected)}
                    checked={this.state.selectedStatus.includes("aprobada")}>
                      Aprobada
                    </CheckItem>
                    
                  <SubTituloPequeno style={{marginTop: 10}}>Cargas</SubTituloPequeno>
                    <CheckItem value="pendiente" 
                    onChange={(value, isSelected)=>this._onUbicationFilterChange(value, isSelected)}
                    checked={this.state.selectedLoads.includes("pendienteCargas")}>
                      Pendiente
                    </CheckItem>
                    <CheckItem value="error" 
                    onChange={(value, isSelected)=>this._onUbicationFilterChange(value, isSelected)}
                    checked={this.state.selectedLoads.includes("error")}>
                      Error de carga
                    </CheckItem>
                    <CheckItem value="cargada" 
                    onChange={(value, isSelected)=>this._onUbicationFilterChange(value, isSelected)}
                    checked={this.state.selectedLoads.includes("cargada")}>
                      Cargada
                    </CheckItem>
                </View>
              </View>
            </Modal>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
});
