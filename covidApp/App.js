/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * */

import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView, StatusBar, SafeAreaView, Keyboard,Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Container, Header, Button,Item,Input} from 'native-base';
import Map from './components/Map';

function Greeting(props) {
  return (
      <Text>Hello {props.name}!</Text>
  );
}

function inlineMap() {
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

class App extends React.Component {
  //const [count, setCount] = useState(0);
  constructor(props) {
    super(props);
    this.state = {
      mysearch: '',
      country: '',
      region: {
          latitude: 37.78825,
          longitude: -122.4323,
          latitudeDelta: 40,
          longitudeDelta: 40,
      },
      data: {
        Country: "",
        CountryCode: "",
        Province: "",
        City: "",
        CityCode: "",
        Lat: "",
        Lon: "",
        Confirmed: 0,
        Deaths: 0,
        Recovered: 0,
        Active: 0,
        Date: ""
      },
      data1: [],
      isLoading: true,
      wrongSearch: false,
      markers: [],
    };
    this.mapApiKey = 'AIzaSyDH6gwc2fQ6WkQgreJfSydB_YdppB9Ps1s';
    Geocoder.init(this.mapApiKey);

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getSearchKeyword = this.getSearchKeyword.bind(this);
    this.handleMapPress = this.handleMapPress.bind(this);
  }



  getSearchKeyword() {
    Keyboard.dismiss();
    if (this.state.mysearch === '' || this.state.mysearch === undefined) {
      return;
    }
    let searchKeyword = this.state.mysearch;
    console.log("getSearchKeyword: ", searchKeyword);
    let lat = '', lng='';
    // change non-standard input to long_name of country.
    Geocoder.from(searchKeyword).then(
      response => {
        this.setState({wrongSearch:false});
        lat = response.results[0].geometry.location.lat;
        lng = response.results[0].geometry.location.lng;
        let long_name = '';
        for (var parse in response.results[0].address_components) {
          if (response.results[0].address_components[parse].types.includes('country')) {
            const address = response.results[0].address_components[parse].long_name;
            long_name = address.replace(' ','-');
            console.log("getSearchKeyword: ", lat, lng, long_name);
          } else {
            long_name = '';
          }
        }
        
        this.setState({
          country: long_name,
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 40,
            longitudeDelta: 40,
          },
        })
      },
      error => {
        console.error(error);
      }
    );
  };

  handleSearchChange = (search) => {
    this.setState({mysearch: search})
  }

  handleMapPress = (location) => {
    const lat = location.nativeEvent.coordinate.latitude;
    const lng = location.nativeEvent.coordinate.longitude;
    Geocoder.from(lat, lng).then(
      response => {
        let long_name = '';
        
        for (var parse in response.results[0].address_components) {
          var jsonAddress = response.results[0].address_components[parse];
          console.log('response.results[0]',jsonAddress);
          if (jsonAddress.types.includes("country")) {
            long_name = jsonAddress.long_name.replace(' ','-');
          }
        }
        console.log('handleMapPress ,long_name', long_name);
        this.setState({
          country: long_name,
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 40,
            longitudeDelta: 40,
          },
        });
        if (long_name === '') {
          console.log('long_name does not get');
        } else {
          this.getData(long_name, true,lat,lng);
        }
        
      },
      error => {
        console.error(error);
      }
    )
    this.setMarker(lat,lng);
    console.log('handleMapPress'," lat: " + lat+" lng: " + lng);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  setMarker = (latitude, longitude) => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: {
            latitude: latitude,
            longitude: longitude,
          },
          title: this.state.Country,
          description: this.state.data.Confirmed,
        },
      ],
    });
  };

  getData(country, isSetMarker, latitude, longitude) {
    if (this.state.wrongSearch === false) {
      console.log('Start to get data from covid-19 api');
      fetch('https://api.covid19api.com/total/country/' + country, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json();
      }).then(data => {
        return data[data.length -1];
      }).then(json => {
        console.log("Json", json.Active, json.Recovered);
        this.setState(() =>{
          return {
            data: {
              Country: json.Country,
              CountryCode: json.CountryCode,
              Province: json.Province,
              City: json.City,
              CityCode: json.CityCode,
              Lat: json.Lat,
              Lon: json.Lon,
              Confirmed: json.Confirmed,
              Deaths: json.Deaths,
              Recovered: json.Recovered,
              Active: json.Active,
              Date: json.Date,
            },
          }
        });
        isSetMarker && this.setMarker(latitude, longitude);
      }).catch((error) => {
        console.error(error);
      })
    
    } else {
      console.log('response json', 'wrongsearch')
    }
  }

  renderCarouselItem = ({item}) => 
    <View>
      <Text>{item.Active}</Text>
      <Image></Image>
    </View>
  
  render() {
    return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <Header transparent={true} searchBar rounded>
          <Item>
            <Input placeholder= {
              this.state.wrongSearch ? 'Country not found!' : 'Country'
              }
              onChangeText={this.handleSearchChange}
              value={this.state.mysearch}/>
            <Button transparent onPress={this.getSearchKeyword}><Text>Search</Text></Button>
          </Item>
        </Header>
      </View>
      <View style={styles.body}>
       <Map
         style={styles.data}
         location={this.state.region}
         //COUNTRY={THIS.STATE.SHORTCOUNTRY}
         //CASES={THIS.STATE.DATA.ACTIVE}
         handleMapPress={this.handleMapPress}
         markers={this.state.markers}
         onRegionChange= {this.onRegionChange}
      />
       <View style={styles.sectionContainer}>
         <Text>Country: {this.state.data.Country}</Text>
         {/* <Text>CountryCode: {this.state.data.CountryCode}</Text>
         <Text>Province: {this.state.data.Province}</Text>
         <Text>City: {this.state.data.City}</Text>
         <Text>CityCode: {this.state.data.CityCode}</Text>
         <Text>Latitude: {this.state.data.Lat}</Text>
         <Text>Longtitude: {this.state.data.Lon}</Text>
         <Text>CityCode: {this.state.data.CityCode}</Text> */}
         <Text>Confirmed cases: {this.state.data.Confirmed}</Text>
         <Text>Deaths cases: {this.state.data.Deaths}</Text>
         <Text>Recovered cases: {this.state.data.Recovered}</Text>
         <Text>Active cases: {this.state.data.Active}</Text>
         <Text>Date of report: {this.state.data.Date}</Text>
       </View>
      </View>
    </Container>
    );
  }
    
   
  
}

const styles = StyleSheet.create({
  scrollView: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.lighter,
  },
  body: {
    flex: 10,
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  header: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
  },
  data: {
    flex: 1,
  }
});

export default App;
