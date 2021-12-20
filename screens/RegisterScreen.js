import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { AuthContext } from '../components/context';

const RegisterScreen = ({navigation}) => {

  const { signOut } = React.useContext(AuthContext);

  
    return (
      <View style={styles.container}>
        <Text>Register Screen</Text>
      </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});