//import liraries
import React, { Component,useState,useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    StatusBar
} from 'react-native';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useFocusEffect } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { openDatabase } from 'react-native-sqlite-storage';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
const options = {
    title: 'Select Photo',
    TakePhotoButton: 'Take Photo From Camera',
    ChoosePhotoFromLibrary: 'Choose Photo From Library',
};
const db = openDatabase({ name: 'ContactsBooks.db' });
console.disableYellowBox = true
var RNFS = require('react-native-fs');

import Color from '../../Components/Colors';
// create a component


const Index=({navigation,route})=>{
const [ParentId, setParentId] = useState('')
const [ParentImage, setParentImage] = useState('')
const [chiledImage, setchiledImage] = useState('')
const [chiledName, setchiledName] = useState('')
const [ChiledContact, setChiledContact] = useState('')
const [chiledRelation, setchiledRelation] = useState('')


useEffect(useCallback(()=>{
    createTable()
    
const Id=route.params.linkdata.Id
const image=route.params.linkdata.image
setParentId(Id)

setParentImage(image)



},[]))

const createTable=()=>{
    try {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='FamilyWindow'",
          [],
          function (tx, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS FamilyWindow', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS FamilyWindow(user_id INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, user_name VARCHAR(20), user_contact VARCHAR(20),user_relation VARCHAR(20), user_image  VARCHAR(20))',
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
           

        SaveDAta=async()=>{
            await db.transaction(async function (tx) {
              tx.executeSql(
                'INSERT INTO FamilyWindow(user_name, user_contact, user_relation,pid, user_image) VALUES (?,?,?,?,?)',
                [chiledName, ChiledContact, chiledRelation,ParentId,chiledImage],
                (tx, results) => {
                  console.log(JSON.stringify(results));
                 
                  if (results.rowsAffected > 0) {
                    Toast.showWithGravity(
                      ' Contact  Successfully added',
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
               }


_takingPhoto = () => {

    
    ImagePicker.showImagePicker(options, (response) => {
     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
       let newfile=response.uri
        console.log("========== response =======",response);

        setchiledImage(response.uri)
        let name =response.uri
        let path= RNFS.DocumentDirectoryPath + "/PhotoDialor/" + name[name.length - 1]
        setchiledImage(path)

        RNFS.copyFile(response.uri,path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
          .then((result) => {
            console.log(result)


            // stat the first file
          })
      
      }
    });
  }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='transparent' barStyle='light-content' translucent />
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} />
                </TouchableOpacity>

                <Image
                    resizeMode='cover'
                    style={styles.userImage}
                    source={ParentImage ? { uri:ParentImage } : require('../../images/user.png')}
                />
            </View>


            <View style={styles.imageView}>
                <Image
                    resizeMode='cover'
                    style={styles.imageLogo}
                    source={chiledImage ? { uri: chiledImage } :

                        require('../../images/user.png')}
                />
                <TouchableOpacity onPress={() => _takingPhoto()} style={styles.browseImage}>
                    <Text style={styles.buttonText}>Browse Image</Text>
                </TouchableOpacity>

            </View>

            <Text style={styles.contactText}>Contact Information</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder='Enter Name'
                    autoCorrect={false}
                    onChangeText={(text) => setchiledName(text)}

                />

            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    keyboardType='number-pad'
                    placeholder='Mobile Number'
                    onChangeText={(text) => setChiledContact(text)}

                />

            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    autoCorrect={false}
                    placeholder='Enter Relation'
                    onChangeText={(text) => setchiledRelation( text)}

                />

            </View>


            <TouchableOpacity onPress={() => SaveDAta()} style={[styles.browseImage, { alignSelf: 'center', marginTop: responsiveHeight(5),width:responsiveWidth(70) }]}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>





        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.White,
    },
    headerView: {
        marginLeft: responsiveWidth(2),
        marginTop: responsiveHeight(5),
        width: responsiveWidth(30),
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
        backgroundColor: Color.buttonBackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: responsiveWidth(2),
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize:responsiveFontSize(2),
        fontWeight:'700'
    },
    contactText: {
        alignSelf: 'center',
        fontSize: responsiveFontSize(2.5),
        marginVertical: responsiveHeight(4),
    },
    TextInput: {
        height: responsiveHeight(5),
        alignSelf: 'center',
        width: responsiveWidth(70)
    },
    inputView: {
        borderRadius: responsiveWidth(2),
        marginVertical: responsiveHeight(1),
        padding: responsiveWidth(2)
    },
    imageView: {
        alignSelf: 'center',
        width: responsiveWidth(90),
        flexDirection: 'row',
        marginTop: responsiveHeight(5),
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    userImage: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(10 / 2)
    }
});

//make this component available to the app
export default Index;
