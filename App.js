import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './components/context';
import { TokenContext } from './components/context';
import { URL } from './components/apiURL';

import MainNenu from './screens/MainMenu';
import RootScreen from './screens/RootScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const firstLoginState = {
    isLoading: true,
    email: null,
    userToken: null,
  };

  const checkToken = async (token) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token': `${token}` 
            }
        }
    
      let response = await fetch(
        `${URL}/user/checkToken`, requestOptions
        );
      
      let json = await response.json();

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const loginReducer = (prevState, action) => {
    switch ( action.type ) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          userEmail: action.email,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          userEmail: null,
          isLoading: false,
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, firstLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(userToken, userEmail) => { 
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }
      
      dispatch({type: 'LOGIN', email: userEmail, token: userToken});
    },
    signOut: async() => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'LOGOUT'});
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});

      if(userToken!==null){
        let tokenValid = await checkToken(userToken);
        
        if(!(typeof tokenValid === 'object' && !Array.isArray(tokenValid) && tokenValid !== null)){
          dispatch({type: 'LOGOUT'});
        }
      }  
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <TokenContext.Provider value={loginState.userToken}>
      <NavigationContainer>
        { loginState.userToken !== null ? (
          <MainNenu />
        ) :
          <RootScreen />
        }    
      </NavigationContainer>
      </TokenContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
