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

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { MonoText, Titulo, SubTitulo, Descripcion, Dato } from '../components/StyledText';


export default class BotonIcon extends React.Component {

  render() {

    return (
      <TouchableOpacity
       style={{
       borderWidth:1,
       borderColor:Colors.verdeClaro,
       alignItems:'center',
       justifyContent:'center',
       width:60,
       height:60,
       backgroundColor:'#66cdaa',
       borderRadius:30
       }}

       onPress={() => this.props.onPress()}
       >
       <FontAwesome
        name={this.props.icon}
        size={26}
        color="#fff"
        />
      </TouchableOpacity>
    );
  }
}

