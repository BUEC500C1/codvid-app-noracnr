# codvid-app-noracnr
Build React Naive mobile app to display 
1. CODVID cases per country on a MAP
2. CODVID cases per country Live on a MAP (changes)
3. CODVID cases per country based on a date.
4. Summary of total cases for the world
5. Live Summary for the World

Stretch goal:
* Display data per Province
* User can put their address and track CODVID-19 in their neighborhood (Only in countries where regional data is provided)


## Sprints
#### STEP1: <a href="https://reactnative.dev/docs/environment-setup">Setup your REACT Native Environment</a>[done]
use React Native CLI on MAC OS, build for Android.
* download dependencies
  ```bash
  brew install node
  brew install watchman
  brew cask install adoptopenjdk/openjdk/adoptopenjdk8
  ```
* download Android Studio and SDK (Android 9)
* Configure the ANDROID_HOME environment variable in ~./zshrc

#### STEP2: <a href="https://reactnative.dev/docs/tutorial">Go through REACT native Tutorial</a>
* Build Hello Applications
  ```bash
  npx react-native init Hello
  ```
* Run Hello applications on emulator and your phone.
1. Using a physical device
My phone is OnePlus 7 Pro (Android Version: 10, Hydrogen OS 10.0.4.GM21,Processor:Snapdragon 855, Storage:6GB RAM + 128GB ROM)
2. Using a virtual device
On Android Studio (Pixel 3a API 28）
* Result:

  code: [Hello](https://github.com/BUEC500C1/codvid-app-noracnr/tree/master/Hello)

  image:
  
   <img src="/img/Screenshot_Hello.png" width=300 />

#### STEP3: Develop use case to display a map.  (<a href="https://github.com/react-native-community/react-native-maps">GitHub location</a>)
#### STEP4: On separate branch, exercise the <a href="https://covid19api.com/"> CODVID-19 API </a> and display the data in your application as text.  Be fancy!  Style your results.
#### STEP5: Overlay the data on the maps.


### Requirements
https://docs.google.com/presentation/d/1R1i_fc9uAcSylbZ0uu6gma8cF5VG0DXqznYduvO1VCQ/edit#slide=id.g729a8d16a3_0_37
