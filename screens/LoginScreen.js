import React from 'react';
import { Alert, Animated, Button , View, Text, TextInput, Image, ImageBackground, NetInfo } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import { FontAwesome } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system'


import Colors from '../constants/Colors';
import Params from '../constants/Params';


class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2500,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default class LoginScreen extends React.Component {
  folderPath = `${FileSystem.documentDirectory}formas`;
  state = {
  	user : '',
  	pass : '',
  };
  async _login() {
		const digest = await Crypto.digestStringAsync(
		  Crypto.CryptoDigestAlgorithm.SHA256,
		  this.state.pass
		);

    /*login internet*/
		const info = await NetInfo.getConnectionInfo();
  	if(info.type=='wifi' || info.type=='cellular') {
  		if(await this._netLogin(this.state.user, digest)){
    		this.props.navigation.navigate('Main');	
    		return;
  		} else {
        Alert.alert(
          'Usuairo o contraseña invalido',
          '',
          [
            {text: 'OK', 
            onPress: () => 
              this.setState({
                ...this.state,
                pass: '' ,
              })
            },
          ],
          {cancelable: false},
        );
        return;
      }
  	}

    /*login offline*/
		const fileContent =  await FileSystem.readAsStringAsync(
			`${this.folderPath}/usuario.json`, 
			{ encoding: FileSystem.EncodingType.UTF8 });
		const usuario = JSON.parse(fileContent);

  	if( digest == usuario.password && usuario.user == this.state.user) {
    	this.props.navigation.navigate('Main');
  	} else {
      Alert.alert(
        'Usuairo o contraseña invalido',
        '',
        [
          {text: 'OK', 
          onPress: () => 
				  	this.setState({
				  		...this.state,
				  		pass: '' ,
				  	})
				  },
        ],
        {cancelable: false},
      );
  	}
  }

  async _fetchUserAsync(usr,pass) {
	  const rawResponse = await fetch(Params.login, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({usr: usr, pass: pass})
	  });
	  const content = await rawResponse.json();
	  return content;
	}

  _usr({text}) {
  	this.setState({
  		...this.state,
  		user: text ,
  	});
  }

  _pass({text}) {
  	this.setState({
  		...this.state,
  		pass: text ,
  	});
  }

  async _netLogin(usr,pass) {
  	const result  = await this._fetchUserAsync(usr,pass);

  	if(!result || !result.loged) {
  		return false;
  	}

    const props =  await FileSystem.getInfoAsync(`${this.folderPath}`);
    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(this.folderPath, {
        intermediates: true,
      });
    }

    const propsFile =  await FileSystem.getInfoAsync(`${this.folderPath}/usuario.json`);
    await FileSystem.writeAsStringAsync(
      `${this.folderPath}/usuario.json`, 
      JSON.stringify(result), 
      { encoding: FileSystem.EncodingType.UTF8 });
    
    return true;
  }
  render() {
    return (

    <ImageBackground source={require('../img/fondo-keego-2.jpg')} 
    	style={{
    	width: '100%', 
    	height: '100%',
    	flex: 1,
    	flexDirection: 'column',
    	justifyContent: 'center',
    	alignItems: 'stretch',
    	}} >
    	<FadeInView
    		style={{ 
    		flexDirection: 'column',
    		justifyContent: 'center',
    		alignItems: 'center'
    		}}
    		>
    		<FontAwesome
    			name="lock"
    			size={100}
    			color={Colors.grisClaro}
    			style={{ 
    			flexDirection: 'column',
    			justifyContent: 'center',
    			alignItems: 'stretch',
    			}}
    			/>
    	</FadeInView>
		<View style={{
			height: 160,
			margin: 20, 
			paddingTop: 20,
			paddingLeft: 10,
			paddingRight: 10,
			paddingBottom: 20,
			backgroundColor: 'rgba(255, 255, 255, 0.8)', 
			borderRadius: 5,
			}} >
			<View style={{
				height: 40,
				backgroundColor: '#fff', 
				padding: 5,
				}} >
				<View style={{
					flex: 1, 
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'stretch',
					}}>
					<FontAwesome
						name="user-circle"
						size={30}
						color="#e1e1e1"
						style={{ 
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'stretch',
						width: 33,
						}}
						/>
					<TextInput style={{ 
						flex: 1, 
						}} 
						placeholder="Usuario"
						onChangeText={(text) => this._usr({text})}
						placeholderTextColor="#808080" />
				</View>
			</View>
			<View style={{
				height: 40,
				backgroundColor: '#fff', 
				padding: 5,
				marginTop: 5
				}} >
				<View style={{
					flex: 1, 
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'stretch',
					}}>
					<FontAwesome
						name="shield"
						size={30}
						color="#e1e1e1"
						style={{ 
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'stretch',
						width: 33,
						}}
						/>
					<TextInput style={{ 
						flex: 1, 
						}} 
						secureTextEntry={true}
						onChangeText={(text) => this._pass({text})}
						placeholder="Password"
						placeholderTextColor="#808080" />
				</View>
			</View>

			<View style={{
				height: 50, 
				marginTop: 10, 
				}} >
				<Button
					title="Entrar"
					color={Colors.negro}
					style={{
					}}
					onPress={() => this._login()}
					/>
    		</View>
    	</View>
    </ImageBackground>
    );
  }
}