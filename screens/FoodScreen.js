import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { AuthContext } from '../components/context';

const FoodScreen = ({navigation}) => {

  const { signOut } = React.useContext(AuthContext);

  
    return (
      <View style={styles.container}>
        <Text>Food Screen</Text>
      </View>
    );
};

export default FoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});