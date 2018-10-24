import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import axios from 'axios';
import {Icon,List, ListItem} from 'react-native-elements';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      estaciones : []
    }
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
      axios.get("http://192.168.0.64:3000/api/Onlines")
      .then((estaciones)=> this.setState({ estaciones : estaciones.data}))
      .then(colorState)
      .catch(err => console.log(err))
    }

    const logState = ()=>{
      console.log(this.state.estaciones)
    }

    const colorState = ()=> {
      this.state.estaciones.map((estacion)=> {
        switch(estacion.estado){
          case "0": 
            estacion.estado = "grey"
            break;
          case "1":
            estacion.estado = "red";
            break;
          case "2":
            estacion.estado = "orange";
            break;
          case "3":
            estacion.estado = "green";
            break;
        }
      })
    }

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
            {
              this.state.estaciones.map((l) =>
                
                (  
                  <ListItem
                    roundAvatar
                    avatar={{uri:l.avatar_url}}
                    key={l.id}
                    title={l.maquinas}
                    
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