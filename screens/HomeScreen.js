import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Picker, Modal} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import ToastManager, { Toast } from 'toastify-react-native';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from "react-native-chart-kit";

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const RootStack = createStackNavigator();
const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const HomeMainScreen = ({navigation}) => {
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [lastRecord, setLastRecord] = React.useState([]);
    const [records, setRecords] = React.useState({
        labels: [],
        info: [],
    });
    const [user, setUser] = React.useState();
    const [lastInsulina, setLastInsulina] = React.useState([]);

    const userToken = useContext(TokenContext);

    const getUserName = async (token) => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }      
        let response = await fetch(`${URL}/user/getName`, requestOptions);
        
        let json = await response.text();

        setUser(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getRecords = async (token) => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }      
        let response = await fetch(`${URL}/registo/getRecordsInversed`, requestOptions);
        
        let json = await response.json();
        let rec = ({
          labels: [],
          info: [],
        });

        json.forEach(element => {
          if(!rec.labels.includes(formatDate(element.dataHora, 2))){
            rec.labels.push(formatDate(element.dataHora, 2));
            rec.info.push(element.qtGlicose);
          }
        });

        setRecords(rec);
      } catch (error) {
        console.error(error);
      }
    };

    const getLastRecord = async (token) => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'x-access-token': `${token}`
         },
        }      
        let response = await fetch(`${URL}/registo/getLatest`, requestOptions);
        
        let json = await response.json();
  
        setLastRecord(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getLastInsRecord = async (token) => {
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
  
        setLastInsulina(json); 
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getUserName(userToken);
      getLastRecord(userToken);
      getLastInsRecord(userToken);
      getRecords(userToken);
    }, [isFocused]);
  
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
              <LineChart
                data={{
                  labels: records.labels,
                  datasets: [
                    {
                      data: records.info
                    }
                  ],
                  legend: ["Glucose Levels (mg/dL)"]
                }}
                width={dms.width}
                height={220}
                yAxisInterval={1} 
                chartConfig={{
                  backgroundColor: "#35cc98",
                  backgroundGradientFrom: "#35cc98",
                  backgroundGradientTo: "#27ab7d",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#27ab7d"
                  }
                }}
                bezier
                style={{
                  marginVertical: 0,
                  borderRadius: 16
                }}
              />
              <TouchableOpacity style={{marginBottom: 30, marginTop: 20}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              ><LinearGradient 
                  colors={['#35cc98', '#27ab7d']}
                  style={{...styles.button}}>
                  <Text style={{...styles.textStyle, color: '#fff'}}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
          {lastInsulina.empty ? (
            <View style={{
              ...styles.card,
              ...styles.shadow,
              height: dms.height*0.3
            }}>
              <Text style={{...styles.infoText, color: "#05375a", fontSize: 35}}>No records found!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>You have no insulin record!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>Add some records</Text>
            </View>
          ) : ( 
          <View>
          <Animatable.View animation="fadeInLeftBig" duraton="3000" style={{alignItems: 'flex-end', marginRight: 35, top: 15}}>      
            <TouchableOpacity onPress={() => navigation.navigate('ViewInsulinScreen')}>            
                  <Text style={{color: '#05375a', fontWeight: 'bold'}}>View All</Text>
            </TouchableOpacity>
          </Animatable.View> 
          <Animatable.View animation="fadeInLeftBig" duraton="3000" style={{
              ...styles.card,
              ...styles.shadow
            }}>
              <TouchableOpacity  onPress={() => navigation.navigate('ViewInsulinScreen')}>   
                <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last insulin intake</Text>
                <View style={styles.item}>
                  <MaterialCommunityIcons name="heart-flash" color="#05375a" size={30}/>
                  <View>
                    <Text style={styles.infoSecondaryText}>Doses administered</Text>
                    <Text style={styles.infoText}>{lastInsulina.qtInsulina} doses</Text>
                  </View>
                </View>
                <View style={styles.item}>
                  <MaterialCommunityIcons name="beaker-alert" color="#05375a" size={30}/>
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
              </TouchableOpacity>
            </Animatable.View>
            </View>
          )}
          {lastRecord.empty ? (
            <View style={{
              ...styles.card,
              ...styles.shadow,
              height: dms.height*0.3
            }}>
              <Text style={{...styles.infoText, color: "#05375a", fontSize: 35}}>No records found!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>You have no glucose record!</Text>
              <Text style={{...styles.infoText, color: "#05375a", marginTop: 20}}>Add some records</Text>
            </View>
          ) : (
          <View>
          <Animatable.View animation="fadeInRightBig" duraton="3000" style={{alignItems: 'flex-end', marginRight: 35, top: 15}}>      
            <TouchableOpacity onPress={() => navigation.navigate('ViewGlucoseScreen')}>            
                  <Text style={{color: '#05375a', fontWeight: 'bold'}}>View All</Text>
            </TouchableOpacity>
          </Animatable.View> 
          <Animatable.View animation="fadeInRightBig" duraton="3000" style={{
            ...styles.card,
            ...styles.shadow
          }}>
            <TouchableOpacity onPress={() => navigation.navigate('ViewGlucoseScreen')}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last glucose record</Text>
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
            </TouchableOpacity>
                        
          </Animatable.View>
          <Animatable.View animation="fadeInRightBig" duraton="3000" style={{
            ...styles.card,
            ...styles.shadow
          }}>
            <TouchableOpacity style={{...styles.button, width: '100%'}} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>View Graphic</Text>
            </TouchableOpacity>
                        
          </Animatable.View>
          </View>
          )}
          <View style={{height: 200}}></View>
        </ScrollView>
      </View>
    );
};

const ViewInsulinScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const [lastRecord, setLastRecord] = React.useState([]);
  const [records, setRecords] = React.useState([]);

  const userToken = useContext(TokenContext);

  const getLastRecord = async (token) => {
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

      setLastRecord(json);
    } catch (error) {
      console.error(error);
    }
  };

  const getRecords = async (token) => {
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
     },
    }   

    try {      
      let response = await fetch(`${URL}/registoIns/getRecords`, requestOptions);
      
      let json = await response.json();

      setRecords(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLastRecord(userToken);
    getRecords(userToken);
  }, [isFocused]);

  const ListItem = ({record}) => {
    return (
      <View style={{
        ...styles.Listcard,
        ...styles.shadow
      }}>
        <TouchableOpacity onPress={()=>{navigation.navigate('InsulinEditScreen', {
                recordID: record._id
                })}}>
          <View style={styles.item}>
            <MaterialCommunityIcons name="heart-flash" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Doses</Text>
              <Text style={styles.ListinfoText}> {record.qtInsulina} </Text>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="beaker-alert" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Type</Text>
              <Text style={styles.ListinfoText}>{record.tipoInsulina === 1 ? 'Bazal' : 'Bolus'}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Glucose Level</Text>
              <Text style={styles.ListinfoText}>{record.qtGlicose} mg/dL</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Carbohydrates</Text>
              <Text style={styles.ListinfoText}>{record.qtHidratos}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Date</Text>
              <Text style={styles.ListinfoText}>{formatDate(record.dataHora, 1)}</Text>
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
        <Text style={styles.title}>Insulin Records</Text>    
        <View style={{
            ...styles.card,
            ...styles.shadow
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last Record</Text>
          <View style={styles.item}>
            <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Doses administered</Text>
              <Text style={styles.infoText}>{lastRecord.qtInsulina} doses</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="beaker-alert" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Type</Text>
              <Text style={styles.infoText}>{lastRecord.tipoInsulina == 1 ? 'Bazal' : 'Bolus'} </Text>
            </View>
          </View>
        </View>
        
        <SafeAreaView>
          <FlatList data={records}
            contentContainerStyle={{alignItems: 'center'}}
            style={{height: dms.height*0.49}}
            showsVerticalScrollIndicator={false}
            windowSize={1}
            numColumns={2}
            keyExtractor={item => item._id}
            renderItem={({item}) => <ListItem record={item} />} 
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

const ViewGlucoseScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const [lastRecord, setLastRecord] = React.useState([]);
  const [records, setRecords] = React.useState([]);

  const userToken = useContext(TokenContext);

  const getLastRecord = async (token) => {
    try {  
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }   
      
      let response = await fetch(`${URL}/registo/getLatest`, requestOptions);
      
      let json = await response.json();

      setLastRecord(json);
    } catch (error) {
      console.error(error);
    }
  };

  const getRecords = async (token) => {
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
     },
    }   

    try {      
      let response = await fetch(`${URL}/registo/getRecords`, requestOptions);
      
      let json = await response.json();

      setRecords(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLastRecord(userToken);
    getRecords(userToken);
  }, [isFocused]);

  const ListItem = ({record}) => {
    return (
      <View style={{
        ...styles.Listcard,
        ...styles.shadow
      }}>
        <TouchableOpacity onPress={()=>{navigation.navigate('GlucoseEditScreen', {
                recordID: record._id
                })}}>
          <View style={styles.item}>
            <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Glucose Level</Text>
              <Text style={styles.ListinfoText}>{record.qtGlicose} mg/dL</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Carbohydrates</Text>
              <Text style={styles.ListinfoText}>{record.qtHidratos}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Weight</Text>
              <Text style={styles.ListinfoText}>{record.peso} kg</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="heart-pulse" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>IMC</Text>
              <Text style={styles.ListinfoText}>{record.imc} %</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Date</Text>
              <Text style={styles.ListinfoText}>{formatDate(record.dataHora, 1)}</Text>
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
        <Text style={styles.title}>Glucose Records</Text>    
        <View style={{
            ...styles.card,
            ...styles.shadow
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last Record</Text>
          <View style={styles.item}>
            <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Glucose Level</Text>
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
        </View>
        
        <SafeAreaView>
          <FlatList data={records}
            contentContainerStyle={{alignItems: 'center'}}
            style={{height: dms.height*0.49}}
            showsVerticalScrollIndicator={false}
            windowSize={1}
            numColumns={2}
            keyExtractor={item => item._id}
            renderItem={({item}) => <ListItem record={item} />} 
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

const InsulinEditScreen = ({route, navigation}) => {

  const [data, setData] = React.useState({
    id: null,
    qtGlicose: 0,
    qtHidratos: 0,
    qtInsulina: 0,
    tipoInsulina: 1,
    date: new Date()
  });

  const { recordID } = route.params;

  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleQtGlicoseChange = (val) => {
    setData({
      ...data,
      qtGlicose: val
    })
  }

  const handleQtHidratosChange = (val) => {
    setData({
      ...data,
      qtHidratos: val
    })
  }

  const handleQtInsulinaChange = (val) => {
    setData({
      ...data,
      qtInsulina: val
    })
  }

  const handleTipoInsulinaChange = (val) => {
    setData({
      ...data,
      tipoInsulina: val
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
          body: JSON.stringify({ qtGlicose: data.qtGlicose, qtHidratos: data.qtHidratos, qtInsulina: data.qtInsulina, tipoInsulina: data.tipoInsulina,  dateHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/registoIns/update/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error updating Record")
    } else{
      Toast.success("Updated with success!")

      setTimeout(() => {
        navigation.navigate('ViewInsulinScreen');
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
      `${URL}/registoIns/delete/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error erasing Record")
    } else{
      Toast.success("Deleted with success!")

      setTimeout(() => {
        navigation.navigate('ViewInsulinScreen');
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

  const getRecord = async (token, recordID) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }      
      
      let response = await fetch(`${URL}/registoIns/${recordID}`, requestOptions);
      
      let json = await response.json();

      setData({
        ...data,
        qtGlicose: json.qtGlicose,
        qtHidratos: json.qtHidratos,
        qtInsulina: json.qtInsulina,
        tipoInsulina: json.tipoInsulina,
        date: new Date(json.dataHora),
        id: recordID
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecord(userToken, recordID);
  }, []);

  return (
    <View style={alternativeStyles.container}>
      <ToastManager duration={1500}/>
      <StatusBar style={{backgroundColor: '#28b584'}}/>
      <View style={alternativeStyles.header}>
        <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <Text style={{marginLeft: 20, ...styles.title}} >Edit Insulin Record</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
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
            <View>
              <Text style={styles.infoSecondaryText}>Doses</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleQtInsulinaChange(value)} value={data.qtInsulina.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Glucose Levels (mg/dL)</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleQtGlicoseChange(value)} value={data.qtGlicose.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Carbohydrates</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleQtHidratosChange(value)} value={data.qtHidratos.toString()} keyboardType='decimal-pad' maxLength={10}/>
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
          <TouchableOpacity style={{alignItems: 'center', marginTop: 10}} onPress={()=>update(userToken)}>
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

const GlucoseEditScreen = ({route, navigation}) => {

  const [data, setData] = React.useState({
    id: null,
    qtGlicose: 0,
    qtHidratos: 0,
    peso: 0,
    date: new Date()
  });

  const { recordID } = route.params;

  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleQtGlicoseChange = (val) => {
    setData({
      ...data,
      qtGlicose: val
    })
  }

  const handleQtHidratosChange = (val) => {
    setData({
      ...data,
      qtHidratos: val
    })
  }

  const handlePesoChange = (val) => {
    setData({
      ...data,
      peso: val
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
          body: JSON.stringify({ qtGlicose: data.qtGlicose, qtHidratos: data.qtHidratos, peso: data.peso, dateHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/registo/update/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error updating Record")
    } else{
      Toast.success("Updated with success!")

      setTimeout(() => {
        navigation.navigate('ViewGlucoseScreen');
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
      `${URL}/registo/delete/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error erasing Record")
    } else{
      Toast.success("Deleted with success!")

      setTimeout(() => {
        navigation.navigate('ViewGlucoseScreen');
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

  const getRecord = async (token, recordID) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }      
      
      let response = await fetch(`${URL}/registo/${recordID}`, requestOptions);
      
      let json = await response.json();

      setData({
        ...data,
        qtGlicose: json.qtGlicose,
        qtHidratos: json.qtHidratos,
        peso: json.peso,
        date: new Date(json.dataHora),
        id: recordID
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecord(userToken, recordID);
  }, []);

  return (
    <View style={alternativeStyles.container}>
      <ToastManager duration={1500}/>
      <StatusBar style={{backgroundColor: '#28b584'}}/>
      <View style={alternativeStyles.header}>
        <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <Text style={{marginLeft: 20, ...styles.title}} >Edit Glucose Record</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
        <View style={styles.card}>    
          <View style={styles.item}>
          <MaterialCommunityIcons name="water-percent" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Glucose Levels (mg/dL)</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleQtGlicoseChange(value)} value={data.qtGlicose.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Carbohydrates</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handleQtHidratosChange(value)} value={data.qtHidratos.toString()} keyboardType='decimal-pad' maxLength={10}/>
            </View>
          </View>
          <View style={styles.item}>
          <MaterialCommunityIcons name="weight" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Weight (kg)</Text>
              <TextInput style={styles.infoText} onChangeText={(value) => handlePesoChange(value)} value={data.peso.toString()} keyboardType='decimal-pad' maxLength={10}/>
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
          <TouchableOpacity style={{alignItems: 'center', marginTop: 10}} onPress={()=>update(userToken)}>
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

const HomeScreen = ({navigation}) => {
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <RootStack.Screen name="HomeMainScreen" component={HomeMainScreen}/>
      <RootStack.Screen name="ViewInsulinScreen" component={ViewInsulinScreen}/>
       <RootStack.Screen name="ViewGlucoseScreen" component={ViewGlucoseScreen}/>
       <RootStack.Screen name="InsulinEditScreen" component={InsulinEditScreen}/>
       <RootStack.Screen name="GlucoseEditScreen" component={GlucoseEditScreen}/>
    </RootStack.Navigator>
  )  
};

export default HomeScreen;

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
      marginTop: -280
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
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 30,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
});