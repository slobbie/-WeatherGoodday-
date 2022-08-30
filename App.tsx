import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
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
import Icon from 'react-native-vector-icons/AntDesign';

const {width: SCREEN_SIZE} = Dimensions.get('window');

interface weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

interface WeatherData {
  weather: weather[];
  dt_txt: string;
}

interface DaysData {
  weather: Iweather[];
}

interface Iweather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

const App = () => {
  const [city, setCity] = useState();
  const [days, setDays] = useState<DaysData>();
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

  const API_KEY = 'd2c13dc71f101c758db158a753e40903';

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
            `https://api.openweathermap.org/data/2.5/weather?lat=37.335&lon=-122.0327&appid=${API_KEY}`,
          );
          const json: DaysData = await res.json();
          setCity(responseJson.city);
          setDays(json);
          console.log(json, 'day');
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
    // Geolocation.getCurrentPosition(
    //   async ({coords}: GeolocationResponse) => {
    //     setLat(coords.latitude);
    //     setLon(coords.longitude);

    //     const response = await fetch(
    //       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`,
    //     );
    //     const responseJson = await response.json();

    //     const res = await fetch(
    //       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lat}&appid=${API_KEY}`,
    //     );
    //     const json: DaysData = await res.json();
    //     setCity(responseJson.city);
    //     setDays(json);
    //     console.log(json, 'day');
    //   },
    //   async (_error: GeolocationError) => {},
    //   {
    //     enableHighAccuracy: false,
    //     timeout: 2000,
    //     maximumAge: 3600000,
    //   },
    // );
  }, []);

  // http://openweathermap.org/img/wn/10d@2x.png

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
        {days?.weather.map(item => {
          return (
            <View style={styles.day}>
              <Text style={styles.temp}>{item.main}</Text>
              <Text style={styles.dec}>{item.description}</Text>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
                }}
              />
            </View>
          );
        })}
        {/* <Icon name="cloudo" size={30} color="#fff" /> */}
        <View style={styles.day}>
          <Text style={styles.temp}>1</Text>
          <Text style={styles.dec}>맑</Text>
          <Icon name="cloudo" size={30} color="#fff" />
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>2</Text>
          <Text style={styles.dec}>흐림</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>3</Text>
          <Text style={styles.dec}>비옴</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>4</Text>
          <Text style={styles.dec}>구름</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0064FF',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
    color: '#fff',
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
    marginBottom: 20,
    fontSize: 100,
    color: '#fff',
  },
  dec: {
    fontSize: 50,
    marginTop: -30,
    color: '#fff',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});

export default App;
