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
import {List, ListItem, Card, Divider, Header} from 'react-native-elements';
import { WebBrowser } from 'expo';
import PureChart from 'react-native-pure-chart';
import { DangerZone } from 'expo';
let { Lottie } = DangerZone;
import lottieJson from '../assets/lottie/hide1.json';
import {VictoryPie} from 'victory-native';


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
      disp1: [],
      disp2: [],
      animation: lottieJson,
    }

    colorState = (estaciones)=> {
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

    _playAnimation = () => {
      if (!this.state.animation) {
        this._loadAnimationAsync();
      } else {
        this.animation.reset();
        this.animation.play();
      }
    }

    
    showEstaciones = () => {

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


    showRechazoDisp = async () => {
      let disp2 = await axios.get("http://192.168.0.64:3000/api/ActualEstacion22s/rechazoTotal")
      let disp1= await axios.get("http://192.168.0.64:3000/api/ActualEstacion21s/rechazoTotal")
      
      disp1 = parseFloat(disp1.data[0].valor.replace(',', '.'))
      disp2 = parseFloat(disp2.data[0].valor.replace(',', '.'))
      
      await this.setState({disp1: disp1 , disp2: disp2})
      
      
      console.log(this.state.disp1)
      console.log(this.state.disp2)
          
    }

  
  }



  componentWillMount(){

    _loadAnimationAsync = async () => {
      this.setState({ animation: lottieJson })
    };
    
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

   


    showRechazoDisp()
    showEncajados()
    showEstaciones()
    
  }
  
  componentDidUpdate(){
    _playAnimation()
    
  }
  

  render() {

    

    

    

    

    const fill = 'rgb(134, 65, 244)'
    
  
    
    return (
      <View style={styles.container}>

<Header
  leftComponent={{ icon: 'menu', color: '#fff' }}
  backgroundColor = {"#81D4FA"}
  centerComponent={
    <View style={styles.animationContainer}>
      {
      <Lottie
        ref={animation => {
          this.animation = animation;
        }}
        style={{
          width: 140,
          height: 140,
          backgroundColor: '#81D4FA',
        }}
        source={this.state.animation}
      />}
    </View>}
  rightComponent={{ icon: 'home', color: '#fff' }}
/>



        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
          <Card>
          <VictoryPie
                width= {300}
                height= {130}
                labels={(d) =>  d.y}
                colorScale={["tomato", "black"]}
                padAngle={3}
                radius={20}
                innerRadius={10}
                data={[
                  { x: "DISP1 NOK", y: this.state.disp1 },
                  { x: "DISP1 OK", y: (100-this.state.disp1) }
                ]}
              />

          <Divider style={{ backgroundColor: 'grey' }} />

              <VictoryPie
              width= {300}
              height= {130}
              labels={(d) =>  d.y}
              colorScale={["tomato", "black"]}
              padAngle={3}
              radius={20}
              innerRadius={10}
              data={[
                { x: "DISP1 NOK", y: this.state.disp2 },
                { x: "DISP1 OK", y: (100-this.state.disp2) }
              ]}
            />
        </Card>


          </View>
          <List>
            
            
            <Card>
              <PureChart type={'line'}
                data={this.state.horasEncajadas}
                height={100}
                numberOfYAxisGuideLine={10} 
              />
            </Card>
            
            <Card>
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
            </Card>
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
  animationContainer: {
    backgroundColor: "#81D4FA",
    alignItems: 'center',
    justifyContent: 'center',
    height:40
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