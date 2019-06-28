import React from 'react';
import { Text } from 'react-native';

export class MonoText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}

export class Titulo extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, 
    	
	{
                  fontFamily: 'Microsoft YaHei',
                  fontSize: 30,
                  fontWeight: 'bold',
                  marginTop: 15,
                  marginBottom: 10,
    }

    	]} />;
  }
}

export class SubTitulo extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, 
    	
	{
                  fontFamily: 'Microsoft YaHei',
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginTop: 5,
    }

    	]} />;
  }
}

export class Descripcion extends React.Component {
  render() {
    return <Text {...this.props} color='#262626' style={[ 
    	
	{
                  fontFamily: 'Microsoft YaHei',
                  fontSize: 14,
                  marginTop: 2,
                  marginBottom: 2,
	              textAlign: 'justify',

    },
    this.props.style

    	]} />;
  }
}

export class Dato extends React.Component {
  render() {
    return <Text {...this.props} color='#262626' style={[this.props.style, 
    	
	{
                  fontFamily: 'Century Gothic',
                  fontSize: 9,
                  marginTop: 4,
                  marginBottom: 2,
	              fontStyle: 'italic',

    }

    	]} />;
  }
}


export class TituloPequeno extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, 
      
  {
                  fontFamily: 'Microsoft YaHei',
                  fontSize: 20,
                  marginTop: 16,
                  marginBottom: 10,
    }

      ]} />;
  }
}

export class SubTituloPequeno extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, 
      
  {
                  fontFamily: 'Microsoft YaHei',
                  fontSize: 14,
                  marginTop: 5,
    }

      ]} />;
  }
}