import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import ToastManager, { Toast } from 'toastify-react-native';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext } from '../components/context';
import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const RootStack = createStackNavigator();

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const ProfileMainScreen = ({navigation}) => {
    const isFocused = useIsFocused();

    const [user, setUser] = React.useState([]);

    const userToken = useContext(TokenContext);

    const { signOut } = React.useContext(AuthContext);

    const getUser = async (token) => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }      
        
        let response = await fetch(`${URL}/user/me`, requestOptions);
        
        let json = await response.json();
  
        setUser(json);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getUser(userToken);
    }, [isFocused]);
  
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
            <TouchableOpacity style={{position: 'absolute',alignItems: 'flex-end', right: 5, top: 5}} onPress={() => navigation.navigate('ProfileEditScreen')}>            
              <MaterialCommunityIcons name="lead-pencil" color="#05375a" size={25}/>
            </TouchableOpacity>
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

// onChangeText={(value) => glucoseChanges(value)} 

const ProfileEditScreen = ({navigation}) => {

  const [user, setUser] = React.useState({
    name: '',
    email: '',
    contact: 0,
    minGlicose: 0,
    maxGlicose: 0,
    height: 0,
    weight: 0,
    birthdayDate: new Date(),
  });

  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const getUser = async (token) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }      

      let response = await fetch(`${URL}/user/me`, requestOptions);
      
      let json = await response.json();

      setUser({name: json.name, email: json.email, contact: json.contact, minGlicose: json.minGlicose, maxGlicose: json.maxGlicose, height: json.height, weight: json.weight, birthdayDate: new Date(json.birthdayDate)});
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = (val) => {
    setUser({
      ...user,
      name: val
    })
  }

  const handleEmailChange = (val) => {
    setUser({
      ...user,
      email: val
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

  const update = async (token) => {
    try {
      const requestOptions = {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
          },
          body: JSON.stringify({ name: user.name, email: user.email, minGlicose: user.minGlicose, maxGlicose: user.maxGlicose, height: user.height, weight: user.weight, contact: user.contact, birthdayDate: user.birthdayDate})
      }
  
    let response = await fetch(
      `${URL}/user/update`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error updating user")
    } else{
      Toast.success("Updated with success!")

      setTimeout(() => {
        navigation.navigate('ProfileMainScreen');
      }, 1600);
      
    
    }

    return json;
  } catch (error) {
    console.error(error);
  }
  }

  useEffect(() => {
    getUser(userToken);
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
              <Text style={styles.infoSecondaryText}>Email</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleEmailChange(value)} value={user.email} maxLength={100}/>
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
          <TouchableOpacity style={{alignItems: 'center'}} onPress={()=>update(userToken)}>
              <LinearGradient 
                  colors={['#35cc98', '#27ab7d']}
                  style={styles.button}
            >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Save</Text>
              </LinearGradient>
          </TouchableOpacity>  
        </View>
      </View>
  </View>
  );
};

const ProfileScreen = ({navigation}) => {
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <RootStack.Screen name="ProfileMainScreen" component={ProfileMainScreen}/>
      <RootStack.Screen name="ProfileEditScreen" component={ProfileEditScreen}/>
    </RootStack.Navigator>
  )  
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