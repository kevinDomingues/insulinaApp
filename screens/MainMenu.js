import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthContext } from '../components/context';

const MainMenu = ({navigation}) => {
  const { signOut } = React.useContext(AuthContext);


  return (
    <View style={styles.container}>
        <Animatable.View style={styles.header}>
            <Text>Olá User</Text>
        </Animatable.View>
        <Animatable.View style={styles.footer}
            animation="fadeInUpBig"
            duraton="1500"
        >
            <Text style={styles.text}>Teste</Text>
            <View style={styles.button}>
                <TouchableOpacity onPress={() => {signOut()}}>
                    <LinearGradient 
                        colors={['#35cc98', '#27ab7d']}
                        style={styles.signIn}
                 >
                        <Text style={styles.textSign}>LogOut</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    </View>
  );
};

export default MainMenu;

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
      marginTop: 30,
      alignItems: 'center'
  },
  signIn: {
      marginTop: 50,
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});