import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import axios from 'axios';
import {List, ListItem} from 'react-native-elements';
import { WebBrowser } from 'expo';
import PureChart from 'react-native-pure-chart';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      estaciones : [],
      horasEncajadas: [],
    }
  }

  componentWillMount(){
    
    //ASK ENCAJADOS HORA
    const showEncajados = async () => {
      
      let dataTable = []

      let chartData = await axios.get("http://192.168.0.64:3000/api/ActualHoras")
      
      chartData.data.forEach(element => {
        dataTable.push({x: element.id, y:element.empaquetados, color: '#297AB1'})
      });

      
      

      this.setState({
        horasEncajadas: dataTable
      })

      console.log(Array.isArray(this.state.horasEncajadas))
      console.log(this.state.horasEncajadas)
    }
  
    showEncajados()
  }
  

  

  render() {

    

    const onPressShowRechazoDisp1 = () => {
      axios.get("http://192.168.0.64:3000/api/ActualEstacion21s/rechazoTotal")
        .then((disp1)=> console.log(disp1.data))
        .catch(err => console.log(err))
    }

    const onPressShowRechazoDisp2 = () => {
      axios.get("http://192.168.0.64:3000/api/ActualEstacion22s/rechazoTotal")
        .then((disp2)=> console.log(disp2.data))
        .catch(err => console.log(err))
    }

    const onPressShowEstaciones = () => {

      let copyEstaciones = {};

      axios.get("http://192.168.0.64:3000/api/Onlines")
      .then((estaciones)=> {
        copyEstaciones = [...estaciones.data]
        console.log(copyEstaciones)
        colorState(copyEstaciones)
        this.setState({
          estaciones: copyEstaciones
        }) 
      })
      .catch(err => console.log(err))
    }

   

    const logState = ()=>{
      console.log(this.state.estaciones)
    }

    const colorState = (estaciones)=> {
      estaciones.map((estacion)=> {
        switch(true){
          case estacion.estado == 0: 
            estacion.estado = "#E0E0E0"
            break;
          case estacion.estado == 1:
            estacion.estado = "#FF3D00";
            break;
          case estacion.estado == 2:
            estacion.estado = "#FFC400";
            break;
          case estacion.estado == 3:
            estacion.estado = "#00E676";
            break;
          case estacion.estado > 3:
            estacion.estado = "#212121"
            break;
        }
      })

    }

   
    const fill = 'rgb(134, 65, 244)'
    
  
    
    return (
      <View style={styles.container}>
     
     
          


        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Button
              onPress={onPressShowRechazoDisp1}
              title="Dispensadora1"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={onPressShowRechazoDisp2}
              title="Dispensadora2"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={onPressShowEstaciones}
              title="Estaciones"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              onPress={logState}
              title="LOG ESTADO"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

          <List containerStyle={{marginBottom: 20}}>
            
          <PureChart type={'line'}
            data={this.state.horasEncajadas}
            height={100}
            numberOfYAxisGuideLine={10} />
            
            {
              this.state.estaciones.map((l) =>
                
                (  
                  <ListItem
                    roundAvatar
                    leftIcon={
                      {name: 'brightness-1',
                    'color': l.estado}
                    }
                    key={l.id}
                    title={l.maquinas}
                    rightIcon={
                      {name: 'chevron-right'}
                    }
                    
                  />
                )
                
              )
            }
          </List>

  
        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
//1 rojo
//2 naranja
//3 verde