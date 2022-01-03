import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import {RNCamera} from 'react-native-camera';
const App = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [input, setInput] = useState('0000000521357002140580');
  const toggleSwitch = () => setIsCamera(!isCamera);
  const [listGWNW, setListGWNW] = useState([]);

  const [grandGW, setGrandGW] = useState(0);
  const [grandNW, setGrandNW] = useState(0);
  let numOr0 = n => (isNaN(n) ? 0 : n);

  const prosesInput = () => {
    if (input.length == 22 && !isNaN(input)) {
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
        console.log(parseFloat(item.gw));
        dataGW += parseFloat(item.gw);
        dataNW += parseFloat(item.nw);
      });
      setGrandGW(parseFloat(dataGW).toFixed(2));
      setGrandNW(parseFloat(dataNW).toFixed(2));
      setListGWNW(listData);
      setInput('');
    }
  };
  const onBarCodeRead = e => {
    console.log(e.data);
    setInput(e.data);
  };
  useEffect(() => {
    prosesInput();
    return () => {};
  }, [input]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar />
      <View style={styles.container}>
        <Text style={styles.header}>GW/NW</Text>
        <View style={styles.menu}>
          <Text style={styles.summary}>
            {grandGW}/{grandNW} {listGWNW.length}
          </Text>
          <View style={styles.switcher}>
            <MaterialCommunityIcons name="md-scan-circle" size={24} />
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isCamera ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isCamera}
            />
            <MaterialCommunityIcons name="camera" size={24} />
          </View>
        </View>
        <View style={{height: 200, flex: 1}}>
          {isCamera && (
            <View
              style={{
                marginVertical: 140,
                height: 200,
                flex: 1,
                flexDirection: 'column',
              }}>
              <RNCamera
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                }}
                autoFocus
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
                onBarCodeRead={e => {
                  onBarCodeRead(e);
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
                      borderWidth: 1,
                    }}
                  />
                </View>
              </RNCamera>
            </View>
          )}
          {!isCamera && (
            <View>
              <TextInput
                value={input}
                placeholder="klik disini untuk hardware Scanner "
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
    padding: 5,
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
