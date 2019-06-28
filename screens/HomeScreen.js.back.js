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
  TouchableWithoutFeedback,
} from 'react-native';

import { FileSystem, AppLoading } from 'expo';

import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import { gql } from "apollo-boost";

import { MonoText, Titulo, Descripcion } from '../components/StyledText';
import Item from '../components/Item';

import { bookListQuery } from '../constants/Queries';
import Colors from '../constants/Colors';




const client = new ApolloClient({
  uri: "http://10.0.0.20:8080/graphql/"
  //uri: "http://10.108.162.233:8080/graphql/"
});

export default class HomeScreen extends React.Component {

  folderPath = `${FileSystem.documentDirectory}formas`;

  state = {
    isLoadingComplete: false,
    info: {as:'sd'},
    texto: 'esto es algo de texto',
  };

  static navigationOptions = {
    header: null,
  };

  _loadResourcesAsync = async () => {
    const props =  await FileSystem.getInfoAsync(`${this.folderPath}`);

    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(this.folderPath, {
        intermediates: true,
      });
    }
    testFolder = await FileSystem.getInfoAsync(`${this.folderPath}`);

    await FileSystem.writeAsStringAsync(`${this.folderPath}/codigo.json`, JSON.stringify(this.state), { encoding: FileSystem.EncodingTypes.UTF8 });

    this.setState({...this.state,info:props});
  };


  info = async () => {
    const content =  await FileSystem.readAsStringAsync(`${this.folderPath}/codigo.json`, { encoding: FileSystem.EncodingTypes.UTF8 });
    const estado = JSON.parse(content);
    this.setState({...this.state,info:content, texto : estado.texto + '_a' });
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };


  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {

    return (
      <ApolloProvider client={client}>
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
              <TouchableWithoutFeedback onPress={this.info}>
                <Titulo>Revisiones</Titulo>
              </TouchableWithoutFeedback>
              </View>
              <View style={{marginBottom: 40}}>
                <Descripcion>Recuerda descargar y subir tus formas usando el icono de nube. {this.state.texto}</Descripcion>
              </View>
              <Query query={gql`{
                    bookList { 
                      id 
                      name 
                      pageCount
                    } 
                  }
                `}>
                {({ loading, error, data }) => {
                  if (loading) return (<ActivityIndicator/>);
                  if (error) return (<ActivityIndicator/>);

                  return data.bookList.map(({ id, name, pageCount }, index) => {


                     return (<Item 
                      key={index} 
                      onEvaluar={() => this.props.navigation.navigate('Instrucciones')}
                      onGrafica={() => this.props.navigation.navigate('Instrucciones')}
                      onDescargar={() => this.props.navigation.navigate('Formulario')}></Item> );
                  });
                }}
              </Query>

            </View>
          </View>
      </ApolloProvider>
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
});
