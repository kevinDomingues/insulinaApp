import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';
import { ImcCalculation, getInsulinToTake } from '../components/Calculations';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const RegisterGlucoseLevels = ({navigation}) => {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [secondModalVisible, setsecondModalVisible] = React.useState(false);
    const [data, setData] = React.useState({
      glucoseLevel: '',
      carbohydrates: '',
      weight: '',
      height: '',
      minGlucose: '',
      maxGlucose: '',
      imc: '',
      error: null
    });
    const [calc, setCalc] = React.useState({
      message: '',
      doses: null
    });

    const userToken = useContext(TokenContext);

    const getUser = async (id) => {
      try {      
        let response = await fetch(`${URL}/user/${id}`);
        
        let json = await response.json();
  
        setData({
          ...data,
          weight: json.weight,
          height: json.height,
          minGlucose: json.minGlicose,
          maxGlucose: json.maxGlicose
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

    const prepareCalculations = async (id) =>  {
      try {  
        let response = await fetch(`${URL}/registoIns/getLatest/${id}`);
        
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

    const register = async (id) => {
      try {
        setData({
          ...data,
          error: null
        })
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUser: id, qtGlicose: data.glucoseLevel, qtHidratos: data.carbohydrates, dataHora: new Date(), tipoRegisto: 1, peso: data.weight, imc: data.imc})
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
        navigation.navigate('RegisterInsulinIntake', {
          glucoseLevel: data.glucoseLevel,
          carbohydrates: data.carbohydrates,
          doses: calc.doses
          })
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
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  prepareCalculations(userToken);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
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
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!secondModalVisible);
                  register(userToken);
                }}
              >
                <Text style={styles.textStyle}>Continue</Text>
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
                <Text style={styles.infoText}>{formatDate(Date.now(), 1)}</Text>
              </View>
            </View>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setModalVisible(true)}>
                <LinearGradient 
                    colors={['#7f8b8f', '#748c94']}
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