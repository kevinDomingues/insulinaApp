import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, StyleSheet, Dimensions, FlatList, SafeAreaView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TokenContext } from '../components/context';
import { URL } from '../components/apiURL';
import { formatDate } from '../components/dateFormatter';


const dms = {
  height:Dimensions.get('window').height,
  width:Dimensions.get('window').width,
}

const ExerciseScreen = ({navigation}) => {

    const [lastExercise, setLastExercise] = React.useState([]);
    const [exercises, setExercises] = React.useState([]);

    const userToken = useContext(TokenContext);

    const getLastExercise = async (id) => {
      try {      
        let response = await fetch(`${URL}/exercicio/getLatest/${id}`);
        
        let json = await response.json();
  
        setLastExercise(json);
      } catch (error) {
        console.error(error);
      }
    };

    const getExercises = async (id) => {
      try {      
        let response = await fetch(`${URL}/exercicio/getExercises/${id}`);
        
        let json = await response.json();
  
        setExercises(json);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getLastExercise(userToken);
      getExercises(userToken);
    }, []);

    const ListItem = ({exercise}) => {
      return (
        <View style={{
          ...styles.Listcard,
          ...styles.shadow
        }}>
          <View style={styles.item}>
            <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Intensity</Text>
              <Text style={styles.ListinfoText}> {exercise.intensity} </Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Minutes</Text>
              <Text style={styles.ListinfoText}>{exercise.minutes} min</Text>
            </View>
          </View>
          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar-month" color="#05375a" size={30}/>
            <View>
              <Text style={styles.ListinfoSecondaryText}>Date</Text>
              <Text style={styles.ListinfoText}>{formatDate(exercise.dataHora, 1)}</Text>
            </View>
          </View>        
        </View>
      );
    };
  
    return (
      <View style={styles.container}>
        <StatusBar style={{backgroundColor: '#28b584'}}/>
        <LinearGradient colors={['#35cc98', '#27ab7d']} style={styles.header}>
          
        </LinearGradient>
        
        <View style={styles.footer}>
          <Text style={styles.title}>Exercises</Text>

          <View style={{
              ...styles.card,
              ...styles.shadow
            }}>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: "#05375a"}}>Last exercise</Text>
            <View style={styles.item}>
              <MaterialCommunityIcons name="run-fast" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Intensity of Exercise</Text>
                <Text style={styles.infoText}>{lastExercise.intensity}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <MaterialCommunityIcons name="clock" color="#05375a" size={30}/>
              <View>
                <Text style={styles.infoSecondaryText}>Minutes</Text>
                <Text style={styles.infoText}>{lastExercise.minutes} min</Text>
              </View>
            </View>
          </View>
          
          <SafeAreaView>
            <FlatList data={exercises}
              contentContainerStyle={{alignItems: 'center'}}
              style={{height: dms.height*0.49}}
              showsVerticalScrollIndicator={false}
              windowSize={1}
              numColumns={2}
              keyExtractor={item => item._id}
              renderItem={({item}) => <ListItem exercise={item} />} 
            />
          </SafeAreaView>
        </View>
      </View>
    );
};

export default ExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    justifyContent: 'center',
    backgroundColor: '#28b584',
    width: dms.width,
    height: dms.height*0.35,
    position: 'relative',
    zIndex: 1
  },
  footer: {
      alignSelf: 'stretch',
      zIndex: 2,
      marginTop: -180,
      flex: 1, 
  },
  card: {
    alignSelf: 'stretch',
    margin: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  Listcard: {
    alignSelf: 'stretch',
    margin: 10,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    width: 160
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 5
  },
  infoText: {
    fontSize: 17,
    marginLeft: 13,
  },
  infoSecondaryText: {
    color: '#b0b0b0',
    marginLeft: 16,
  },
  ListinfoText: {
    fontSize: 12,
    marginLeft: 8,
  },
  ListinfoSecondaryText: {
    color: '#b0b0b0',
    fontSize: 14,
    marginLeft: 9,
  },
  shadow: {
    shadowColor: '#a3a3a3',
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8
  },
  title: {
    color: '#fff',
    fontSize: 46,
    fontWeight: 'bold',
    textShadowColor: '#a3a3a3',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
    marginLeft: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: '#a3a3a3',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
    marginLeft: 20,
  }
});