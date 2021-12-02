import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const SplashScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Animatable.Image 
            animation="bounceIn"
            duraton="1500"
            source={require('../assets/HealthControl.png')} style={styles.logo} resizeMode="stretch"/>
        </View>
        <Animatable.View style={styles.footer}
            animation="fadeInUpBig"
        >
            <Text style={styles.title}>Improve your lifestyle</Text>
            <Text style={styles.text}>Sign in with your account</Text>
            <View style={styles.button}>
                <TouchableOpacity onPress={()=>navigation.navigate('SignInScreen')}>
                    <LinearGradient colors={['#08d4c4', '#01ab9d']}
                        styles={styles.signIn}
                 >
                        <Text style={styles.textSign}>Get started</Text>
                        <MaterialIcons name="navigate-next"
                        color="#fff"
                        size={20} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    </View>
  );
}

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.32;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#28b584'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30,
      justifyContent: 'center'
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});