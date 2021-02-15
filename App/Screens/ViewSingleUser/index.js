//import liraries
import React, { Component, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  SafeAreaView,
  TouchableOpacity, Linking,
  TextInput,
  FlatList, Modal,
  Alert,
  PermissionsAndroid,
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
import Color from '../../Components/Colors'
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'ContactsBooks.db' });
import Toast from 'react-native-simple-toast';
import Contacts from 'react-native-contacts'






const Index = ({ navigation, route }) => {
  console.log("========== route", route);
  const { user_id, user_image, user_name, user_contact } = route.params.data

  const [UserId, setUserId] = useState('')
  const [userName, setuserName] = useState('')
  const [UserImage, setUserImage] = useState('')
  const [ismodalVisible, setismodalVisible] = useState(false)
  const [ContactArray, setContactArray] = useState([])
  const [Number, setNumber] = useState('')
  const [ExistingContactModal, setExistingContactModal] = useState(false)
  const [ShowAllCotactModal, setShowAllCotactModal] = useState(false)
  const [GetAllContact, setGetAllContact] = useState([])
  const [CallLogs, setCallLogs] = useState([])
  // const [OpenModal, setOpenModal] = useState(false)

  useEffect(() => {
    callHistoryTable()



    setUserId(user_id)

    setuserName(user_name)
    setUserImage(user_image)
   

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
    if(myContact.length!=5){
      myContact.push(Number)
    }
    else{
      alert('You have to add Only 5 Number At a time')
    }
   
    setContactArray(myContact)


  }

  
  const GetAllContacts = () => {
    if(Platform.OS==='ios'){
    Contacts.checkPermission().then(permission => {
       
        if (permission === 'undefined') {
            Contacts.requestPermission().then(permission => {
                console.log("========= Request Permission ======", permission);
            })
        }
        if (permission === 'authorized') {
            Contacts.getAll().then(contacts => {
                setGetAllContact(contacts);
                setShowAllCotactModal(true);
                console.log("======= Contacts =====",JSON.stringify(contacts))
              })
        }
        if (permission === 'denied') {
            console.log("========= No Request Permission ======", permission);
        }
    })
   
        
    }
    else if(Platform.OS==='android'){
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts',
              message: 'This app would like to Access your contacts.',

            }
          )
          .then(()=>{
              Contacts.getAll((err,contacts)=>{
                   if(err==='denied'){
                       //error
                   }
                   else{
                       setGetAllContact(contacts)
                       console.log('==========Contacts========= ',contacts);
                   }
              })

            })

    }
}

  const updateUser = () => {
    console.log(UserId, ContactArray)
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE MyContactBook set user_contact=?  where user_id=?',
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



const callHistoryTable=()=>{

  try {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='CallHistory'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS CallHistory', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CallHistory(user_Id INTEGER PRIMARY KEY AUTOINCREMENT, user_Name VARCHAR(20), user_Contact VARCHAR(20), user_Image VARCHAR(20), Date_Time  VARCHAR(20))',
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
      <Modal
        visible={ExistingContactModal}
        animationType ='slide'
        transparent={true}
        
      >
        <View style={styles.ExistingContactModalView}>
          <TouchableOpacity
            onPress={() => {
              setExistingContactModal(false), navigation.navigate('ChiledContacts', {
                linkdata: {
                  Id: UserId,
                  image: UserImage
                }
              })
            }}
            style={styles.Addbutton}
          >
            <Text style={styles.existingContactText}>Create New Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
             setExistingContactModal(false)
             setShowAllCotactModal(true)
              GetAllContacts()

          }}
            style={styles.Addbutton}>
            <Text style={styles.existingContactText}>Add Existing Contacts</Text>
          </TouchableOpacity>
        </View>
      </Modal>

        <Modal
                transparent={true}
                animationType='slide'
                visible={ShowAllCotactModal}>
                <SafeAreaView>
                    <View style={styles.conatctView}>
                        <View style={styles.headerView1}>
                            <TouchableOpacity onPress={() => setShowAllCotactModal(false)}>
                                <AntDesign name='close' size={25} />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Contacts</Text>

                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={GetAllContact}
                            style={styles.flatlistView}
                            renderItem={({ item }) => {
                                console.log("======= item ======",item);
                                return (
                                    <TouchableOpacity style={styles.contactView1} onPress={() =>{setShowAllCotactModal(false), navigation.navigate('ExistingChiledContacts',{data:{
                                        firstName:item.givenName,
                                        lastName:item.familyName,
                                         Contactnumber:item.phoneNumbers[0].number,
                                         linkdata: {
                                          Id: UserId,
                                          image: UserImage
                                        }

                                        }})}}>
                                        <Text style={styles.contactText}>{`${item.givenName} ${item.familyName}`}</Text>
                                        {item.phoneNumbers.map((phone) => (
                                            <Text style={[styles.contactText,{marginTop:responsiveHeight(1)}]}>{phone.number}</Text>
                                        ))}

                                    </TouchableOpacity>
                                )
                            }}
                            numColumns={1}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                </SafeAreaView>

            </Modal>


      <StatusBar backgroundColor='transparent' barStyle='light-content' translucent />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} />
        </TouchableOpacity>

        <Text style={styles.headerTEXT}>{userName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateUser',{
          data:{
            id:UserId,
            name:userName,
            userimage:UserImage,
            userContact:ContactArray

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
            <>
            <View key={index} style={styles.contctnumView}>

              <Text style={styles.numText}>{item}</Text>
              
              <TouchableOpacity onPress={() =>{ Linking.openURL(`tel:${item}`); callLogs(item) }}>
                <Feather
                  name="phone-forwarded" size={30} color={'#1def77'} />
              </TouchableOpacity>
            </View>
            {/* <View style={{height:responsiveHeight(10) }}/> */}
            </>
          )
        }}
      />
      
      <TouchableOpacity onPress={() => { setExistingContactModal(true) }
      } style={styles.linkedButton}>
        <Text style={{ color: '#FFFFFF', fontSize: responsiveFontSize(2), fontWeight: '600' }}>Create Linked Contact</Text>
      </TouchableOpacity>


      <View style={styles.ModalView}>
        <Modal 
        visible={ismodalVisible}
        animationType='slide'
        transparent={true}
        >
          <View style={styles.cardView}>
            <TouchableOpacity style={{ width:'90%',marginBottom:responsiveHeight(5) }} onPress={()=>setismodalVisible(false)} >
              <AntDesign name='close' size={20}/>
            </TouchableOpacity>
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
    marginTop:responsiveHeight(30),
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
    marginTop: responsiveHeight(85),
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
    marginTop:responsiveHeight(30),
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
  contactView1:{
    marginTop:responsiveHeight(2),
    width:responsiveWidth(80),
    margin:responsiveWidth(1),
    borderBottomWidth:1,
    padding:responsiveWidth(2)
},
  conatctView: {
    width: responsiveWidth(95),
    height: responsiveHeight(90),
    borderRadius: responsiveWidth(5),
    alignSelf: 'center',
     backgroundColor: Color.White,
  },
  headerView1: {
    width: responsiveWidth(80),
    flexDirection: 'row',
    alignItems: 'center',
    
    alignSelf: 'center',
    marginTop: responsiveHeight(2)
  },
  headerText:{
    fontSize:responsiveFontSize(2.5),
    marginLeft:responsiveWidth(3)

},
contactText:{
  fontSize:responsiveFontSize(2.5),
  fontWeight:'500'
}
});

export default Index;
