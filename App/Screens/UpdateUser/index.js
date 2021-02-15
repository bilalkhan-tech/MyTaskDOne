//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Modal, TextInput, FlatList, Alert, StatusBar } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
const db = openDatabase({ name: 'ContactsBooks.db' })
import Color from '../../Components/Colors'
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Swipeout from 'react-native-swipeout';
const options = {
  title: 'Select Photo',
  TakePhotoButton: 'Take Photo From Camera',
  ChoosePhotoFromLibrary: 'Choose Photo From Library',
};
var RNFS = require('react-native-fs');
const Index = ({ navigation, route }) => {

  const [UserIdP, setUserIdP] = useState('')
  const [UserImageP, setUserImageP] = useState('')
  const [userimage, setuserimage] = useState('')
  const [ContactArray, setContactArray] = useState([])
  const [UpdatedNumModal, setUpdatedNumModal] = useState(false)
  const [UpdatedNum, setUpdatedNum] = useState('')
  const [userUpdatedName, setuserUpdatedName] = useState('')
  const [indexx, setindex] = useState('')
  const [showImage, setshowImage] = useState('')



  useEffect(() => {

    const {id,name,userimage,userContact}=route.params.data
      setUserIdP(id),
      setuserUpdatedName(name),
      setUserImageP(userimage),
      setContactArray(userContact)
     

   
   
  }, [])


 const UpdateUser=async()=>{
  await db.transaction((tx) => {
    tx.executeSql(
      'UPDATE MyContactBook set user_name=?, user_image=? where user_id=?',
      [userUpdatedName,userimage, UserIdP],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
         
          Toast.showWithGravity('Update Successfully', Toast.SHORT, Toast.BOTTOM)
          navigation.goBack()
        
        } else alert('Updation Failed');
      }
    );
  });
};



  const addContact1 = () => {
    console.log(ContactArray, UpdatedNum)


    let myContact = ContactArray
    myContact[indexx] = UpdatedNum
    setContactArray(myContact)

  }

  const updateUser = () => {
   // console.log(UserId, ContactArray)
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE MyContactBook set user_contact=?  where user_id=?',
        [JSON.stringify(ContactArray), UserIdP],
        (tx, results) => {
          console.log('Results', results);
          if (results.rowsAffected > 0) {
            Toast.showWithGravity('Contact Updated Successfully', Toast.SHORT, Toast.BOTTOM)

          } else alert('Updation Failed');
        }
      );
    });
  };


 const DeleteContactNum = async (id) => {
    let a = ContactArray.filter((i) => i != id)
    console.log(a)
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE MyContactBook set user_contact=?  where user_id=?',
        [JSON.stringify(a), UserIdP],
        (tx, results) => {
          //updateUser()
          console.log('Results', results);
          if (results.rowsAffected > 0) {
            Toast.showWithGravity('Contact Deleted Successfully', Toast.SHORT, Toast.BOTTOM)
           

          } else alert('Updation Failed');
        }
      );
    });
  }

   EditUserNum = (num, index) => {
    console.log(ContactArray, index)
    setUpdatedNum(num)
    setindex(index)
    setUpdatedNumModal(true)

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
        //let newfile = response.uri
        let name = response.uri.split("/")
        console.log('==========image path========', name[name.length - 1])
        setshowImage(response.uri)
        let path= RNFS.DocumentDirectoryPath + "/PhotoDialor/" + name[name.length - 1]
        console.log("Image Path"+path)
        setuserimage(path)

        RNFS.copyFile(response.uri,path) 
          .then((result) => {
            console.log('File copied',result)
          })


      }
    });
  };






  return (
    <View style={styles.container}>

     <Modal 
     animationType='slide'
     transparent={true}
     onRequestClose={()=>setUpdatedNumModal(false)}
     
     visible={UpdatedNumModal}>
        <View style={styles.cardView}>
          <TextInput
            style={styles.TextInputmodal}
            keyboardType='number-pad'
            value={UpdatedNum}
            placeholder='Enter Conatct Number'
            onChangeText={text => setUpdatedNum(text)}
          />
          <TouchableOpacity onPress={() => addContact1()} style={[styles.modalButton, { backgroundColor: '#1def77', }]}>
            <Text style={styles.Buttontext}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            updateUser(),
            setUpdatedNumModal(false)
          }} style={[styles.modalButton, { backgroundColor: '#2c80b9', }]}>
            <Text style={styles.Buttontext}>DONE</Text>
          </TouchableOpacity>


        </View>
      </Modal>



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
          source={UserImageP ? { uri: UserImageP } :
          showImage


            //  require('../../images/user.png')
          }
        />
        <TouchableOpacity onPress={() => _takingPhoto()} style={styles.browseImage}>
          <Text style={styles.buttonText}>Browse Image</Text>
        </TouchableOpacity>

      </View>
      <Text style={styles.contactText}>Update Information</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Enter Name'
          value={userUpdatedName}
          onChangeText={(username) => setuserUpdatedName(username)}

        />

      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={ContactArray}
        style={styles.contactFlatlist}
        keyExtractor={item => item}
        renderItem={({ item, index }) => {

          const swipeoutBtns = [
            {

              backgroundColor: 'green',
              text: 'Update',
              onPress: () => { EditUserNum(item, index) }
            },
            {

              type: 'delete',
              text: 'Delete',
              onPress: () => Alert.alert('Alert', 'Are you Sure you want to Delete ?', [
                {
                  text: 'No',
                  onPress: () => { console.log('User cancel Action')  }
                },
                {
                  text: 'Yes',
                  onPress: () => { DeleteContactNum(item) }
                },


                { cancelable: false }
              ])
            }

          ]

          return (
             <Swipeout right={swipeoutBtns} style={{ backgroundColor:Color.White }}>
            <View key={index} style={styles.contctnumView}>

              <Text style={styles.numText}>{item}</Text>
             
            </View>
            </Swipeout>
          )
        }}
      />

      <TouchableOpacity
        onPress={() => UpdateUser()} style={[styles.browseImage, { position: 'absolute', zIndex: 1, alignSelf: 'center', marginTop: responsiveHeight(85), width: responsiveWidth(70) }]}>
        <Text style={styles.buttonText}>Update Contact</Text>
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
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginTop: responsiveHeight(5),
    
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
    backgroundColor: Color.buttonBackgroundColor,
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
  TextInput: {
    height: responsiveHeight(5),
    alignSelf: 'center',
    borderBottomWidth:1,
    width: responsiveWidth(80)
  },
  inputView: {
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveHeight(1),
    padding: responsiveWidth(1)
  },
  contactFlatlist: {
    marginTop: responsiveHeight(2),
    backgroundColor: Color.White
  },
  contctnumView: {
    width: responsiveWidth(90),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
   
    marginVertical: responsiveHeight(2),
    justifyContent: 'space-between',
  },
  numText: {
    fontSize: responsiveFontSize(3)
  },
  TextInputmodal: {
    width: '90%',
    height: '20%',
    marginBottom: responsiveHeight(2),
    borderBottomWidth: .3,
  },
  cardView: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,

    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop:responsiveHeight(30),
    width: responsiveWidth(80),
    height: responsiveHeight(40),
    borderRadius: responsiveWidth(2)

  },
  modalButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    height: '15%',
    marginVertical: '2%',
    backgroundColor: 'red',
    borderRadius: responsiveWidth(2)
  },

});

//make this component available to the app
export default Index;
