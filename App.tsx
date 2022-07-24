import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import Config from 'react-native-config';
const {width: SCREEN_SIZE} = Dimensions.get('window');

const App = () => {
  const [city, setCity] = useState();
  const [days, setDays] = useState([]);
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result);
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          // if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
          //   Alert.alert(
          //     '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
          //     '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
          //     [
          //       {
          //         text: '네',
          //         onPress: () => Linking.openSettings(),
          //       },
          //       {
          //         text: '아니오',
          //         onPress: () => console.log('No Pressed'),
          //         style: 'cancel',
          //       },
          //     ],
          //   );
          // }
        })
        .catch(console.error);
    }
  }, []);

  const API_KEY = '';

  const getCityName = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async ({coords}: GeolocationResponse) => {
          setLat(coords.latitude);
          setLon(coords.longitude);

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`,
          );
          const responseJson = await response.json();

          const res = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=alerts&appid=${API_KEY}`,
          );
          const json = await res.json();
          setCity(responseJson.city);
        },
        async (_error: GeolocationError) => {},
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000,
        },
      );
    });
  };

  useEffect(() => {
    getCityName();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
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
