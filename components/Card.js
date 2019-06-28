import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  TouchableWithoutFeedback, 
} from 'react-native';

export default class Card extends React.Component {

  render() {
    return (
		<TouchableWithoutFeedback onPress={() => this.props.onPress()} underlayColor="white">
          	<View style={{
              minHeight: 80,
              flexDirection: 'row',
              marginBottom: 5
              }}>
	            <View style={{
	              flex: 2,
	              flexDirection: 'column',
	              justifyContent: 'center',
	              alignItems: 'stretch',
	              backgroundColor: '#00bcd4', 
	              borderTopLeftRadius: 10,
	              borderBottomLeftRadius: 10,
	              }}>
	                <Text style={{
	                  fontWeight: 'bold',
	                  color: '#fff',
	                  textAlign: 'center',
	                  fontSize: 11,
	                  }}>
	                  {this.props.title.toUpperCase()}
	                </Text>
	            </View>
	            <View style={{flex: 4,
	              backgroundColor: '#fff', 
	              borderTopRightRadius: 10,
	              borderBottomRightRadius: 10
	              }}>
	              <View style={{flex: 1,
	              flexDirection: 'column',
	              justifyContent: 'space-evenly',
	              padding: 5}}>
	                <Text style={{textAlign: 'center'}}>{this.props.name}</Text>
	                <Text style={{textAlign: 'right'}}>{this.props.pageCount}/879</Text>
	              </View>
	            </View>
          	</View>
        </TouchableWithoutFeedback>
    );
  }
}

