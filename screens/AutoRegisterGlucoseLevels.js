import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

const AutoRegisterGlucoseLevels = ({navigation}) => {
    const [data, setData] = React.useState({
        glucoseLevel: 0,
        info: 'Place the back of your phone on the sensor',
        error: null
      });

      let hasStartedNFC = false;

      const decodeNdefRecord = record => {
        if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
          return ["text", Ndef.text.decodePayload(record.payload)];
        }
        if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
          return ["uri", Ndef.uri.decodePayload(record.payload)];
        }
      
        return ["unknown", "---"];
      };
      
      const registerTagEvent = () => {
        NfcManager.registerTagEvent(tag => {
          let parsed = null;
          if (tag.ndefMessage && tag.ndefMessage.length > 0) {
            const ndefRecords = tag.ndefMessage;
            parsed = ndefRecords.map(decodeNdefRecord);

            setData({
              ...data,
              glucoseLevel: parsed[0][1]
            });

            navigation.navigate('RegisterGlucoseLevels', {
                          glucoseLevel: parsed[0][1],
                          tipoRegisto: 2
                      });
          }
        });
      };
      
      const unregisterTagEvent = () => {
        NfcManager.unregisterTagEvent();
      };
      
      const startNFCManager = async () =>
        NfcManager.start()
          .then(result => ({
            Success: `Success ${result}`
          }))
          .catch(error => ({ Error: error }));
      
      const stopNFCManager = () => {
        NfcManager.stop();
      };

      const handleError = (error) => {
        setData({
          ...data,
          error: error
        })
      }
      
      const isNFCSupported = async () => NfcManager.isSupported();
      
      const startNFC = async () => {
        const isSupported = await isNFCSupported();
      
        if (isSupported) {
          const startResult = await startNFCManager();
      
          if (startResult.Success) {
            registerTagEvent();
            hasStartedNFC = true;
            return true;
          }

          handleError("There was an error initializing NFC Manager");
          return;
        }
        handleError("This device does not allow NFC");
        return;
      };
      
      // const handleNFCTagReading = nfcResult => {
      //   if (nfcResult.Error) {
      //     setData({
      //       ...data,
      //       error: nfcResult.Error.Title,
      //     });
      //   } else {
      //       setData({
      //           ...data,
      //           glucoseLevel: nfcResult.tagValue
      //       });
      //       setTimeout(()=> {
      //           navigation.navigate('OptionsScreen');
      //       }, 4000)  
      //   }
      // };

      const stopNFC = () => {
        if (hasStartedNFC) {
          unregisterTagEvent();
          stopNFCManager();
          hasStartedNFC = false;
        }
      };

    // async function readNdef() {
    //     try {
    //         await NfcManager.requestTechnology(NfcTech.NfcV);
    //         const tag = await NfcManager.getTag();
    //         setData({
    //             ...data,
    //             info: 'Tag found'
    //         })
    //         navigation.navigate('RegisterGlucoseLevels', {
    //             glucoseLevel: tag.ndefMessage,
    //             tipoRegisto: 2
    //         });
    //     } catch (ex) {
    //         setData({
    //             ...data,
    //             error: 'Error reading sensor'
    //         });
    //         NfcManager.cancelTechnologyRequest();
    //         setTimeout(()=> {
    //             navigation.navigate('OptionsScreen');
    //         }, 4000)  
    //     }
    // }

    useEffect(() => {
        // readNdef();
        startNFC();
        
        return () => {
            stopNFC();
        }
    }, []);
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        </View>
        <Animatable.View style={styles.footer}
            animation="fadeInUpBig"
            duraton="1500"
        >
            <MaterialCommunityIcons name="nfc" color="#05375a" size={130} style={{marginBottom: 150}}/>
            <Animatable.View animation="bounceIn" style={{alignItems: 'center'}}>
                <Text style={styles.title}>{data.info}</Text>
            </Animatable.View>
            { data.error !== null ? 
            <Animatable.View animation="bounceIn" style={{alignItems: 'center', marginTop: 90}}>
                <Text style={styles.errorMsg}>{data.error}</Text>
            </Animatable.View>
             : null
             }
        </Animatable.View>
    </View>
  );
};

export default AutoRegisterGlucoseLevels;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.32;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#28b584'
  },
  header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 5,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30,
      alignItems: 'center'
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center'
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
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 17,
  },
});