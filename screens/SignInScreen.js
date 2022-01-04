import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Button, TouchableOpacity, Platform, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { validatePathConfig } from '@react-navigation/core';
import { URL } from '../components/apiURL';

import { AuthContext } from '../components/context';


const SignInScreen = ({navigation}) => {

  const [data, setData] = React.useState({
      email: '',
      password: '',
      checkTextInputChange: false,
      secureTextEntry: true,
      error: null
  });

  const getLoginResponse = async (userEmail, password) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, password: password })
        }
    
      let response = await fetch(
        `${URL}/user/login`, requestOptions
        );
      
      let json = await response.json();

      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const { signIn } = React.useContext(AuthContext);

  const textInputChange = (val) => {
      if( val.length >= 1 ) {
          setData({
              ...data,
              email: val,
              checkTextInputChange: true
          });
      } else {
          setData({
              ...data,
              email: val,
              checkTextInputChange: false
          });
      }
  }

  const passwordInputChange = (val) => {
      setData({
          ...data,
          password: val
      });
  }

  const hidePassword = () => {
      setData({
          ...data,
          secureTextEntry: !data.secureTextEntry
      })
  }

  const handleError = (error) => {
      setData({
          ...data,
          error: error
      })
  }

  const handleLogin = async (email, password) => {
      let userToken = await getLoginResponse(email, password);
      if(userToken.token){
        handleError('') 
        signIn(userToken.token, email);
      } 
      else if(userToken.message) {
          handleError(userToken.message);
        };
  }

  return (
    <View style={styles.container}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
            <Text style={styles.text_header}>Login</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.footer}>
            <Text style={[styles.text_footer, {marginTop: 15}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome name="user-o" color="#05375a" size={20}/>
                <TextInput placeholder="Email" style={styles.textInput} autoCapitalize="none" onChangeText={(val) => textInputChange(val)}/>
                {data.checkTextInputChange ? 
                <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
                : null}
            </View>
            <Text style={[styles.text_footer, {marginTop: 25}]}>Password</Text>
            <View style={styles.action}>
                <Feather name="lock" color="#05375a" size={20}/>
                <TextInput secureTextEntry={data.secureTextEntry ? true : false} placeholder="Password" style={styles.textInput} autoCapitalize="none" onChangeText={(val) => passwordInputChange(val)}/>
                <TouchableOpacity onPress={hidePassword}>
                    {data.secureTextEntry ? 
                    <Feather name="eye-off" color="grey" size={20} />
                    :
                    <Feather name="eye" color="grey" size={20} />
                    }
                </TouchableOpacity>
            </View>

            <View style={styles.button}>
                <TouchableOpacity style={styles.signIn} onPress={() => {handleLogin(data.email, data.password)}}>
                    <LinearGradient 
                        colors={['#35cc98', '#27ab7d']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity  onPress={()=>navigation.navigate('SignUpScreen')} style={[styles.signIn, {
                    borderColor: '#998387',
                    borderWidth: 1,
                    marginTop: 15
                }]}>
                    <Text style={[styles.textSign, {color: '#27ab7d'}]}>Sign Up</Text> 
                </TouchableOpacity>
            </View>
            { data.error !== null ? 
            <Animatable.View animation="bounceIn" style={styles.signIn}>
                <Text style={styles.errorMsg}>{data.error}</Text>
            </Animatable.View>
             : null
             }
        </Animatable.View>
    </View>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#28b584'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 17,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });