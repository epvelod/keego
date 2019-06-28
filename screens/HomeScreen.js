import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
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

import vehiculos from '../data/vehiculos.json';
import usuario from '../data/usuario.json';

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
    vehiculos: vehiculos,
  };

  static navigationOptions = {
    header: null,
  };

  /*                 Eventos          **/
  /*Loading method*/
  _loadResourcesAsync = async () => {
    console.log('traza 1');
    const props =  await FileSystem.getInfoAsync(`${this.folderPath}`);
    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(this.folderPath, {
        intermediates: true,
      });
    }
    console.log('traza 2');
    const propsFile =  await FileSystem.getInfoAsync(`${this.folderPath}/respuestas.json`);
    console.log(propsFile);
    if (!propsFile.exists) {
    console.log('encoding:');
    console.log(FileSystem);
    console.log(FileSystem.EncodingType);
      await FileSystem.writeAsStringAsync(
        `${this.folderPath}/respuestas.json`, 
        JSON.stringify([]), 
        { encoding: FileSystem.EncodingType.UTF8 });
    console.log('fin');
    }
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/respuestas.json`, { encoding: FileSystem.EncodingType.UTF8 });
    console.log('traza 3.5');
    console.log(content);
  };
  _handleLoadingError(error) {
    console.warn(error);
  }
  _handleFinishLoading = () => {
    this.setState({ ...this.state, isLoadingComplete: true });
  };

  _toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  _onClose = () => {
    this.setState({
      ...this.state,
      modalVisible: false,
    });
  };
  _filtrar = ({text}) => {
    const vehiculosF = vehiculos.filter(({ normatividad_vehiculo_persona }, index) => {
      let apply = false;
      apply |= (this.state.selectedSerch.includes('cliente') ? normatividad_vehiculo_persona.vehiculo.codigo_vehiculo.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('ubicacion') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);
      apply |= (this.state.selectedSerch.includes('pendiente') ? normatividad_vehiculo_persona.vehiculo.ubicacion.estado.includes(text) : false);

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
    const items = this.state.vehiculos.map(({ normatividad_vehiculo_persona }, index) => 
                     <Item 
                      key={index} 
                      titulo={normatividad_vehiculo_persona.vehiculo.codigo_vehiculo}
                      estatus={normatividad_vehiculo_persona.vehiculo.estatus}
                      onEvaluar={() => this.props.navigation.navigate('Instrucciones', 
                        { 
                          traza: {
                            id_vehiculo: normatividad_vehiculo_persona.vehiculo.id_vehiculo,
                            id_normatividad: normatividad_vehiculo_persona.id_normatividad,
                            instruccion: {},
                          },
                        })
                      }
                      onGrafica={() => this.props.navigation.navigate('Instrucciones')}
                      onDescargar={() => this.props.navigation.navigate('Formulario')}>
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
              <View>
                {items}
              </View>
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
                    onChange={(value, isSelected)=>this._onUbicationFilterChange(value, isSelected)}
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
                    onChange={(value, isSelected)=>this._onLoadFilterChange(value, isSelected)}
                    checked={this.state.selectedLoads.includes("pendiente")}>
                      Pendiente
                    </CheckItem>
                    <CheckItem value="error" 
                    onChange={(value, isSelected)=>this._onLoadFilterChange(value, isSelected)}
                    checked={this.state.selectedLoads.includes("error")}>
                      Error de carga
                    </CheckItem>
                    <CheckItem value="cargada" 
                    onChange={(value, isSelected)=>this._onLoadFilterChange(value, isSelected)}
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
