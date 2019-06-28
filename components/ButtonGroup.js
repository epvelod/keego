import React from 'react';
import {
  StyleSheet,
  CheckBox,
  Text,
  View,
  TouchableHighlight, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  TouchableWithoutFeedback, 
} from 'react-native';

import Colors from '../constants/Colors';
import { MonoText, Titulo, SubTitulo, Descripcion, Dato } from '../components/StyledText';

export default class ButtonGroup extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {selectedIndex:props.selectedIndex};

	  console.log('props.selectedIndex: '+props.selectedIndex)
	}
	_onPress(index) {
		this.setState({
			selectedIndex: index
		});
		this.props.onPress(index);
	}
  render() {
		const buttons = this.props.buttons;
		const radius = 5;
		console.log(buttons);
		const items = buttons.map((elem, index)=>{
	     return (<TouchableWithoutFeedback
        				key={index} 
        				style={{flex: 1}}
	      	      onPress={() => this._onPress(index)}
	      	      >
	      	      	<View 
	      	      style={{
	      	      flex: 1,
	      	      alignItems:'center',
	      	      justifyContent:'center',
	      	      height:60,
	      	      backgroundColor: (index===this.state.selectedIndex || index===this.props.selectedIndex? Colors.negro: '#cacaca'),
	      	      borderTopLeftRadius: index===0?radius:0,
	      	      borderBottomLeftRadius: index===0?radius:0,
	      	      borderTopRightRadius: index===buttons.length-1?radius:0,
	      	      borderBottomRightRadius: index===buttons.length-1?radius:0,
	      	      borderLeftWidth: index===0?0:1,
	      	      borderLeftColor: '#fff'
	      	      }}>
	      	      	<Text style={{color: '#fff'}}>{elem}</Text>
	      	      	</View>
	      	      </TouchableWithoutFeedback>);
		});

    return (
    	<View style={{
    			flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center' ,
          minHeight: 60
        }}>
	      {items}
    	</View>
    );
  }
}

