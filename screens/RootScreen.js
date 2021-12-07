import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';

const RootStack = createStackNavigator();

const RootScreen = ({navigation}) => (
    <RootStack.Navigator screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
    
    </RootStack.Navigator>
);

export default RootScreen;