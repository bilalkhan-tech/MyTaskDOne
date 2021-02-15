//import liraries
import React, { Component, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, StatusBar, SafeAreaView, Image } from 'react-native';
import Color from "../../Components/Colors";
import AntDesign from 'react-native-vector-icons/AntDesign'
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
var RNFS = require('react-native-fs');

import ImagePicker from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import Toast from 'react-native-simple-toast';
const options = {
  title: 'Select Photo',
  TakePhotoButton: 'Take Photo From Camera',
  ChoosePhotoFromLibrary: 'Choose Photo From Library',
};

const db = openDatabase({ name: 'ContactsBooks.db' });
const Index = ({ navigation ,route}) => {
const{firstName,lastName,Contactnumber}=route.params.data




  const [Username, setUsername] = useState(firstName+' '+lastName)
  const [userimage, setuserimage] = useState('')
  const [userContact, setuserContact] = useState(Contactnumber)
  const [mobileNum, setmobileNum] = useState([])
  const [showImage, setshowImage] = useState('')
  useFocusEffect(useCallback(() => {
    createTable()
  }, []))


  _takingPhoto = () => {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //let newfile = response.uri
        let name = response.uri.split("/")
        console.log('==========image path========', name[name.length - 1])
        setshowImage(response.uri)
        let path= RNFS.DocumentDirectoryPath + "/PhotoDialor/" + name[name.length - 1]
        console.log("Image Path"+path)
        setuserimage(path)

        RNFS.copyFile(response.uri,path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
          .then((result) => {
            console.log('File copied',result)


            // stat the first file
          })


      }
    });
  };



  const createTable = () => {
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='MyContactBook'",
          [],
          function (tx, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              var path = RNFS.DocumentDirectoryPath + '/PhotoDialor/';
              RNFS.mkdir(path)
                .then(async (success) => {
                  console.log('DIR Created!');
                })
                .catch((err) => {
                  console.log(err.message);
                });
              txn.executeSql('DROP TABLE IF EXISTS MyContactBook', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS MyContactBook(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact VARCHAR(20), user_image  VARCHAR(20))',
                [],
                () => alert('Created new table'),
                () => errorCB(),
              );
            }
          },
        );
      });
    } catch (error) {
      alert(error);
    }

  }

  const SaveData =  () => {
    try {
      console.log("======== A ==========",db);
       db.transaction(function (tx) {
         console.log("======== tx =====", Username, userContact, userimage)
        tx.executeSql(
          'INSERT INTO MyContactBook(user_name, user_contact, user_image) VALUES (?,?,?)',
          [Username, userContact, userimage],
          (tx, results) => {
            console.log("========== b =======",JSON.stringify(results));
            if (results.rowsAffected > 0) {
              Toast.showWithGravity(
                'Contact Successfully added',
                Toast.SHORT,
                Toast.BOTTOM,
              ),
                navigation.navigate('home')
              console.log('No of sections inserted :' + JSON.stringify(results.rowsAffected));
            } else {

              Toast.showWithGravity(
                'Contact not added',
                Toast.SHORT,
                Toast.BOTTOM,
              );
              console.log('Zero sections inserted');
            }

          },
          (err) => {
            console.log('error: ' + JSON.stringify(err));
            return false;
          },
        );
      });
    } catch (error) {
      console.log('========error=========',error)
      
    }
   
  }







  return (



    <View style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='light-content' translucent />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={25} />
        </TouchableOpacity>

      </View>

      <View style={styles.imageView}>
        <Image
          resizeMode='cover'
          style={styles.imageLogo}
          source={showImage ? { uri: showImage } :

            require('../../images/user.png')
          }
        />
        <TouchableOpacity onPress={() => _takingPhoto()} style={styles.browseImage}>
          <Text style={styles.buttonText}>Browse Image</Text>
        </TouchableOpacity>

      </View>
      <Text style={styles.contactText}>Contact Information</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder='Enter Name'
          value={firstName+' '+lastName}
          autoCorrect={false}
         

        />



        <TextInput
          style={styles.textInput}
          placeholder='Enter Number'
          keyboardType='number-pad'
          value={Contactnumber}
          

        />

      </View>
      <TouchableOpacity
        onPress={() => SaveData()} style={[styles.browseImage, { alignSelf: 'center', marginTop: responsiveHeight(15), width: responsiveWidth(70) }]}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>



  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  headerView: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginTop: responsiveHeight(5)
  },
  imageView: {
    marginTop: responsiveHeight(5),
    alignSelf: 'center',
    width: responsiveWidth(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  imageLogo: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(2),
  },
  browseImage: {
    width: responsiveWidth(40),
    height: responsiveHeight(5),
    backgroundColor: '#2c80b9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: '700'
  },
  contactText: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
    marginVertical: responsiveHeight(4),
  },
  textInput: {
    height: responsiveHeight(5),
    alignSelf: 'center',

    borderBottomWidth: .5,
    width: responsiveWidth(80),
    marginVertical: responsiveHeight(1),
    paddingLeft: responsiveWidth(5),

  },
  inputView: {
    width: responsiveWidth(80),
    height: responsiveHeight(10),
    justifyContent: 'center',
    borderRadius: responsiveWidth(2),
    alignSelf: 'center',
    marginVertical: responsiveHeight(1),


  }
});


export default Index;
