import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Button, TouchableOpacity, Platform, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { validatePathConfig } from '@react-navigation/core';


const SignUpScreen = ({navigation}) => {

  const [data, setData] = React.useState({
      email: '',
      password: '',
      checkTextInputChange: false,
      secureTextEntry: true
  });

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

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register</Text>
        </View>
        <Animatable.View style={styles.footer}>
            <Text style={[styles.text_footer, {marginTop: 15}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome name="user-o" color="#05375a" size={20}/>
                <TextInput placeholder="Insert your email" style={styles.textInput} autoCapitalize="none" onChangeText={(val) => textInputChange(val)}/>
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
            <Text style={[styles.text_footer, {marginTop: 25}]}>Confirm Password</Text>
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
                <TouchableOpacity style={styles.signIn}>
                    <LinearGradient 
                        colors={['#35cc98', '#27ab7d']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=>navigation.navigate('SignInScreen')} style={[styles.signIn, {
                    borderColor: '#998387',
                    borderWidth: 1,
                    marginTop: 15
                }]}>
                    <Text style={[styles.textSign, {color: '#27ab7d'}]}>Back</Text> 
                </TouchableOpacity>
            </View>
        </Animatable.View>
    </View>
  );
}

export default SignUpScreen;

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
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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