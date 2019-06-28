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


export default class ItemFallas extends React.Component {

  render() {

    return (


    <View style={{
    	flexDirection: 'row',
    	marginBottom: 10
    	}}>
    	<View style={{flex: 4,
    		backgroundColor: '#fff', 
    		borderTopRightRadius: 10,
    		borderBottomRightRadius: 10,
    		}}>
    		<View style={{flex: 1,
			flexDirection: 'row',
			justifyContent: 'flex-start' ,
			padding: 5}}>
    			<CheckBox value={this.props.value}
                onChange={()=>this.props.onChange()}>
                </CheckBox>
    			<Descripcion style={{marginTop: 0, marginLeft: 0, marginRight: 20}}>
    				{this.props.children}
    			</Descripcion>
    		</View>
    	</View>

    	<View style={{
    		width: 80,
    		flexDirection: 'column',
    		justifyContent: 'center',
    		alignItems: 'stretch',
    		}}>
    		<View style={{
    			width: 80,
    			flexDirection: 'row',
    			justifyContent: 'space-between',
    			alignItems: 'center', 
    			}}>

    			<TouchableOpacity onPress={() => this.props.onInfo()} underlayColor="white">
    				<View style={{
    					height: 36,
    					width: 36,
    					flexDirection: 'column',
    					justifyContent: 'center',
    					alignItems: 'center', 
    					borderRadius: 4,
    					}}>
    					<FontAwesome
    						name="wrench"
    						size={22}
    						color={Colors.grisOscuro}
    						/>

    					</View>
    				</TouchableOpacity>

    				<TouchableOpacity onPress={() => this.props.onPress()} underlayColor="white">
    					<View style={{
    						height: 36,
    						width: 36,
    						flexDirection: 'column',
    						justifyContent: 'center',
    						alignItems: 'center', 
    						borderRadius: 4,
    						}}>
    						<Ionicons
    							name="ios-list-box"
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

