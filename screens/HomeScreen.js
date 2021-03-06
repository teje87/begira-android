import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import axios from 'axios';
import {List, ListItem, Card, Divider, Header, Button} from 'react-native-elements';
import { WebBrowser } from 'expo';
import PureChart from 'react-native-pure-chart';
import { DangerZone } from 'expo';
let { Lottie } = DangerZone;
import lottieJson from '../assets/lottie/hide1.json';
import {VictoryPie} from 'victory-native';
import {connect} from 'react-redux'


import { MonoText } from '../components/StyledText';

class HomeScreen extends React.Component {
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
      disp3: [],
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

      axios.get("http://192.168.0.129:3000/api/Onlines")
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
      let disp2 = await axios.get("http://192.168.0.129:3000/api/ActualEstacion22s/rechazoTotal")
      let disp1= await axios.get("http://192.168.0.129:3000/api/ActualEstacion21s/rechazoTotal")
      let disp3 = await axios.get("http://192.168.0.129:3000/api/ActualEstacion23s/rechazoTotal")
      
      disp1 = parseFloat(disp1.data[0].valor.replace(',', '.'))
      disp2 = parseFloat(disp2.data[0].valor.replace(',', '.'))
      disp3 = parseFloat(disp3.data[0].valor.replace(',', '.'))
      
      await this.setState({disp1: disp1 , disp2: disp2, disp3: disp3})
      
      
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
      let chartData = await axios.get("http://192.168.0.129:3000/api/ActualHoras")
      chartData.data.forEach(element => {
        dataTable.push({x: element.id, y:element.empaquetados, color: '#297AB1'})
      });
      this.props.showEncajados(dataTable)
    }

   


    showRechazoDisp()
    showEncajados()
    showEstaciones()
    
  }
  
  componentDidUpdate(){
    _playAnimation()
    
  }
  

  render() {
    
    return (
      <View style={styles.container}>

        <Header
          backgroundColor = {"#253EA7"}
          outerContainerStyles = { {height : 85 }}
          centerComponent={
            <View style={styles.animationContainer}>
              {
              <Lottie
                ref={animation => {
                  this.animation = animation;
                }}
                style={{
                  width: 160,
                  height: 160,
                  backgroundColor: '#253EA7',
                }}
                source={this.state.animation}
              />}
            </View>}
        />



        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
                
          
          <Card>
                  {/* Rechazos Disp1 */}
            <Card>
              <Button
              rounded
              icon={{type: 'material-community',name: 'eyedropper'}}
              title='Disp 1' 
              backgroundColor = "#2978FF"/>

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

            </Card>

                  {/* Rechazos Disp2 */}
            <Card>
              <Button
                rounded
                icon={{type: 'material-community',name: 'eyedropper'}}
                title='Disp 2' 
                backgroundColor = "#2978FF"/>

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
              
                  {/* Rechazos Gota Seca */}
            <Card>
              <Button
                rounded
                icon={{type: 'entypo',name: 'drop'}}
                title='gota seca' 
                backgroundColor = "#2978FF"/>

              <VictoryPie
                width= {300}
                height= {130}
                labels={(d) =>  d.y}
                colorScale={["tomato", "black"]}
                padAngle={3}
                radius={20}
                innerRadius={10}
                data={[
                  { x: "DISP1 NOK", y: this.state.disp3 },
                  { x: "DISP1 OK", y: (100-this.state.disp3) }
                ]}
              />
                
            </Card>

          </Card>


          </View>
          <List>
            
            
            <Card>
              <PureChart type={'line'}
                data={this.props.horasEncajadas}
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
    backgroundColor: "#2978FF",
    alignItems: 'center',
    justifyContent: 'center',
    height:50
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


//REDUX 

const mapStateToProps = state => {
  return{
    horasEncajadas: state.horasEncajadas,
    estaciones: state.estaciones ,
    disp1: state.disp1,
    disp2: state.disp2
  };
};

const mapDispatchToProps = dispatch => {
  return{
    showEncajados: (value) => {
      dispatch({type: 'SHOW_ENCAJADOS', value})
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)


