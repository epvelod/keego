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


export default class ItemComponente extends React.Component {

  render() {
    return (
    	<View style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between' ,
      alignItems: 'stretch' ,
      marginBottom: 10
      }}>
      	<View style={{
          flex: 1, 
          flexDirection: 'row'
          }}>
          		<CheckBox value={this.props.value}
              onChange={()=>this.props.onChange()}></CheckBox>
          		<Descripcion style={{marginTop: 5}}>
          		{this.props.children}
          		</Descripcion>
      	</View>
        <View style={{
          width: 40,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          }}>
          <View style={{
            width: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center', 
            }}>
            <TouchableWithoutFeedback onPress={() => this.props.onPress()} underlayColor="white">
              <View style={{
                height: 36,
                width: 36,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', 
                borderRadius: 4,
                }}>
                <FontAwesome
                  name="ellipsis-h"
                  size={22}
                  color={Colors.grisOscuro}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
    	</View>
    );
  }
}

