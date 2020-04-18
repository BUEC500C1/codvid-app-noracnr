/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * */

import React, {useState} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Greeting(props) {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={[styles.center, {top: 100}]}>
      <Text>You clicked {count} times</Text>
      <Button
        onPress={() => setCount(count+1)}
        title="Click me"
      />
      
      <Greeting name="Noracnr" />
      <Greeting name="World" />
      <Greeting name="Covid-19" />
    </View>
  );
}

export default App;
