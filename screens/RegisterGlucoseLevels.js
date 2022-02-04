import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';
import { ImcCalculation, getInsulinToTake } from '../components/Calculations';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const RegisterGlucoseLevels = ({route, navigation}) => {

  const { glucoseLevel, tipoRegisto } = route.params;

    const [modalVisible, setModalVisible] = React.useState(false);
    const [secondModalVisible, setsecondModalVisible] = React.useState(false);
    const [data, setData] = React.useState({
      glucoseLevel: 0,
      carbohydrates: 0,
      weight: '',
      height: '',
      minGlucose: '',
      maxGlucose: '',
      imc: '',
      tipoRegisto: 1,
      date: new Date(),
      error: null
    });
    const [calc, setCalc] = React.useState({
      message: '',
      doses: null
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
  
        setData({
          ...data,
          weight: json.weight,
          height: json.height,
          minGlucose: json.minGlicose,
          maxGlucose: json.maxGlicose,
          imc: ImcCalculation(json.weight, json.height)
        });
      } catch (error) {
        console.error(error);
      }
    };

    const weightChanges = (val) => {
      setData({
        ...data,
        weight: val,
        imc: ImcCalculation(val, data.height)
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

    const prepareCalculations = async (token) =>  {
      try {  
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }   

        let response = await fetch(`${URL}/registoIns/getLatest`, requestOptions);
        
        let json = await response.json();
  
        let lastRecordDate = json.dataHora;
        let lastInsulinIntake = json.qtInsulina;
        
        let calculation = getInsulinToTake(data.minGlucose, data.maxGlucose, data.carbohydrates, data.glucoseLevel, data.weight, lastRecordDate, lastInsulinIntake);

        setCalc({
          ...calc,
          message: calculation.message,
          doses: calculation.doses
        });
        if(data.carbohydrates!='' && data.glucoseLevel!=''){
          setsecondModalVisible(true);
        } else {
          setData({
            ...data,
            error: "You have empty inputs!"
          })
        }
      } catch (error) {
        console.error(error);
      }
    }

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
            body: JSON.stringify({ qtGlicose: data.glucoseLevel, qtHidratos: data.carbohydrates, dataHora: data.date, tipoRegisto: data.tipoRegisto, peso: data.weight, imc: data.imc})
        }
    
      let response = await fetch(
        `${URL}/registo/new`, requestOptions
        );
      
      let json = await response.json();

      if(json.error){
        setData({
          ...data,
          error: json.error
        })
      } else{
        if(calc.doses>0){
          navigation.navigate('RegisterInsulinIntake', {
            glucoseLevel: data.glucoseLevel,
            carbohydrates: data.carbohydrates,
            doses: calc.doses
            })
        } else{
          navigation.navigate('HomeMainScreen');
        } 
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
        tipoRegisto: tipoRegisto
      });
      getUser(userToken);
    }, []);
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{...styles.centeredView, ...styles.shadow}}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Do you wish to calculate the required insulin doses?</Text>
              <TouchableOpacity
                style={{...styles.button, ...styles.buttonClose, width: 100}}
                onPress={() => {
                  prepareCalculations(userToken);
                  setModalVisible(!modalVisible);
                }}
              ><LinearGradient 
                  colors={['#35cc98', '#27ab7d']}
                  style={styles.buttonGradient}>
                  <Text style={{...styles.textStyle, color: '#fff'}}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.button, ...styles.buttonClose, width: 100}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  register(userToken);
                }}
              ><LinearGradient 
                  colors={['#cf0000', '#b00000']}
                  style={styles.buttonGradient}>
                  <Text style={{...styles.textStyle, color: '#fff'}}>No</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={secondModalVisible}
          onRequestClose={() => {
            setsecondModalVisible(!secondModalVisible);
          }}
        >
          <View style={{...styles.centeredView, ...styles.shadow}}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{calc.message}</Text>
              <TouchableOpacity
                style={{...styles.button, ...styles.buttonClose, width: 100}}
                onPress={() => {
                  setsecondModalVisible(!secondModalVisible);
                  register(userToken);
                }}
              ><LinearGradient 
                  colors={['#35cc98', '#27ab7d']}
                  style={styles.buttonGradient}>
                  <Text style={{...styles.textStyle, color: '#fff'}}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.button, ...styles.buttonClose, width: 100}}
                onPress={() => {
                  setsecondModalVisible(!secondModalVisible);
                }}
              ><LinearGradient 
                  colors={['#cf0000', '#b00000']}
                  style={styles.buttonGradient}>
                  <Text style={{...styles.textStyle, color: '#fff'}}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
                <TextInput style={styles.textInput} placeholder='Glucose Level mg/dL' keyboardType='decimal-pad' onChangeText={(value) => glucoseChanges(value)} maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View style={styles.action}>
                <TextInput style={styles.textInput} placeholder='Carbohydrates' keyboardType='decimal-pad' onChangeText={(value) => carbohydratesChanges(value)} maxLength={6}/>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
              <View style={styles.action}>
                <TextInput style={styles.textInput} placeholder='Weight' keyboardType='decimal-pad' onChangeText={(value) => weightChanges(value)} value={data.weight.toString()} maxLength={6}/>
                <Text style={styles.infoText}> kg</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="heart-pulse" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Imc</Text>
                <Text style={styles.infoText}>{data.imc} %</Text>
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
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setModalVisible(true)}>
                <LinearGradient 
                    colors={['#35cc98', '#27ab7d']}
                    style={styles.button}
              >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Register</Text>
                </LinearGradient>
            </TouchableOpacity>  
          </View>
          { data.error !== null ? 
            <Animatable.View animation="bounceIn" style={{alignItems: 'center'}}>
                <Text style={styles.errorMsg}>{data.error}</Text>
            </Animatable.View>
             : null
             }
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
  buttonGradient: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 17,
},
});