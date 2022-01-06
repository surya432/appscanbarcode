import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Vibration,
  View,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RNCamera} from 'react-native-camera';
import Sound from 'react-native-sound';
const ONE_SECOND_IN_MS = 1000;
const App = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [input, setInput] = useState(''); //0000000521357002140580
  const [listGWNW, setListGWNW] = useState([]);
  const [grandGW, setGrandGW] = useState(0);
  const [grandNW, setGrandNW] = useState(0);
  const [IsReadBarcode, setIsReadBarcode] = useState(false);
  const inputRef = useRef(null);
  const soundRef = useRef(
    new Sound(require('./beep.mp3'), Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('error', error);
      }
    }),
  );
  const soundRefError = useRef(
    new Sound(require('./error.mp3'), Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.error('error', error);
      }
    }),
  );

  const prosesInput = () => {
    if (input.length == 22 && !isNaN(input)) {
      let double = false;
      if (listGWNW.length > 0) {
        listGWNW.forEach(item => {
          if (item.sn == input) {
            Vibration.vibrate(1 * ONE_SECOND_IN_MS);
            soundRefError.current.play();
            Alert.alert('Double Scan!!', 'Silakan scan Barcode lain', [
              {
                text: 'OK',
                onPress: () => {
                  setIsReadBarcode(false);
                  setInput('');
                },
              },
            ]);
            double = true;
            return;
          }
        });
      }
      if (!double) {
        let gwInput = input.substring(18, 24) / 100;
        let nwInput = input.substring(14, 18) / 100;
        let sumGWNW = gwInput + nwInput;
        let gw = parseFloat(sumGWNW).toFixed(2);
        let nw = parseFloat(nwInput).toFixed(2);
        let data = {
          gw: gw,
          nw: nw,
          sn: input,
        };
        let dataGW = 0.0;
        let dataNW = 0.0;
        let listData = [data, ...listGWNW];
        listData.map(item => {
          dataGW += parseFloat(item.gw);
          dataNW += parseFloat(item.nw);
        });
        setGrandGW(parseFloat(dataGW).toFixed(2));
        setGrandNW(parseFloat(dataNW).toFixed(2));
        setListGWNW(listData);
        setInput('');
        if (isCamera == false) {
          inputRef.current.focus();
        } else {
          setIsReadBarcode(false);
        }
      }
    }
  };
  const clearData = () => {
    Alert.alert('Menghapus data.', 'apa anda ingin menghapus data scan?', [
      {
        text: 'OK',
        onPress: () => {
          setListGWNW('');
          setGrandNW('0');
          setGrandGW('0');
        },
      },
      {
        text: 'Batal',
        onPress: () => {},
      },
    ]);
  };
  useEffect(() => {
    prosesInput();
  }, [input]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar />
      <View style={styles.container}>
        <Text style={styles.header}>GW/NW</Text>
        <View style={styles.menu}>
          <Text style={styles.summary}>
            {grandGW}/{grandNW} ({listGWNW.length})
          </Text>
          <View style={styles.switcher}>
            <Ionicons
              name="md-scan-circle"
              size={35}
              onPress={() => {
                setIsCamera(false);
              }}
              color={!isCamera ? 'blue' : 'gray'}
            />

            <Ionicons
              name="camera"
              size={35}
              onPress={() => {
                setIsCamera(true);
              }}
              color={isCamera ? 'blue' : 'gray'}
            />
            <Ionicons
              name="trash"
              color={'red'}
              onPress={() => clearData()}
              size={35}
            />
          </View>
        </View>
        <View style={{height: 200, flex: 1, paddingVertical: 8}}>
          {isCamera && (
            <View
              style={{
                marginVertical: 150,
                height: 200,
                flex: 1,
                flexDirection: 'column',
              }}>
              <RNCamera
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                }}
                defaultTouchToFocus
                mirrorImage={false}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onBarCodeRead={async e => {
                  if (!IsReadBarcode) {
                    setInput(e.data);
                    soundRef.current.play();
                    setIsReadBarcode(true);
                  }
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0.2, 0.2, 0.2, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      width: 200,
                      height: 200,
                      backgroundColor: 'transparent',
                      borderColor: 'white',
                      borderWidth: 0.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 250,
                        height: 1,
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        borderWidth: 1,
                      }}
                    />
                  </View>
                </View>
              </RNCamera>
            </View>
          )}
          {!isCamera && (
            <View>
              <TextInput
                ref={inputRef}
                autoFocus={true}
                focusable={true}
                value={input}
                returnKeyType="default"
                onSubmitEditing={() => {
                  inputRef.current.focus();
                }}
                blurOnSubmit={false}
                placeholder="klik disini untuk hardware Scanner"
                onChangeText={text => {
                  setInput(text);
                }}
              />
            </View>
          )}
          <FlatList
            style={{flex: 1}}
            data={listGWNW}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{backgroundColor: 'gray', height: 0.5}} />
            )}
            renderItem={({item, index}) => (
              <View style={styles.menu}>
                <Text style={styles.item}>
                  {item.gw} / {item.nw}
                </Text>
                <Text>{listGWNW.length - index}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  item: {
    padding: 2,
  },
  preview: {
    width: '100%',
    height: 200,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28,
    color: 'black',
  },
  switcher: {
    flexDirection: 'row',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summary: {
    fontWeight: '400',
    fontSize: 20,
    color: 'black',
  },
});
