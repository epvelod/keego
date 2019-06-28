import React from 'react';
import {
  Platform,
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


export default class CheckItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:props.value,
      selected: props.checked,
    };
  }
  _onChange() {
    this.props.onChange(this.state.value, !this.state.selected);

    this.setState({
      ...this.state,
      selected: !this.state.selected
    });
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={() => this.props.onPress()}>
        <View style={{ flexDirection: 'row' }}>
              <CheckBox value={this.state.selected}
              onChange={()=>this._onChange()}>
              </CheckBox>
              <Descripcion style={{marginTop: 5,color: Colors.grisOscuro, fontWeight: 'bold'}}>
              {this.props.children}
              </Descripcion>
        </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => this.props.onPress()}>
        <View style={{ flexDirection: 'row' }}>
              <CheckBox value={this.state.selected}
              onChange={()=>this._onChange()}>
              </CheckBox>
              <Descripcion style={{marginTop: 5,color: Colors.grisOscuro, fontWeight: 'bold'}}>
              {this.props.children}
              </Descripcion>
        </View>
        </TouchableHighlight>
      );
    }

  }
}

