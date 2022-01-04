import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './components/context';
import { TokenContext } from './components/context';

import MainNenu from './screens/MainMenu';
import RootScreen from './screens/RootScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const firstLoginState = {
    isLoading: true,
    email: null,
    userToken: null,
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
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          userEmail: action.email,
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
    },
    signUp: () => {
    //  setUserToken('rmekmrkes');
    //  setIsLoading(false);
    },
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
