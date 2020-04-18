/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * */

import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, ScrollView} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
});

function Greeting(props) {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
}

function Map() {
  return (
    <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion= {{
          latitude: 37.78825,
          longitude: -122.4323,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
  )
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={[styles.center, {top:0}]}>
      <Greeting name="World" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={[styles.map, {top: 50}]}
        initialRegion= {{
          latitude: 42.3601,
          longitude: -71.0589,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>

  );
}

export default App;
