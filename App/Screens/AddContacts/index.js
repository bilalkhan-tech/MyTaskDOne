//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import Color from "../../Components/Colors"
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Contacts from 'react-native-contacts'
// create a component
const Index = ({ navigation }) => {
    const [OpenModal, setOpenModal] = useState(false)
    const [GetAllContact, setGetAllContact] = useState([])


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
                    setOpenModal(true);
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

    return (

        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType='slide'
                visible={OpenModal}>
                <SafeAreaView>
                    <View style={styles.conatctView}>
                        <View style={styles.headerView}>
                            <TouchableOpacity onPress={() => setOpenModal(false)}>
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
                                    <TouchableOpacity style={styles.contactView} onPress={() =>{setOpenModal(false), navigation.navigate('AddExistinguser',{data:{
                                        firstName:item.givenName,
                                        lastName:item.familyName,
                                         Contactnumber:item.phoneNumbers[0].number
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name='arrowleft' size={25} />
            </TouchableOpacity>
            <View style={styles.AddView}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Adduser')}
                    style={styles.Addbutton}
                >
                    <Text style={styles.existingContactText}>Add New Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { GetAllContacts() }}
                    style={styles.Addbutton}>
                    <Text style={styles.existingContactText}>Add Existing Contacts</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.White,
    },
    AddView: {
        marginTop: responsiveHeight(10),
        width: responsiveWidth(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: responsiveFontSize(2.5),
        marginLeft: responsiveWidth(3)

    },
    Addbutton: {
        marginVertical: responsiveHeight(1),
        borderRadius: responsiveWidth(2),
        width: responsiveWidth(90),
        height: responsiveHeight(6),
        borderWidth: .3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    existingContactText: {
        color: Color.iconeColor,
        fontSize: responsiveFontSize(2)
    },
    backButton: {
        marginTop: responsiveHeight(5),
        marginLeft: responsiveWidth(5),

    },
    conatctView: {
        width: responsiveWidth(90),
        height: responsiveHeight(90),
        borderRadius: responsiveWidth(5),
        alignSelf: 'center',

        backgroundColor: Color.White,
    },
    headerView: {
        width: responsiveWidth(80),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: responsiveHeight(2)
    },
    flatlistView: {
        alignSelf: 'center',
        marginTop:responsiveHeight(1)
    },
    contactView:{
        marginTop:responsiveHeight(2),
        width:responsiveWidth(80),
        margin:responsiveWidth(1),
        borderBottomWidth:1,
        padding:responsiveWidth(2)
    },
    contactText:{
        fontSize:responsiveFontSize(2),
        fontWeight:'500'
    }
});

//make this component available to the app
export default Index;
