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
import { getHC } from '../components/Calculations';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';

const RootStack = createStackNavigator();

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const FoodMainScreen = ({navigation}) => {
    const isFocused = useIsFocused();

    const [lastFood, setLastFood] = React.useState([]);
    const [foods, setFoods] = React.useState([]);
    const [user, setUser] = React.useState({
      weight: 0,
      height: 0,
      qtHidratos: 0,
      qtHidratosAvailable: 0
    });

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
  
        setUser({
          ...user,
          weight: json.weight,
          height: json.height
        });
        calcs(json.weight); 
      } catch (error) {
        console.error(error);
      }
    };

    const getFoods = async (token) => {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }   

      try {      
        let response = await fetch(`${URL}/food/getFoodRecords`, requestOptions);
        
        let json = await response.json();
  
        setFoods(json);
      } catch (error) {
        console.error(error);
      }
    };

    const calcs = async (weight) => {
      let calc = getHC(foods, weight);
      setUser({
        qtHidratosAvailable: calc.availableCarbs,
        qtHidratos: calc.totalCarbs
      })
    }

    useEffect(() => {
      getFoods(userToken);
      getUser(userToken);
    }, [isFocused]);

    const ListItem = ({food}) => {
      return (
        <View style={{
          ...styles.Listcard,
          ...styles.shadow
        }}>
          <TouchableOpacity onPress={()=>{navigation.navigate('FoodEditScreen', {
                  foodID: food._id
                  })}}>
            <View style={styles.item}>
              <MaterialCommunityIcons name="card-text" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Description</Text>
                <Text style={styles.ListinfoText}>{food.desc}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Carbohydrates</Text>
                <Text style={styles.ListinfoText}>{food.qtHidratos} g</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
              <View>
                <Text style={styles.ListinfoSecondaryText}>Date</Text>
                <Text style={styles.ListinfoText}>{formatDate(food.dataHora, 1)}</Text>
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
          <Text style={styles.title}>Food</Text>
          <TouchableOpacity style={{position: 'absolute', top: 5, right: 20}} onPress={() => navigation.navigate('FoodAddScreen') }>
            <MaterialCommunityIcons  name="plus" color="#ffffff" size={50}/>
          </TouchableOpacity>
          {foods.length === 0 ? (
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
            <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last 12h</Text>
            <View style={styles.item}>
              <MaterialCommunityIcons name="food" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>You consumed</Text>
                <Text style={styles.infoText}>{user.qtHidratos} g</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>You can consume</Text>
                <Text style={styles.infoText}>{user.qtHidratosAvailable} g</Text>
              </View>
            </View>
          </View>
          ) }
          <SafeAreaView>
            <FlatList data={foods}
              contentContainerStyle={{alignItems: 'center'}}
              style={{height: dms.height*0.49}}
              showsVerticalScrollIndicator={false}
              windowSize={1}
              numColumns={2}
              keyExtractor={item => item._id}
              renderItem={({item}) => <ListItem food={item} />} 
            />
          </SafeAreaView>
          
        </View>
      </View>
    );
};

const FoodAddScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    desc: 'Meal',
    qtHidratos: 20,
    date: new Date()
  });
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleDescChange = (val) => {
    setData({
      ...data,
      desc: val
    })
  }

  const handleQtHidratosChange = (val) => {
    setData({
      ...data,
      qtHidratos: val
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
          body: JSON.stringify({ desc: data.desc, qtHidratos: data.qtHidratos, dataHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/food/registerFood`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error adding record")
    } else{
      Toast.success("Registed with success!")

      setTimeout(() => {
        navigation.navigate('FoodMainScreen');
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
            <Text style={{marginLeft: 20, ...styles.title}} >Add Food</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
        <View style={styles.card}>    
          <View style={styles.item}>
            <MaterialCommunityIcons name="card-text" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Description</Text>
              <Picker
                selectedValue={data.desc}
                style={{ marginLeft: 10, height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => handleDescChange(itemValue)}
              >
                <Picker.Item label="Black beans" value="Black beans" />
                <Picker.Item label="Boiled potato" value="Boiled potato" />
                <Picker.Item label="Bread" value="Bread" />
                <Picker.Item label="Corn flakes" value="Corn flakes" />
                <Picker.Item label="Flour" value="Flour" />
                <Picker.Item label="Rice" value="Rice" />
                <Picker.Item label="Wholemeal Toast" value="Wholemeal toast" />
              </Picker>
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

const FoodEditScreen = ({route, navigation}) => {

  const [data, setData] = React.useState({
    id: null,
    desc: 'Meal',
    qtHidratos: 20,
    date: new Date()
  });

  const { foodID } = route.params;

  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const userToken = useContext(TokenContext);

  const handleDescChange = (val) => {
    setData({
      ...data,
      desc: val
    })
  }

  const handleQtHidratosChange = (val) => {
    setData({
      ...data,
      qtHidratos: val
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
          body: JSON.stringify({ qtHidratos: data.qtHidratos, desc: data.desc, dataHora: data.date})
      }
  
    let response = await fetch(
      `${URL}/food/update/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error updating Record")
    } else{
      Toast.success("Updated with success!")

      setTimeout(() => {
        navigation.navigate('FoodMainScreen');
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
      `${URL}/food/delete/${data.id}`, requestOptions
      );
    
    let json = await response.json();

    if(json.error){
      Toast.error("Error erasing Record")
    } else{
      Toast.success("Deleted with success!")

      setTimeout(() => {
        navigation.navigate('FoodMainScreen');
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

  const getFood = async (token, foodID) => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': `${token}`
       },
      }      
      
      let response = await fetch(`${URL}/food/${foodID}`, requestOptions);
      
      let json = await response.json();

      setData({
        ...data,
        desc: json.desc,
        qtHidratos: json.qtHidratos,
        date: new Date(json.dataHora),
        id: foodID
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFood(userToken, foodID);
  }, []);

  return (
    <View style={alternativeStyles.container}>
      <ToastManager duration={1500}/>
      <StatusBar style={{backgroundColor: '#28b584'}}/>
      <View style={alternativeStyles.header}>
        <View style={{width: dms.width, flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <Text style={{marginLeft: 20, ...styles.title}} >Edit Food Record</Text>
          </View>
        </View>
      </View>
      
      <View style={alternativeStyles.footer}>
        <View style={styles.card}>    
          <View style={styles.item}>
            <MaterialCommunityIcons name="card-text" color="#05375a" size={30}/>
            <View>
              <Text style={styles.infoSecondaryText}>Description</Text>
              <Picker
                selectedValue={data.desc}
                style={{ marginLeft: 10, height: 50, width: 150}}
                onValueChange={(itemValue, itemIndex) => handleDescChange(itemValue)}
              >
                <Picker.Item label="Black beans" value="Black beans" />
                <Picker.Item label="Boiled potato" value="Boiled potato" />
                <Picker.Item label="Bread" value="Bread" />
                <Picker.Item label="Corn flakes" value="Corn flakes" />
                <Picker.Item label="Flour" value="Flour" />
                <Picker.Item label="Rice" value="Rice" />
                <Picker.Item label="Wholemeal Toast" value="Wholemeal toast" />
              </Picker>
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

const FoodScreen = ({navigation}) => {
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <RootStack.Screen name="FoodMainScreen" component={FoodMainScreen}/>
      <RootStack.Screen name="FoodAddScreen" component={FoodAddScreen}/>
      <RootStack.Screen name="FoodEditScreen" component={FoodEditScreen}/>
    </RootStack.Navigator>
  )  
};

export default FoodScreen;

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