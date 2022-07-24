import React, {useEffect} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location';

const {width: SCREEN_SIZE} = Dimensions.get('window');

const App = () => {
  const [location, setLocation] = React.useState();
  let status = Location.requestForegroundPermissionsAsync();
  console.log(status);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Seoul</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.dec}>Sunny</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.dec}>Sunny</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.dec}>Sunny</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.dec}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
  },
  weather: {
    // backgroundColor: 'teal',
  },
  day: {
    width: SCREEN_SIZE,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  dec: {
    fontSize: 60,
    marginTop: -30,
  },
});

export default App;
