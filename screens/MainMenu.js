import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen.js';
import FoodScreen from './FoodScreen.js';
import RegisterScreen from './RegisterScreen.js';
import ExerciseScreen from './ExerciseScreen.js';
import ProfileScreen from './ProfileScreen.js';


const Tab = createBottomTabNavigator();

const CustomButton = ({children, onPress}) => ( 
    <TouchableOpacity 
    style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
    }}
    onPress={onPress}
    >
        <View style={{
            width: 60,
            height: 60,
            borderRadius: 35,
            backgroundColor: '#28b584'
        }}>
            {children}
        </View>
    </TouchableOpacity>
);


const MainMenu = ({navigation, userToken}) => {

  return (
      <Tab.Navigator initialRouteName="Home" screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { 
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            borderRadius: 15,
            backgroundColor: '#fff',
            height: 70,
            ...styles.shadow
          }
        }}
      >
          <Tab.Screen name="Home" component={HomeScreen}
            options={{ tabBarIcon: ({ focused }) => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="ios-home" color={focused ? '#28b584' : '#748c94'} size={26} />
                    <Text style={{color: focused ? '#28b584' : '#748c94', fontSize: 12}}>Home</Text>
                </View>
                 ),
            }}/>
            <Tab.Screen name="Food" component={FoodScreen}
            options={{ tabBarIcon: ({ focused }) => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="fast-food" color={focused ? '#28b584' : '#748c94'} size={26} />
                    <Text style={{color: focused ? '#28b584' : '#748c94', fontSize: 12}}>Food</Text>
                </View> ),
            }} />
            <Tab.Screen name="Register" component={RegisterScreen}
            options={{ unmountOnBlur:true, tabBarIcon: ({ focused }) => (
                <Image
                    source={require('../assets/plus.png')}
                    resizeMode="contain"
                    style={{
                        width: 40,
                        height: 40,
                        tintColor: '#ffffff'
                    }}
                />
                ),
                tabBarButton: (props) => (
                    <CustomButton {...props} />
                )
            }} /> 
            <Tab.Screen name="Exercise" component={ExerciseScreen}
            options={{ tabBarIcon: ({ focused }) => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="barbell" color={focused ? '#28b584' : '#748c94'} size={26} />
                    <Text style={{color: focused ? '#28b584' : '#748c94', fontSize: 12}}>Exercise</Text>
                </View> ),
            }} />
           <Tab.Screen name="Profile" component={ProfileScreen}
            options={{ tabBarIcon: ({ focused }) => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name="ios-person" color={focused ? '#28b584' : '#748c94'} size={26} />
                    <Text style={{color: focused ? '#28b584' : '#748c94', fontSize: 12}}>Profile</Text>
                </View> ),
            }} />
      </Tab.Navigator>
    
  );
};

export default MainMenu;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#a3a3a3',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})