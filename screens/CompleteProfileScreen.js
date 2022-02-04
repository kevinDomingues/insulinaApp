import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ToastManager, { Toast } from 'toastify-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const CompleteProfileScreen = ({route, navigation}) => {

    const { signIn } = React.useContext(AuthContext);

    const [user, setUser] = React.useState({
      name: 'Your name',
      username: '',
      email: '',
      password: '',
      contact: '',
      minGlicose: '',
      maxGlicose: '',
      height: '',
      weight: '',
      birthdayDate: new Date(),
    });
  
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);
  
    const { email, password } = route.params;
  
    const handleNameChange = (val) => {
      setUser({
        ...user,
        name: val
      })
    }
  
    const handleUsernameChange = (val) => {
      setUser({
        ...user,
        username: val
      })
    }
    
    const handleContactChange = (val) => {
      setUser({
        ...user,
        contact: val
      })
    }
  
    const handleHeightChange = (val) => {
      setUser({
        ...user,
        height: val
      })
    }
  
    const handleWeightChange = (val) => {
      setUser({
        ...user,
        weight: val
      })
    }
  
    const handleMinGlucoseChange = (val) => {
      setUser({
        ...user,
        minGlicose: val
      })
    }
  
    const handleMaxGlucoseChange = (val) => {
      setUser({
        ...user,
        maxGlicose: val
      })
    }
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || user.birthdayDate;
      setShow(Platform.OS === 'ios');
      setUser({
        ...user,
        birthdayDate: currentDate
      });
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };

    const getLoginResponse = async (userEmail, password) => {
      try {
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userEmail, password: password })
          }
      
        let response = await fetch(
          `${URL}/user/login`, requestOptions
          );
        
        let json = await response.json();
  
        return json;
      } catch (error) {
        console.error(error);
      }
    };
  
    const register = async () => {
      try {
        const requestOptions = {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: user.name, username: user.username, password: user.password, email: user.email, minGlicose: user.minGlicose, maxGlicose: user.maxGlicose, height: user.height, weight: user.weight, contact: user.contact, birthdayDate: user.birthdayDate})
        }
    
      let response = await fetch(
        `${URL}/user/signUp`, requestOptions
        );
      
      let json = await response.json();
  
      if(json.error){
        Toast.error("Error creating user")
      } else{
        Toast.success("Account created with success!")
  
          let token = await getLoginResponse(user.email, user.password);
          if(token.token){
            setTimeout(() => {
              signIn(token.token, user.email);
            }, 1600);
          }   
      }
  
      return json;
    } catch (error) {
      console.error(error);
    }
    }
  
    useEffect(() => {
      setUser({
        ...user,
        email: email,
        password: password
      })
    }, []);
  
    return (
      <View style={styles.container}>
        <ToastManager duration={1500}/>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <View style={styles.header}>
          <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
              <View style={styles.profilePic}>
                <FontAwesome name="user-o" color="#05375a" size={60}/>
              </View>
              <TextInput style={{marginLeft: 20, ...styles.title}} onChangeText={(value) => handleNameChange(value)} value={user.name} maxLength={100}/>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.card}>    
            <View style={styles.item}>
              <MaterialCommunityIcons name="email" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Username</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleUsernameChange(value)} value={user.username} maxLength={100}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="phone" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Contact</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleContactChange(value)} value={user.contact.toString()} keyboardType='decimal-pad' maxLength={10}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="human-male-height" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Height (m)</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleHeightChange(value)} value={user.height.toString()} keyboardType='decimal-pad' maxLength={5}/>
              </View>
            </View> 
            <View style={styles.item}>
              <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Weight (kg)</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleWeightChange(value)} value={user.weight.toString()} keyboardType='decimal-pad' maxLength={5}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Min Glucose level (mg/dL)</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleMinGlucoseChange(value)} value={user.minGlicose.toString()} keyboardType='decimal-pad' maxLength={6}/>
              </View>
            </View>  
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Max Glucose level (mg/dL)</Text>
                <TextInput style={styles.infoText} onChangeText={(value) => handleMaxGlucoseChange(value)} value={user.maxGlicose.toString()} keyboardType='decimal-pad' maxLength={6}/>
              </View>
            </View>   
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Birthday Date</Text>
                <Text style={styles.infoText}>{formatDate(user.birthdayDate, 2)}</Text>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={user.birthdayDate}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
                </View>
                <View style={{flexDirection: 'row', marginLeft:10}}>
                  <TouchableOpacity style={{alignItems: 'center', marginLeft: 25}} onPress={showDatepicker}>
                    <MaterialCommunityIcons name="calendar-search" color="#05375a" size={30}/>
                  </TouchableOpacity>  
                </View>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>register()}>
                <LinearGradient 
                    colors={['#35cc98', '#27ab7d']}
                    style={styles.button}
              >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Create</Text>
                </LinearGradient>
            </TouchableOpacity>  
          </View>
        </View>
    </View>
    );
  };

export default CompleteProfileScreen;

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
      flex: 6,
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