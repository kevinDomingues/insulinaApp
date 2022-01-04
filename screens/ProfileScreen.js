import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../components/context';
import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const ProfileScreen = ({navigation}) => {

    const [user, setUser] = React.useState([]);

    const userToken = useContext(TokenContext);

    const { signOut } = React.useContext(AuthContext);

    const getUser = async (id) => {
      try {      
        let response = await fetch(`${URL}/user/${id}`);
        
        let json = await response.json();
  
        setUser(json);
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
              <View style={styles.profilePic}>
                <FontAwesome name="user-o" color="#05375a" size={60}/>
              </View>
              <Text style={{marginLeft: 20, ...styles.title}}>{user.name}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.card}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="email" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Email</Text>
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="phone" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Contacto</Text>
                <Text style={styles.infoText}>{user.contact}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="human-male-height" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Height</Text>
                <Text style={styles.infoText}>{user.height} m</Text>
              </View>
            </View> 
            <View style={styles.item}>
              <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Weight</Text>
                <Text style={styles.infoText}>{user.weight} kg</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Min Glucose level</Text>
                <Text style={styles.infoText}>{user.minGlicose} mg/dL</Text>
              </View>
            </View>  
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Max Glucose level</Text>
                <Text style={styles.infoText}>{user.maxGlicose} mg/dL</Text>
              </View>
            </View>   
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Birthday Date</Text>
                <Text style={styles.infoText}>{formatDate(user.birthdayDate, 2)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>signOut()}>
                <LinearGradient 
                    colors={['#7f8b8f', '#748c94']}
                    style={styles.button}
              >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Logout</Text>
                </LinearGradient>
            </TouchableOpacity>  
          </View>
        </View>
    </View>
    );
};

export default ProfileScreen;

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
    fontSize: 25,
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