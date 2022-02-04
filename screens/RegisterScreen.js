import React from 'react';
import { View, Text, Button, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';

import RegisterGlucoseLevels from './RegisterGlucoseLevels';
import RegisterInsulinIntake from './RegisterInsulinIntake';
import AutoRegisterGlucoseLevels from './AutoRegisterGlucoseLevels';

const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const RootStack = createStackNavigator();

const OptionsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <View style={{
            ...styles.card,
            ...styles.shadow
          }}>
          <Text style={styles.title}>Choose an option</Text>
          <TouchableOpacity style={{...styles.button,alignItems: 'center', borderColor: '#05375a', borderWidth: 1,
                marginTop: 15}} onPress={()=>{navigation.navigate('RegisterInsulinIntake', {
                  glucoseLevel: '',
                  carbohydrates: '',
                  doses: ''
                  })}}>               
            <Text style={{color: '#27ab7d', fontWeight: 'bold'}}>Register insulin intake</Text>           
          </TouchableOpacity>  
          <TouchableOpacity style={{...styles.button,alignItems: 'center', borderColor: '#05375a', borderWidth: 1,
                marginTop: 15}} onPress={() => {navigation.navigate('RegisterGlucoseLevels', {
                  glucoseLevel: '',
                  tipoRegisto: 1
                })}}>           
            <Text style={{color: '#27ab7d', fontWeight: 'bold'}}>Register glucose levels</Text>           
          </TouchableOpacity>  
          <TouchableOpacity style={{...styles.button,alignItems: 'center', borderColor: '#05375a', borderWidth: 1,
                marginTop: 15}}  onPress={()=> navigation.navigate('AutoRegisterGlucoseLevels')}>            
            <Text style={{color: '#27ab7d', fontWeight: 'bold'}}>Read glucose levels</Text>
          </TouchableOpacity>  
        </View>
      </View>
    </View>
  );
}

const RegisterScreen = ({navigation}) => {
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <RootStack.Screen name="OptionsScreen" component={OptionsScreen}/>
      <RootStack.Screen name="RegisterGlucoseLevels" component={RegisterGlucoseLevels}/>
      <RootStack.Screen name="RegisterInsulinIntake" component={RegisterInsulinIntake}/>
      <RootStack.Screen name="AutoRegisterGlucoseLevels" component={AutoRegisterGlucoseLevels}/>
    </RootStack.Navigator>
  )  
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-end',
    backgroundColor: '#28b584'
  },
  card: {
    alignSelf: 'stretch',
    margin: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    width: dms.width*0.9,
    height: dms.height*0.4,
    marginBottom: dms.height*0.13,
    alignItems: 'center'
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
    color: '#05375a',
    fontSize: 26,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
},
});