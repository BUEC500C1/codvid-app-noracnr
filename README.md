# codvid-app-noracnr
Build React Naive mobile app to display 
1. CODVID cases per country on a MAP
2. CODVID cases per country Live on a MAP (changes)
3. CODVID cases per country based on a date.
4. 

### [Final Result](/step5)
* Warning: need to wait a few seconds for loading data to carousel. 
* How to run
  ```bash
  cd step5/covidApp
  npm install
  npx react-native run-android
  ```
##### Summary of total cases for the world

<img src="/step5/img/step5.gif" width=300 />

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

#### STEP2: <a href="https://reactnative.dev/docs/tutorial">Go through REACT native Tutorial</a>[done]
* Build Hello Applications
  ```bash
  npx react-native init Hello
  ```
* Run Hello applications on emulator and your phone.
1. Using a physical device
  * My phone is OnePlus 7 Pro (Android Version: 10, Hydrogen OS 10.0.4.GM21,Processor:Snapdragon 855, Storage:6GB RAM + 128GB ROM)
  * connect my phone to mac 
  * enable 'Developer' Options on OnePlus
  * Run this on terminal of mac
    ```bash
    cd Hello
    npx react-native start
    ```
  * Open another terminal, run:
    ```bash
    npx react-native run-android
    ```

2. Using a virtual device
  * On Android Studio (Pixel 3a API 28）, open Hello project, then open emulator,
  * Run this on terminal of mac
    ```bash
    cd Hello
    npx react-native start
    ```
  * Open another terminal, run:
    ```bash
    npx react-native run-android
    ```
* Result:

  temporary screenshot:
  
   <img src="/img/Screenshot_Hello.png" width=300 />

#### STEP3: Develop use case to display a map.  (<a href="https://github.com/react-native-community/react-native-maps">GitHub location</a>)[done]
* Intallation in Hello :
  ```bash
  npm install react-native-maps --save-exact
  ```
* Build configuration on Android
  on Hello/android/build.gradle, build configuration properties like that:
  ```build.gradle
  buildscript {...}
  allprojects {...}

  ext {
      buildToolsVersion = "28.0.3"
        minSdkVersion = 16
        compileSdkVersion = 28
        targetSdkVersion = 28
        supportLibVersion = "28.0.3"
        playServiceVersion = "19.1.0"
        androidMapsUtilsVersion = "xxx"
  }
  ```
* Result:

  code: [Hello](https://github.com/BUEC500C1/codvid-app-noracnr/tree/master/Hello)

  result:
  
  <img src="/img/Screenshot_map.png" width=300 />
#### STEP4: On separate branch[covid-api](https://github.com/BUEC500C1/codvid-app-noracnr/tree/covid-api), exercise the <a href="https://covid19api.com/"> CODVID-19 API </a> and display the data in your application as text.  Be fancy!  Style your results.[done]

* Check in [covid-api](https://github.com/BUEC500C1/codvid-app-noracnr/tree/covid-api) branch.

#### STEP5: Overlay the data on the maps.[done]
* Check in [step5](/step5) package.


### Requirements
https://docs.google.com/presentation/d/1R1i_fc9uAcSylbZ0uu6gma8cF5VG0DXqznYduvO1VCQ/edit#slide=id.g729a8d16a3_0_37
