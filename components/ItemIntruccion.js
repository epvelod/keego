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

import Colors from '../constants/Colors';
import { MonoText, Titulo, SubTitulo, Descripcion, Dato } from '../components/StyledText';


export default class ItemIntruccion extends React.Component {

  render() {
	const altura=80;
	const ancho=5;
	const diametro=this.props.selected?22:this.props.marked?15:18;
	const left=20;

	const text = this.props.children?(this.props.children.length>120?(this.props.children.substring(0, 120)+'...'):this.props.children):'';
	const color = this.props.selected?Colors.negro:this.props.marked?Colors.grisOscuro:'#fff';

    return (

				<TouchableOpacity onPress={() => {
					if(this.props.marked) {
						this.props.onPress();
					}
				}}>
		<View style={{
		flexDirection: 'row',
			height: altura,
		}}>
			<View style={{
			      width: left*2
			  }}>
			  	<View
				  style={{
				    borderRightColor: Colors.grisClaro,
				    borderRightWidth: ancho,
				    position: 'absolute',
				    height: altura,  
				    width: ancho,
				    left: left
				  }}
				/>
			  	<View
				  style={{
			       borderWidth:1,
			       borderColor:Colors.grisOscuro,
				  	backgroundColor: color,
				    position: 'absolute',
			        borderRadius: diametro/2,
				    height: diametro,  
				    width: diametro,
				    left: left-diametro/2+ancho/2,
				    top: ((altura-diametro)/2),
				  }}
				/>
			</View>
			<View style={{flex: 1,
			  backgroundColor: '#fff', 
			  }}>
			    <Descripcion style={{}}>{text}</Descripcion>
			</View>
		</View>
				</TouchableOpacity>
    );
  }
}

