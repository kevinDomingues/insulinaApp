import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput, Picker} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import ToastManager, { Toast } from 'toastify-react-native';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const RootStack = createStackNavigator();

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const ExerciseMainScreen = ({navigation}) => {
    const isFocused = useIsFocused();

    const [lastExercise, setLastExercise] = React.useState([]);
    const [exercises, setExercises] = React.useState([]);

    const userToken = useContext(TokenContext);

    const getLastExercise = async (token) => {
      try {  
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }   
        
        let response = await fetch(`${URL}/exercicio/getLatest`, requestOptions);
        
        let json = await response.json();
  
        setLastExercise(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getExercises = async (token) => {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }   

      try {      
        let response = await fetch(`${URL}/exercicio/getExercises`, requestOptions);
        
        let json = await response.json();
  
        setExercises(json);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getLastExercise(userToken);
      getExercises(userToken);
    }, [isFocused]);

    const ListItem = ({exercise}) => {
      return (
        <View style={{
          ...styles.Listcard,
          ...styles.shadow
        }}>
          <TouchableOpacity onPress={()=>{navigation.navigate('ExerciseEditScreen', {
                  exerciseID: exercise._id
                  })}}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Intensity</Text>
                <Text style={styles.ListinfoText}> {exercise.intensity} </Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Minutes</Text>
                <Text style={styles.ListinfoText}>{exercise.minutes} min</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Date</Text>
                <Text style={styles.ListinfoText}>{formatDate(exercise.dataHora, 1)}</Text>
              </View>
            </View>
          </TouchableOpacity>        
        </View>
      );
    };
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <LinearGradient colors={['#35cc98', '#27ab7d']} style={styles.header}>
          
        </LinearGradient>
        
        <View style={styles.footer}>
          <Text style={styles.title}>Exercises</Text>
          <TouchableOpacity style={{position: 'absolute', top: 5, right: 20}} onPress={() => navigation.navigate('ExerciseAddScreen') }>
            <MaterialCommunityIcons  name="plus" color="#ffffff" size={50}/>
          </TouchableOpacity>
          {exercises.length === 0 ? (
            <View style={{
              ...styles.card,
              ...styles.shadow,
              height: dms.height*0.5
            }}>
              <Text style={{...styles.infoText, color: "#05375a", fontSize: 35}}>No records found!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>You have no record in this section!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>Add some records</Text>
            </View>
          ) : (       
          <View style={{
              ...styles.card,
              ...styles.shadow
            }}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last exercise</Text>
            <View style={styles.item}>
              <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Intensity of Exercise</Text>
                <Text style={styles.infoText}>{lastExercise.intensity}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Minutes</Text>
                <Text style={styles.infoText}>{lastExercise.minutes} min</Text>
              </View>
            </View>
          </View>
          )}
          <SafeAreaView>
            <FlatList data={exercises}
              contentContainerStyle={{alignItems: 'center'}}
              style={{height: dms.height*0.49}}
              showsVerticalScrollIndicator={false}
              windowSize={1}
              numColumns={2}
              keyExtractor={item => item._id}
              renderItem={({item}) => <ListItem exercise={item} />} 
            />
          </SafeAreaView>
        </View>
      </View>
    );
};

const ExerciseAddScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    intensity: 'Weak',
    minutes: 15,
    date: new Date()
  });
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleIntensityChange = (val) => {
    setData({
      ...data,
      intensity: val
    })
  }

  const handleMinutesChange = (val) => {
    setData({
      ...data,
      minutes: val
    })
  }

  const register = async (token) => {
    try {
      const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
          },
          body: JSON.stringify({ intensity: data.intensity, minutes: data.minutes, dataHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/exercicio/registerExercise`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error adding exercise")
    } else{
      Toast.success("Registed with success!")

      setTimeout(() => {
        navigation.navigate('ExerciseMainScreen');
      }, 1600);
      
    
    }

    return json;
  } catch (error) {
    console.error(error);
  }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.date;
    setShow(Platform.OS === 'ios');
    setData({
      ...data,
      date: currentDate
    });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={alternativeStyles.container}>
      <ToastManager duration={1500}/>
      <StatusBar style={{backgroundColor: '#28b584'}}/>
      <View style={alternativeStyles.header}>
        <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <Text style={{marginLeft: 20, ...styles.title}} >Add Exercise</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
        <View style={styles.card}>    
          <View style={styles.item}>
            <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Intensity</Text>
              <Picker
                selectedValue={data.intensity}
                style={{ marginLeft: 10, height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => handleIntensityChange(itemValue)}
              >
                <Picker.Item label="Weak" value="Weak" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Intense" value="Intense" />
              </Picker>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Minutes</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleMinutesChange(value)} value={data.minutes.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View> 
          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Date</Text>
              <Text style={{...styles.infoText, color: '#05375a'}}>{formatDate(data.date, 1)}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={data.date}
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
              <TouchableOpacity style={{alignItems: 'center', marginLeft: 25}} onPress={showTimepicker}>
                <MaterialCommunityIcons name="table-clock" color="#05375a" size={30}/>
              </TouchableOpacity>    
            </View>
          </View>
          <TouchableOpacity style={{alignItems: 'center', marginTop: 30}} onPress={()=>register(userToken)}>
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

const ExerciseEditScreen = ({route, navigation}) => {

  const [data, setData] = React.useState({
    id: null,
    intensity: 'Loading',
    minutes: 15,
    date: new Date()
  });

  const { exerciseID } = route.params;

  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleIntensityChange = (val) => {
    setData({
      ...data,
      intensity: val
    })
  }

  const handleMinutesChange = (val) => {
    setData({
      ...data,
      minutes: val
    })
  }

  const update = async (token) => {
    try {
      const requestOptions = {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
          },
          body: JSON.stringify({ intensity: data.intensity, minutes: data.minutes, dataHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/exercicio/update/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error updating Exercise")
    } else{
      Toast.success("Updated with success!")

      setTimeout(() => {
        navigation.navigate('ExerciseMainScreen');
      }, 1600);
      
    
    }

    return json;
  } catch (error) {
    console.error(error);
  }
  }

  const del = async (token) => {
    try {
      const requestOptions = {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
          },
      }
  
    let response = await fetch(
      `${URL}/exercicio/delete/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error erasing Record")
    } else{
      Toast.success("Deleted with success!")

      setTimeout(() => {
        navigation.navigate('ExerciseMainScreen');
      }, 1600);
        
    }

    return json;
  } catch (error) {
    console.error(error);
  }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.date;
    setShow(Platform.OS === 'ios');
    setData({
      ...data,
      date: currentDate
    });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const getExercise = async (token, exerciseID) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }      
      
      let response = await fetch(`${URL}/exercicio/${exerciseID}`, requestOptions);
      
      let json = await response.json();

      setData({
        ...data,
        intensity: json.intensity,
        minutes: json.minutes,
        date: new Date(json.dataHora),
        id: exerciseID
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getExercise(userToken, exerciseID);
  }, []);

  return (
    <View style={alternativeStyles.container}>
      <ToastManager duration={1500}/>
      <StatusBar style={{backgroundColor: '#28b584'}}/>
      <View style={alternativeStyles.header}>
        <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <Text style={{marginLeft: 20, ...styles.title}} >Edit Exercise</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
        <View style={styles.card}>    
          <View style={styles.item}>
            <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Intensity</Text>
              <Picker
                selectedValue={data.intensity}
                style={{ marginLeft: 10, height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => handleIntensityChange(itemValue)}
              >
                <Picker.Item label="Weak" value="Weak" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Intense" value="Intense" />
              </Picker>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Minutes</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleMinutesChange(value)} value={data.minutes.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View> 
          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Date</Text>
              <Text style={{...styles.infoText, color: '#05375a'}}>{formatDate(data.date, 1)}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={data.date}
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
              <TouchableOpacity style={{alignItems: 'center', marginLeft: 25}} onPress={showTimepicker}>
                <MaterialCommunityIcons name="table-clock" color="#05375a" size={30}/>
              </TouchableOpacity>    
            </View>
          </View>
          <TouchableOpacity style={{alignItems: 'center', marginTop: 30}} onPress={()=>update(userToken)}>
              <LinearGradient 
                  colors={['#35cc98', '#27ab7d']}
                  style={styles.button}
            >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Save</Text>
              </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', marginTop: 10}} onPress={()=>del(userToken)}>
              <LinearGradient 
                  colors={['#ff513d', '#b34d42']}
                  style={styles.button}
            >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Delete</Text>
              </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
  </View>
  );
};

const ExerciseScreen = ({navigation}) => {
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <RootStack.Screen name="ExerciseMainScreen" component={ExerciseMainScreen}/>
      <RootStack.Screen name="ExerciseAddScreen" component={ExerciseAddScreen}/>
      <RootStack.Screen name="ExerciseEditScreen" component={ExerciseEditScreen}/>
    </RootStack.Navigator>
  )  
};

export default ExerciseScreen;

const alternativeStyles = StyleSheet.create({
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
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    justifyContent: 'center',
    backgroundColor: '#28b584',
    width: dms.width,
    height: dms.height*0.35,
    position: 'relative',
    zIndex: 1
  },
  footer: {
      alignSelf: 'stretch',
      zIndex: 2,
      marginTop: -180,
      flex: 1, 
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
  button: {
    marginTop: 10,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row'
  },
  Listcard: {
    alignSelf: 'stretch',
    margin: 10,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    width: 160
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
  ListinfoText: {
    fontSize: 12,
    marginLeft: 8,
  },
  ListinfoSecondaryText: {
    color: '#b0b0b0',
    fontSize: 14,
    marginLeft: 9,
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