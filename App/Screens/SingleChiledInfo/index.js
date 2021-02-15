//import liraries
import React, { Component, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity, Linking,
  TextInput,
  FlatList, Alert,
  StatusBar
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import Color from '../../Components/Colors'
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'ContactsBooks.db' });
import Toast from 'react-native-simple-toast';
import Swipeout from 'react-native-swipeout';
import { Colors } from 'react-native/Libraries/NewAppScreen';




const Index = ({ navigation, route }) => {
  console.log("========== route", route);
  const { user_id, user_image, user_name, user_contact,user_relation } = route.params.data

  const [UserId, setUserId] = useState(user_id)
  const [userName, setuserName] = useState(user_name)
  const [UserImage, setUserImage] = useState(user_image)
  const [ismodalVisible, setismodalVisible] = useState(false)
  const [userRelation, setuserRelation] = useState(user_relation)
  const [ContactArray, setContactArray] = useState([])
  const [Number, setNumber] = useState('')
  const [ExistingContactModal, setExistingContactModal] = useState(false)
  const [indexx, setindex] = useState('')
  const [ShowAllCotactModal, setShowAllCotactModal] = useState(false)
  const [contacts, setContacts] = useState([])


useEffect(() => {
  console.log("======= user_contact =======", user_contact);
  let firstContact = [];
  if (user_contact.endsWith("[", 1)) {
    firstContact = JSON.parse(user_contact)
  } else {
    firstContact = [user_contact]
  }
  console.log("=========firstContact", firstContact);
  if (Array.isArray(firstContact)) {
    setContactArray([...firstContact])
  } else {
    setContactArray([firstContact])
  }
}, [])



  const addContact = () => {
    let myContact = ContactArray
    myContact.push(Number)
    setContactArray(myContact)


  }

  


  const updateUser = () => {
    console.log(UserId, ContactArray)
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE FamilyWindow set user_contact=?  where user_id=?',
        [JSON.stringify(ContactArray), UserId],
        (tx, results) => {
          console.log('Results', results);
          if (results.rowsAffected > 0) {
            Toast.showWithGravity('Contact Updated Successfully', Toast.SHORT, Toast.BOTTOM)

          } else alert('Updation Failed');
        }
      );
    });
  };
  const callLogs=(item)=>{
    console.log('=========item data=======',item)
    let date=new Date().toString();
   // console.log('=========date=======',userName,item,UserImage,date)
    // console.log('=========date=======',db)
   try {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO CallHistory(user_Name,user_Contact,user_Image,Date_Time) VALUES (?,?,?,?)',
        [userName, item, UserImage,date],
        (tx, results) => {
          console.log("========= tx",tx, results);
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
           console.log('=========results========',results)
          } else alert('Registration Failed');
        }
      );
    });
     
   } catch (error) {
     console.log('=======error=======',error)
     
   }
   
   
  }

  return (

    <View style={styles.container}>
     
      <StatusBar backgroundColor='transparent' barStyle='light-content' translucent />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} />
        </TouchableOpacity>

        <Text style={styles.headerTEXT}>{userName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UpdatedChiled',{
          data:{
            id:UserId,
            name:userName,
            userimage:UserImage,
            usercontact:ContactArray,
            userRelations:userRelation
          }
        })}>
          <Feather name="edit" size={25} color={Color.iconeColor} />
        </TouchableOpacity>

      </View>

      <Image
        resizeMode="cover"
        style={styles.imageLogo}
        source={UserImage ? { uri: UserImage } : require('../../images/user.png')} />
      <Text style={styles.nameText}>{userName}</Text>
      <View style={styles.contactView}>
        <Text style={styles.contatnumbertext}>Contact Numbers</Text>
        <TouchableOpacity onPress={() => setismodalVisible(!ismodalVisible)}>
          <AntDesign name="plus" size={30} color={Color.iconeColor} />
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={ContactArray}
        style={styles.contactFlatlist}
        keyExtractor={item => item}
        renderItem={({ item, index }) => {
          return (
           
            <View key={index} style={styles.contctnumView}>

              <Text style={styles.numText}>{item}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${item}`),callLogs(item)}>
                <Feather
                  name="phone-forwarded" size={30} color={'#1def77'} />
              </TouchableOpacity>
            </View>
          )
        }}
      />
    


      <View style={styles.ModalView}>
        <Modal isVisible={ismodalVisible}>
          <View style={styles.cardView}>
            <TextInput
              style={styles.TextInputmodal}
              keyboardType='number-pad'
              placeholder='Enter Conatct Number'
              onChangeText={text => setNumber(text)}
            />
            <TouchableOpacity onPress={() => addContact()} style={[styles.modalButton, { backgroundColor: '#1def77', }]}>
              <Text style={styles.Buttontext}>ADD Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              updateUser(),
                setismodalVisible(false)
            }} style={[styles.modalButton, { backgroundColor: '#2c80b9', }]}>
              <Text style={styles.Buttontext}>DONE</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      
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

    height: responsiveHeight(5),
    alignSelf: 'center',
    marginTop: responsiveHeight(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTEXT: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '500',
    textAlign: 'center',

  },
  imageLogo: {
    alignSelf: 'center',
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    marginTop: responsiveHeight(4),
    borderRadius: responsiveWidth(40 / 2),
  },
  nameText: {
    fontSize: responsiveFontSize(3),
    alignSelf: 'center',
    marginTop: responsiveHeight(2),
  },
  contatnumbertext: {
    fontSize: responsiveFontSize(2.5),
  },
  contactView: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addtext: {
    fontSize: responsiveFontSize(2),
    color: '#2c80b9',
  },
  contactView2: {
    alignSelf: 'center',
    width: responsiveWidth(90),
    marginTop: responsiveHeight(3),
    padding: responsiveWidth(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ModalView: {
    //backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Addview: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(2),
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
    width: responsiveWidth(80),
    height: responsiveHeight(40),
    borderRadius: responsiveWidth(2)

  },
  contactFlatlist: {
    marginTop: responsiveHeight(2),
    backgroundColor: Color.White,


  },
  linkedButton: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: Color.buttonBackgroundColor,
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(80),
    width: responsiveWidth(60),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  TextInputmodal: {
    width: '90%',
    height: '20%',
    marginBottom: responsiveHeight(2),
    borderBottomWidth: .3,
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
  Buttontext: {
    fontSize: responsiveFontSize(2),
    color: Color.White
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
  ExistingContactModalView: {
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
    width: responsiveWidth(80),
    height: responsiveHeight(30),
    borderRadius: responsiveWidth(2)

  },
  Addbutton: {
    marginVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(70),
    height: responsiveHeight(6),
    borderWidth: .3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  existingContactText: {
    color: Color.iconeColor,
    fontSize: responsiveFontSize(2)
  },
  conatctView: {
    width: responsiveWidth(90),
    height: responsiveHeight(60),
    borderRadius: responsiveWidth(5),
    alignSelf: 'center',
    backgroundColor: 'red'

    //backgroundColor: Color.White,
  },
  headerView1: {
    width: responsiveWidth(80),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: responsiveHeight(2)
  },
  headerText:{
    fontSize:responsiveFontSize(2.5),
    marginLeft:responsiveWidth(3)

},
});

export default Index;
