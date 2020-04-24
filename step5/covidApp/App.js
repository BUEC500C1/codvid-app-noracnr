/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 * */

import React, {useState} from 'react';
import {Text, View, StyleSheet, Keyboard,Dimensions, YellowBox} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from 'react-native-geocoding';
import Carousel from 'react-native-snap-carousel';
import Datepicker from 'react-native-date-picker';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Container, Header, Button,Item,Input, Segment, Footer, FooterTab, Icon} from 'native-base';
import Map from './components/Map';




class App extends React.Component {
  //const [count, setCount] = useState(0);
  constructor(props) {
    YellowBox.ignoreWarnings(['Warning: ReactNative.createElement']);
    console.disableYellowBox = true;
    super(props);
    this.state = {
      activeSegment: 'globalData',
      longpress: false,
      mysearch: '',
      country: '',
      minDate: new Date("2020-01-22"),
      maxDate: new Date(Date.now()),
      startDate: new Date("2020-04-01"),
      endDate: new Date("2020-04-24"),
      region: {
          latitude: 42.3601,
          longitude: -71.0589,
          latitudeDelta: 40,
          longitudeDelta: 40,
      },
      data1: [],
      globalData : [],
      isLoading: true,
      wrongSearch: false,
      markers: [],
      activeIndex:0,
    };
    this.mapApiKey = 'AIzaSyDH6gwc2fQ6WkQgreJfSydB_YdppB9Ps1s';
    Geocoder.init(this.mapApiKey);
    this.getGlobalData();
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getSearchKeyword = this.getSearchKeyword.bind(this);
    this.handleMapPress = this.handleMapPress.bind(this);
    this.handleSegmentChange = this.handleSegmentChange.bind(this);
    this.getApiData = this.getApiData.bind(this);
    this.renderCarousel = this.renderCarousel.bind(this);
    // const [date, setDate] = useState(new Date(1598051730000));
    // console.log('date',date, setDate)
    // const [mode, setMode] = useState('date');
    // console.log('date mode',mode, setMode)
  }

  handleSegmentChange = segment => {
    if (segment === 'globalData') {
      this.setState({activeSegment: 'globalData'}); 
    } else if (segment === 'countryData') {
      this.setState({activeSegment: 'countryData'});
    } else if (segment === 'liveData') {
      this.setState({activeSegment: 'liveData'});
    } else if (segment === 'date') {
      this.setState({activeSegment: 'date'});
    } 
  };

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
          this.setState({
            longpress: false,
          });
          console.log('long_name does not get');
        } else {
          this.setState({
            longpress: true,
          });
          if (this.state.activeSegment === 'countryData') {
            this.getDataArray(long_name, true,lat,lng);
          } else if (this.state.activeSegment === 'liveData') {
            this.getLiveDataArray(long_name, true,lat,lng);
          } else if (this.state.activeSegment === 'date') {
            this.getDateDataArray(long_name, true,lat,lng);
          }
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

  renderCarousel() {
    if (this.state.longpress) {
      return (<View style={styles.carousel}>
        <Carousel
          style={styles.carousel}
          layout={'default'}
          ref={(c) => { this._carousel = c; }}
          data={this.state.data1}
          renderItem={this._renderCarouselCountryItem}
          sliderWidth={width}
          itemWidth={400}
        />
      </View>)
    }
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
          description: '',
        },
      ],
    });
  };

  getDataArray(country, isSetMarker, latitude, longitude) {
    if (this.state.wrongSearch === false) {
      console.log("Request:", "Now get country data array");
      this.getApiData('https://api.covid19api.com/country/' + country,isSetMarker,latitude,longitude);
    } else {
      console.log('response json', 'wrongsearch')
    }
  }

  getLiveDataArray(country, isSetMarker, latitude, longitude) {
    if (this.state.wrongSearch === false) {
      console.log("Request:", "Now get Live data array");
      this.getApiData('https://api.covid19api.com/live/country/' + country,isSetMarker,latitude,longitude);
    } else {
      console.log('response json', 'wrongsearch')
    }
  }

  getDateDataArray(country, isSetMarker, latitude, longitude) {
    if (this.state.wrongSearch === false) {
      var startdate = new Date(this.state.startDate);
      var enddate = new Date(this.state.endDate);
      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }
      var sd = startdate.getUTCFullYear() +
      '-' + pad(startdate.getUTCMonth() + 1) +
      '-' + pad(startdate.getUTCDate()) +
      'T' + pad(startdate.getUTCHours()) +
      ':' + pad(startdate.getUTCMinutes()) +
      ':' + pad(startdate.getUTCSeconds()) +
      'Z';
      var ed = enddate.getUTCFullYear() +
      '-' + pad(enddate.getUTCMonth() + 1) +
      '-' + pad(enddate.getUTCDate()) +
      'T' + pad(enddate.getUTCHours()) +
      ':' + pad(enddate.getUTCMinutes()) +
      ':' + pad(enddate.getUTCSeconds()) +
      'Z';
      console.log("Request:", "Now get date data array from",
       sd,
        'to', enddate.toISOString());
      var datelink = 'https://api.covid19api.com/country/' + country + '?from='+sd+'&to='+ed;
      console.log('datelink', datelink);
      this.getApiData(datelink,isSetMarker,latitude,longitude);
    } else {
      console.log('response json', 'wrongsearch')
    }
  }

  getApiData = (link,isSetMarker, latitude, longitude) => {
    console.log('Start to get data from covid-19 api');
    fetch(link, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      return response.json();
    }).then(data => {
      console.log("data", data);
      return data;
    }).then(json => {
      if (json === undefined) {
        console.log('request go error')
      } else {
        this.setState({
          data1: [],
        });
      for (var i in json) {
        if (json[i].Confirmed != 0 || json[i].Deaths != 0 || json[i].Recovered != 0 || json[i].Active != 0) {
          this.setState({
              data1: [
                ...this.state.data1,
                {
                Country: json[i].Country,
                CountryCode: json[i].CountryCode,
                Province: json[i].Province,
                City: json[i].City,
                CityCode: json[i].CityCode,
                Lat: json[i].Lat,
                Lon: json[i].Lon,
                Confirmed: json[i].Confirmed,
                Deaths: json[i].Deaths,
                Recovered: json[i].Recovered,
                Active: json[i].Active,
                Date: json[i].Date,
              }],
          });
        //console.log('index ',i,'\n data1 ', this.state.data1[i])
      }
    }
      isSetMarker && this.setMarker(latitude, longitude);
  }
    }).catch((error) => {
      console.error(error);
    })
  };


  getGlobalData() {
    fetch('https://api.covid19api.com/summary', {
        method: 'GET',
        headers: {
          Accept: 'application/json,  text/plain, */*',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json();
      }).then(data => {
        console.log('global',data.Global);
        return data.Global;
      }).then(json => {
        console.log("global", json.NewConfirmed);
        this.setState({
            globalData1: [{
              NewConfirmed: json.NewConfirmed,
              TotalConfirmed: json.TotalConfirmed,
              NewDeaths: json.NewDeaths,
              TotalDeaths: json.TotalDeaths,
              NewRecovered: json.NewRecovered,
              TotalRecovered: json.TotalRecovered,
            }],
          
        });
        console.log('globalData', this.state.globalData)
      }).catch((error) => {
        console.error(error);
      })
  }

  
  _renderCarouselCountryItem({item, index}){
    return (
      <View style={{
        position: 'absolute',
        bottom: 5,
        backgroundColor:'white',
        borderRadius: 5,
        height: height * 0.3,
        width: width * 0.8,
        marginLeft: 25,
        marginRight: 25, }}>
        <Text style={{fontSize: 20}}>{item.Country}</Text>
        <Text>Date: {item.Date}</Text>
        <Text>Active: {item.Active}</Text>
        <Text>Confirmed: {item.Confirmed}</Text>
        <Text>Deaths: {item.Deaths}</Text>
        <Text>Recovered: {item.Recovered}</Text>
        <Text>TotalRecovered: {item.TotalRecovered}</Text>
        
      </View>
    )
  };

  _renderCarouselGlobalItem({item, index}){
    return (
      <View style={{
        backgroundColor:'white',
        borderRadius: 5,
        height: 150,
        marginLeft: 25,
        marginRight: 25, }}>
        <Text style={{fontSize: 20, backgroundColor: '#3F51B5',color: Colors.white}}>Summary</Text>
        <Text>NewConfirmed: {item.NewConfirmed}</Text>
        <Text>TotalConfirmed: {item.TotalConfirmed}</Text>
        <Text>NewDeaths: {item.NewDeaths}</Text>
        <Text>TotalDeaths: {item.TotalDeaths}</Text>
        <Text>NewRecovered: {item.NewRecovered}</Text>
        <Text>TotalRecovered: {item.TotalRecovered}</Text>
      </View>
    )
  };

  

  renderTabScreen() {
    switch (this.state.activeSegment) {
      case 'globalData':
        return <View style={styles.sumbody}>
          <Carousel
            layout={'default'}
            ref={(c) => { this._carousel = c; }}
            data={this.state.globalData1}
            renderItem={this._renderCarouselGlobalItem}
            sliderWidth={width}
            itemWidth={300}
          /> 
        </View>
        
      case 'countryData':
        return <View style={styles.body}>
          <View style={styles.header}>
            <Header transparent={true} searchBar rounded>
              <Item>
                <Input placeholder= {
                  this.state.wrongSearch ? 'Country not found!' : 'Country'
                  }
                  onChangeText={this.handleSearchChange}
                  value={this.state.mysearch}/>
                <Button onPress={this.getSearchKeyword}>
                  <Text style={{color: Colors.white}}>Search</Text></Button>
              </Item>
            </Header>
          </View>
          <View style={styles.cmbody}>
          <Map
            style={styles.map}
            location={this.state.region}
            handleMapPress={this.handleMapPress}
            markers={this.state.markers}
            onRegionChange= {this.onRegionChange}
          />
          <View style={styles.buttonContainer}>
            <Button active={this.state.activeSegment==='countryData'}
            onPress={() => {this.handleSegmentChange('countryData')}}
            style={styles.floatButton}>
              <Text>Country</Text>
            </Button>
            <Button active={this.state.activeSegment==='liveData'}
            onPress={() => {this.handleSegmentChange('liveData')}}
            style={styles.floatButton}>
              <Text>Live</Text>
            </Button>
            <Button active={this.state.activeSegment==='date'} 
            onPress={() => {this.handleSegmentChange('date')}}
            style={styles.floatButton}>
              <Text>Date</Text>
            </Button>
          </View>
          </View>
          {this.renderCarousel()}
        </View>
      case 'liveData':
        return <View style={styles.body}>
          <View style={styles.header}>
            <Header transparent={true} searchBar rounded>
              <Item>
                <Input placeholder= {
                  this.state.wrongSearch ? 'Country not found!' : 'Country'
                  }
                  onChangeText={this.handleSearchChange}
                  value={this.state.mysearch}/>
                <Button onPress={this.getSearchKeyword}>
                  <Text style={{color: Colors.white}}>Search</Text></Button>
              </Item>
            </Header>
          </View>
          <View style={styles.cmbody}>
          <Map
            style={styles.map}
            location={this.state.region}
            handleMapPress={this.handleMapPress}
            markers={this.state.markers}
            onRegionChange= {this.onRegionChange}
          />
          <View style={styles.buttonContainer}>
            <Button active={this.state.activeSegment==='countryData'}
            onPress={() => {this.handleSegmentChange('countryData')}}
            style={styles.floatButton}>
              <Text>Country</Text>
            </Button>
            <Button active={this.state.activeSegment==='liveData'}
            onPress={() => {this.handleSegmentChange('liveData')}}
            style={styles.floatButton}>
              <Text>Live</Text>
            </Button>
            <Button active={this.state.activeSegment==='date'} 
            onPress={() => {this.handleSegmentChange('date')}}
            style={styles.floatButton}>
              <Text>Date</Text>
            </Button>
          </View>
          </View>
          {this.renderCarousel()}
        </View>
      case 'date':
        return <View style={styles.body}>
          <View style={styles.datePicker}>
              <Item>
                <Text>StartDate  </Text>
                <View style={{ transform:[{ scale: 0.8,}],}}>
                <Datepicker
                  style={{width:250, height: 20}}
                  date={this.state.startDate}
                  minimumDate= {this.state.minDate}
                  maximumDate= {this.state.endDate}
                  mode="date"
                  onDateChange={(e) => {this.setState({startDate: new Date(e)})}}
                  />
                  </View>
              </Item>
              <Item>
                <Text>EndDate    </Text>
                {/* <DatePicker
                  style={{width:120, height:14}}
                  date={this.state.endDate}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate={this.state.startDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {this.setState({endDate: date})}}
                /> */}
                <View style={{ transform:[{ scale: 0.8,}],}}>
                <Datepicker
                  style={{width:250, height: 20}}
                  date={this.state.endDate}
                  minimumDate= {this.state.startDate}
                  maximumDate= {this.state.maxDate}
                  mode="date"
                  onDateChange={(e) => {this.setState({endDate: new Date(e)})}}
                  />
                  </View>
              </Item>
          </View>
          <View style={styles.mcbody}>
            <Map
              style={styles.map}
              location={this.state.region}
              handleMapPress={this.handleMapPress}
              markers={this.state.markers}
              onRegionChange= {this.onRegionChange}
            />
            <View style={styles.buttonContainer}>
            <Button active={this.state.activeSegment==='countryData'}
            onPress={() => {this.handleSegmentChange('countryData')}}
            style={styles.floatButton}>
              <Text>Country</Text>
            </Button>
            <Button active={this.state.activeSegment==='liveData'}
            onPress={() => {this.handleSegmentChange('liveData')}}
            style={styles.floatButton}>
              <Text>Live</Text>
            </Button>
            <Button active={this.state.activeSegment==='date'} 
            onPress={() => {this.handleSegmentChange('date')}}
            style={styles.floatButton}>
              <Text>Date</Text>
            </Button>
          </View>
          </View>
          {this.renderCarousel()}
      </View>
  }
};
  
  render() {
    
    return (
    <Container style={styles.container}>
      {this.renderTabScreen()}
       <Footer>
         <FooterTab>
           <Button first active={this.state.activeSegment==='globalData'} onPress={() => {this.handleSegmentChange('globalData')}}>
             <Text style={{color: Colors.white}}>TotalSum</Text>
           </Button>
           <Button active={this.state.activeSegment==='countryData'}
           onPress={() => {this.handleSegmentChange('countryData')}}>
             <Text style={{color: Colors.white}}>Country</Text>
           </Button>
         </FooterTab>
       </Footer>
       </Container>
    );
  }
    
   
  
}
const { width, height } = Dimensions.get('window'); 


const styles = StyleSheet.create({
  container: {
    flex:1
  },
  sumbody: {
    top: height * 0.3,
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex:1,
    backgroundColor: Colors.white,
  },
  datePicker: {
    marginLeft: 15,
    marginTop: 0,
    top: 15,
  },
  mcbody: {
    top: 30,
    height: height * 0.9,
  },
  cmbody: {
    top: 10,
    height: height * 0.9,
  },
  map: {
    flex: 1,
    width: width,
    
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.35,
    width: width,
    backgroundColor: 'transparent'
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  header: {
    top: 0,
    marginTop: 0,
    marginLeft: 0, 
  },
  buttonContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    width: 85,
    backgroundColor: 'transparent',
  },
  floatButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
 
});

export default App;
