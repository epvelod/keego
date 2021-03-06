import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
} from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { MonoText, Titulo, SubTitulo, Descripcion, Dato } from '../components/StyledText';


export default class Item extends React.Component {

  render() {
	const level = [
		Colors.pendiente,
		Colors.modificado,
		Colors.completo];
	const MAX_TEXT = 100;
	const text = this.props.children?(this.props.children.length>MAX_TEXT?(this.props.children.substring(0, MAX_TEXT)+'...'):this.props.children):'';

    return (
		<View style={{
		minHeight: 80,
		flexDirection: 'row',
		marginBottom: 10
		}}>
			<TouchableOpacity onPress={() => this.props.onDescargar()} underlayColor="white">
				<View style={{
		              width: 45,
		              flexDirection: 'column',
		              justifyContent: 'center',
		              alignItems: 'stretch',
				  }}>
				      <FontAwesome
				        name="database"
				        size={26}
				        style={{  }}
				        color={Colors.grisOscuro}
				      />
				      <FontAwesome
				        name="cloud"
				        size={26}
				        style={{ paddingLeft: 10 }}
				        color={level[this.props.estatus]}
				      />
				</View>
			</TouchableOpacity>
			<View style={{flex: 4,
			  backgroundColor: '#fff', 
			  borderTopRightRadius: 10,
			  borderBottomRightRadius: 10
			  }}>
			  <View style={{flex: 1,
			  flexDirection: 'column',
			  justifyContent: 'space-evenly',
			  padding: 5}}>
			    <SubTitulo>{this.props.titulo}</SubTitulo>
			    <Descripcion style={{fontSize: 12}}>{text}</Descripcion>
			  </View>
			</View>

				<View style={{
		          width: 80,
				  flexDirection: 'column',
				  justifyContent: 'center',
				  alignItems: 'stretch',
				  }}>
		            <View style={{
		              height: 60,
		              width: 80,
		              flexDirection: 'row',
		              justifyContent: 'space-between',
		              alignItems: 'center', 
		              }}>

						<TouchableOpacity onPress={() => this.props.onGrafica()} underlayColor="white">
				            <View style={{
				              height: 36,
				              width: 36,
				              flexDirection: 'column',
				              justifyContent: 'center',
				              alignItems: 'center', 
			              	  backgroundColor: Colors.gris,
				              borderRadius: 18,
				              }}>
								<FontAwesome
									name="bar-chart"
									size={22}
									color={Colors.grisOscuro}
								/>
				                
				            </View>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => this.props.onEvaluar()} underlayColor="white">
				            <View style={{
				              height: 36,
				              width: 36,
				              flexDirection: 'column',
				              justifyContent: 'center',
				              alignItems: 'center', 
			              	  backgroundColor: Colors.gris,
				              borderRadius: 18,
				              }}>
								<FontAwesome
									name="calendar-check-o"
									size={22}
									color={Colors.grisOscuro}
								/>
				            </View>
						</TouchableOpacity>
		            </View>
				</View>
		</View>
    );
  }
}

