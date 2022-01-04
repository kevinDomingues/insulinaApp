import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../components/context';
import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';
import { ImcCalculation } from '../components/Calculations';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const RegisterGlucoseLevels = ({navigation}) => {

    const [user, setUser] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const userToken = useContext(TokenContext);

    const { signOut } = React.useContext(AuthContext);

    const getUser = async (id) => {
      try {      
        let response = await fetch(`${URL}/user/${id}`);
        
        let json = await response.json();
  
        setUser(json);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getUser(userToken);
    }, []);
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <View style={styles.header}>
          <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
              <Text style={{marginLeft: 20, ...styles.title}}>Register Glucose Levels</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.card}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View style={styles.action}>             
                <TextInput style={styles.textInput} placeholder='Glucose Level mg/dL' keyboardType='decimal-pad' maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View style={styles.action}>
                <TextInput style={styles.textInput} placeholder='Carbohydrates' keyboardType='decimal-pad' maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
              <View style={styles.action}>
                {loading === true ? ( 
                 <TextInput style={styles.textInput} placeholder='Weight' keyboardType='decimal-pad' maxLength={6}/>
                 ) : 
                 <TextInput style={styles.textInput} placeholder='Weight' keyboardType='decimal-pad' onChangeText={(value) => setUser({...user, weight: value})} value={user.weight.toString()} maxLength={6}/>
                }
                <Text style={styles.infoText}> kg</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="heart-pulse" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Imc</Text>
                <Text style={styles.infoText}>{ImcCalculation(user.weight, user.height)} %</Text>
              </View>
            </View>  
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Date</Text>
                <Text style={styles.infoText}>{formatDate(Date.now(), 1)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>signOut()}>
                <LinearGradient 
                    colors={['#7f8b8f', '#748c94']}
                    style={styles.button}
              >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Register</Text>
                </LinearGradient>
            </TouchableOpacity>  
          </View>
        </View>
    </View>
    );
};

export default RegisterGlucoseLevels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#28b584'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  footer: {
      alignSelf: 'stretch',
      flex: 5,
      backgroundColor: '#fff',
      height: dms.height*0.5,
      borderTopRightRadius: dms.width*0.1,
      borderTopLeftRadius: dms.width*0.1
  },
  button: {
    marginTop: 10,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row'
  },
  card: {
    alignSelf: 'stretch',
    margin: 20,
    paddingHorizontal: 24,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 50,
    left: 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5
  },
  infoText: {
    fontSize: 20,
    marginLeft: 13,
  },
  infoSecondaryText: {
    fontSize: 16,
    color: '#b0b0b0',
    marginLeft: 16,
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
  },
  textInput: {
    paddingLeft: 10,
    color: '#000',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    width: '80%',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
});