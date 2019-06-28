import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  Modal, 
} from 'react-native';
import * as FileSystem from 'expo-file-system'
import { MonoText } from '../components/StyledText';

export default class Formulario extends React.Component {
  

  setModalVisible(visible) {
    this.setState({modalVisible: visible,info:{}});
  }

  constructor(props){
    super(props);
    this.state = {
    	modalVisible: false,
  	};

    this.checkAndCreateFolder = this.checkAndCreateFolder.bind(this);
    this.check = this.check.bind(this);

  }

 async checkAndCreateFolder(folder_path) {
  const folder_info = await Expo.FileSystem.getInfoAsync(folder_path);
  if (!Boolean(folder_info.exists)) {
    // Create folder
    try {
      await FileSystem.makeDirectoryAsync(folder_path, {
        intermediates: true
      });
    } catch (error) {
      const new_folder_info = await Expo.FileSystem.getInfoAsync(folder_path);
    }
  }

}

check(){
  Expo.FileSystem.getInfoAsync(FileSystem.documentDirectory+'formularios').then(folder_info=>{
      this.setState({...this.state,info:folder_info});
    });
}

  componentDidMount() {
    (() => this.checkAndCreateFolder(FileSystem.documentDirectory+'formularios'))();

    
  }


  static navigationOptions = {
    header: null,
  };

  render() {
    return (
          <View style={{
              flex: 1,}}>
            <View style={{
                height: 25,
                backgroundColor: '#07c'}}>
            </View>
            <View style={{
              flex: 1,
              alignItems: 'stretch',
              backgroundColor: '#e1e1e1',
              padding: 10,
              }}>
              <Card
								title={'1'}
								name="Cuenta con"
								pageCount={0} 
								onPress = {()=>this.setModalVisible(!this.state.modalVisible)}>
							</Card>

            </View>
            <Modal
		          animationType="slide"
		          transparent={false}
		          visible={this.state.modalVisible}
		          onRequestClose={() => {
		            Alert.alert('Modal has been closed.');
		          }}>
		          <View style={{marginTop: 22}}>
		            <View>
		              <Text>Hello World!</Text>

		              <TouchableHighlight
		                onPress={() => {
		                  this.setModalVisible(!this.state.modalVisible);
		                }}>
		                <Text>{FileSystem.documentDirectory}</Text>
		              </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.check()
                    }}>
                    <Text>{JSON.stringify(this.state.info)}</Text>
                  </TouchableHighlight>
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
