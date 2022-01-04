import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, StyleSheet, Dimensions, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const HomeScreen = ({navigation}) => {

    const [lastRecord, setLastRecord] = React.useState([]);
    const [user, setUser] = React.useState();
    const [lastInsulina, setLastInsulina] = React.useState([]);

    const userToken = useContext(TokenContext);

    const getUserName = async (id) => {
      try {      
        let response = await fetch(`${URL}/user/getName/${id}`);
        
        let json = await response.text();

        setUser(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getLastRecord = async (id) => {
      try {      
        let response = await fetch(`${URL}/registo/getLatest/${id}`);
        
        let json = await response.json();
  
        setLastRecord(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getLastInsRecord = async (id) => {
      try {      
        let response = await fetch(`${URL}/registoIns/getLatest/${id}`);
        
        let json = await response.json();
  
        setLastInsulina(json);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getUserName(userToken);
      getLastRecord(userToken);
      getLastInsRecord(userToken);
    }, []);
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <Animatable.View animation="fadeInDown" duraton="1500" style={styles.header}>
          <LinearGradient colors={['#35cc98', '#27ab7d']}>
            
          </LinearGradient>
        </Animatable.View>
        
        <ScrollView style={styles.footer}>
          <View style={{height: 100}}></View>

          <Animatable.View animation="fadeInLeftBig" duraton="2000">
            <Text style={styles.title}>Hello,</Text>
            <Text style={{...styles.subtitle, marginBottom: 40 }}>{user}</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInLeftBig" duraton="3000" style={{
              ...styles.card,
              ...styles.shadow
            }}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last insulin intake</Text>
              <View style={styles.item}>
                <MaterialCommunityIcons name="heart-flash" color="#05375a" size={30}/>
                <View>
                  <Text style={styles.infoSecondaryText}>Doses administered</Text>
                  <Text style={styles.infoText}>{lastInsulina.qtInsulina} doses</Text>
                </View>
              </View>
              <View style={{...styles.item, marginLeft: 30}}>
                <View>
                  <Text style={styles.infoSecondaryText}>Type</Text>
                  <Text style={styles.infoText}>Bazal</Text>
                </View>
              </View>
              <View style={styles.item}>
                <MaterialCommunityIcons name="calendar-heart" color="#05375a" size={30}/>
                <View>
                  <Text style={styles.infoSecondaryText}>Date and Hour</Text>
                  <Text style={styles.infoText}>{formatDate(lastInsulina.dataHora, 1)}</Text>
                </View>
              </View>
            </Animatable.View>
          
          <Animatable.View animation="fadeInRightBig" duraton="3000" style={{
            ...styles.card,
            ...styles.shadow
          }}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Weight</Text>
                <Text style={styles.infoText}>{lastRecord.peso} kg</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="heart-pulse" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Imc</Text>
                <Text style={styles.infoText}>{lastRecord.imc} %</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Blood sugar</Text>
                <Text style={styles.infoText}>{lastRecord.qtGlicose} mg/dL</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Carbohydrates</Text>
                <Text style={styles.infoText}>{lastRecord.qtHidratos}</Text>
              </View>
            </View>            
          </Animatable.View>
          <View style={{height: 200}}></View>
        </ScrollView>
      </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  header: {
    justifyContent: 'center',
    backgroundColor: '#28b584',
    width: dms.width,
    height: dms.height*0.45,
    borderBottomLeftRadius: dms.width*0.08,
    borderBottomRightRadius: dms.width*0.08,
    position: 'relative',
    zIndex: 1
  },
  footer: {
      alignSelf: 'stretch',
      zIndex: 2,
      marginTop: -300
  },
  card: {
    alignSelf: 'stretch',
    margin: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5
  },
  infoText: {
    fontSize: 17,
    marginLeft: 13,
  },
  infoSecondaryText: {
    color: '#b0b0b0',
    marginLeft: 16,
  },
  shadow: {
    shadowColor: '#a3a3a3',
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8
  },
  title: {
    color: '#fff',
    fontSize: 46,
    fontWeight: 'bold',
    textShadowColor: '#a3a3a3',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
    marginLeft: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: '#a3a3a3',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
    marginLeft: 20,
  }
});