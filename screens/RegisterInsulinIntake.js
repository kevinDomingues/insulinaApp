import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Picker} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const RegisterInsulinIntake = ({route, navigation}) => {

    const [data, setData] = React.useState({
        glucoseLevel: '',
        carbohydrates: '',
        doses: '',
        tipoInsulina: 1,
        date: new Date(),
        error: null
      });

    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);
  
    const { glucoseLevel, carbohydrates, doses } = route.params;

    const userToken = useContext(TokenContext);

    const dosesChanges = (val) => {
    setData({
        ...data,
        doses: val
    })
    }

    const glucoseChanges = (val) => {
    setData({
        ...data,
        glucoseLevel: val
    })
    }

    const carbohydratesChanges = (val) => {
    setData({
        ...data,
        carbohydrates: val
    })
    }

    const handleTipoInsulinaChange = (val) => {
      setData({
        ...data,
        tipoInsulina: val
      })
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

    const register = async (token) => {
      try {
        setData({
          ...data,
          error: null
        })
        const requestOptions = {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token': `${token}`
            },
            body: JSON.stringify({ qtGlicose: data.glucoseLevel, qtHidratos: data.carbohydrates, dataHora: data.date, qtInsulina: data.doses, tipoInsulina: data.tipoInsulina})
        }
    
      let response = await fetch(
        `${URL}/registoIns/new`, requestOptions
        );
      
      let json = await response.json();

      if(json.error){
        setData({
          ...data,
          error: json.error
        })
      } else{
        navigation.navigate('HomeMainScreen')
      }

      return json;
    } catch (error) {
      console.error(error);
    }
    }

    useEffect(() => {
        setData({
            ...data,
            glucoseLevel: glucoseLevel,
            carbohydrates: carbohydrates,
            doses: doses
        })
    }, []);
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <View style={styles.header}>
          <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
              <Text style={{marginLeft: 20, ...styles.title}}>Register Insulin Intake</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.card}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="beaker-alert" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Type</Text>
                <Picker
                  selectedValue={data.tipoInsulina}
                  style={{ marginLeft: 10, height: 50, width: 150}}
                  onValueChange={(itemValue, itemIndex) => handleTipoInsulinaChange(itemValue)}
                >
                  <Picker.Item label="Bazal" value="1" />
                  <Picker.Item label="Bolus" value="2" />
                  <Picker.Item label="Post" value="3" />
                </Picker>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="heart-flash" color="#05375a" size={30}/>
              <View style={styles.action}>
                <TextInput style={styles.textInput} placeholder='Insulin doses' keyboardType='decimal-pad' onChangeText={(value) => dosesChanges(value)} value={data.doses.toString()} maxLength={6}/>
                <Text style={styles.infoText}> doses</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
              <View style={styles.action}>             
                <TextInput style={styles.textInput} placeholder='Glucose Level mg/dL' keyboardType='decimal-pad' onChangeText={(value) => glucoseChanges(value)} value={data.glucoseLevel.toString()} maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View style={styles.action}>
                <TextInput style={styles.textInput} placeholder='Carbohydrates' keyboardType='decimal-pad' onChangeText={(value) => carbohydratesChanges(value)} value={data.carbohydrates.toString()} maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Date</Text>
                <Text style={styles.infoText}>{formatDate(data.date, 1)}</Text>
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
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => register(userToken)}>
                <LinearGradient 
                    colors={['#35cc98', '#27ab7d']}
                    style={styles.button}
              >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Register</Text>
                </LinearGradient>
            </TouchableOpacity>
            { data.error !== null ? 
            <Animatable.View animation="bounceIn" style={{alignItems: 'center'}}>
                <Text style={styles.errorMsg}>{data.error}</Text>
            </Animatable.View>
             : null
             }  
          </View>
        </View>
    </View>
    );
};

export default RegisterInsulinIntake;

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
  errorMsg: {
    color: '#FF0000',
    fontSize: 17,
},
});