import React from 'react';
import { Animated, Button, View, Text, TextInput, Image, ImageBackground } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import usuario from '../data/usuario';


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
  state = {
  	user : '',
  	pass : '',
  };
  async _login() {

  	console.log(usuario.password);
    this.props.navigation.navigate('Main');
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