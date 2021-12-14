import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './components/context';

import RootScreen from './screens/RootScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function App() {
 // const [isLoading, setIsLoading] = React.useState(false);
 // const [userToken, setUserToken] = React.useState(null);

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
    signIn: (userEmail, password) => {
      let userToken;
      userEmail = null;
      if( userEmail == 'teste@gmail.com' && password == 'pass') {
        userToken = 'temp';
      }
      dispatch({type: 'LOGIN', email: userEmail, token: userToken});
    },
    signOut: () => {
      dispatch({type: 'LOGOUT'});
    },
    signUp: () => {
    //  setUserToken('rmekmrkes');
    //  setIsLoading(false);
    },
  }), []);

  useEffect(() => {
    setTimeout(() => {
      dispatch({type: 'RETRIEVE_TOKEN', token: null});
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
      <NavigationContainer>
        { loginState.userToken !== null ? (
          <View><Text>Teste</Text></View>
        ) :
          <RootScreen />
        }    
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
