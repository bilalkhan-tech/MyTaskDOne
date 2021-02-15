//import liraries
import React, { Component, useState,useEffect,useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Alert, Linking, Image } from 'react-native';
import Color from "../../Components/Colors";
import {useFocusEffect} from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const db = openDatabase({ name: 'ContactsBooks.db' });
import { openDatabase } from 'react-native-sqlite-storage';
import Swipeout from 'react-native-swipeout';




// create a component
const Index = ({navigation,route}) => {
    
    const {user_id,user_image,user_name,user_contact}=route.params.data
      console.log("============ user_contact =======",user_contact);
    const [UserId, setUserId] = useState(user_id)
    const [userName, setuserName] = useState(user_name)
    const [UserImage, setUserImage] = useState(user_image)
    const [userContact, setuserContact] = useState('')
    const [DataSource, setDataSource] = useState([])
    
    useEffect(() => {
        GetContact()
        //setuserContact(user_contact)
    }, [])


  


     const UpdateUser=(data)=>{
        navigation.navigate('UpdatedChiled',{Mydata:{data,UserImage}})

     }

   
   const  DeleteUserRef=async(id)=>{
    await db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM  FamilyWindow where user_id=?',
            [id],
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    Toast.showWithGravity(
                        'Contact Successfully Deleted',
                        Toast.SHORT,
                        Toast.BOTTOM,

                    )

                      GetContact()

                } else {
                    Toast.showWithGravity(
                        'Contact Already Deleted',
                        Toast.SHORT,
                        Toast.BOTTOM,

                    )

                }
            }
        );
    });

    }





          GetContact = async () => {
           
             await db.transaction(async function (tx) {
                tx.executeSql(
                    'Select * from FamilyWindow where pid=?',
                    [UserId],
                    (tx, results) => {
                        let mydata = [];
                        if (results.rows.length > 0) {
                            console.log('results.rows: ' + JSON.stringify(results.rows));
                            for (let i = 0; i < results.rows.length; i++) {
                                mydata.push(results.rows.item(i));
                            } 
                            setDataSource(mydata)
                            console.log(JSON.stringify(DataSource))
                           
                        } else {
                            console.log('Zero sections inserted');
                        }
                    },
                    (err) => {
                        // alert(err);
                        console.log('error: ' + JSON.stringify(err));
                        return false;
                    },
                );
            });
          };


    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name='arrowleft' size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.mainView}>
                <Image
                    resizeMode='cover'
                    style={styles.userImage}
                    source={UserImage?{uri:UserImage}:require('../../images/user.png')}
                />
                <Text style={styles.userText}>{userName}</Text>

            </View>
            <View style={styles.informationView}>
                <Text style={styles.nameText}>Contact</Text>
                <Text style={styles.nameText}>Relation</Text>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={DataSource}
                style={styles.FlatListView}
                renderItem={(Item, index) => {
                    let item = Item.item;
                    console.log("======== item =======",item);
                    const swipeoutBtns = [
                       
                        {

                            type: 'delete',
                            text: 'Delete',
                            onPress: () => Alert.alert('Alert', 'Are you Sure you want to Delete ?', [
                                {
                                    text: 'No',
                                    onPress: () => { console.log('User cancel Action') }
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => { DeleteUserRef(item.user_id) }
                                },


                                { cancelable: false }
                            ])
                        }

                    ]
                  


                    return (
                       <Swipeout right={swipeoutBtns} style={{backgroundColor:Color.White }}>
                        <TouchableOpacity onPress={()=>navigation.navigate('SingleChiledInfo',{data:item})} key={index} style={styles.parentView}>

                            <Image
                                resizeMode='cover'
                                source={item.user_image?{ uri: item.user_image }:require('../../images/user.png')} style={styles.userImagecChiled} />
                            <Text style={styles.nameText}>{item.user_name}</Text>
                            <Text style={styles.nameText}>{item.user_relation}</Text>
                           
                            <View style={{ height: responsiveHeight(10) }} />

                        </TouchableOpacity>
                        </Swipeout>
                       
                    )
                }}
            />
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
        marginTop: responsiveHeight(5),
        justifyContent: 'center',

        alignSelf: 'center',


    },
    mainView: {
        width: responsiveWidth(90),
        alignSelf: 'center',
        marginTop: responsiveHeight(5),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    userImage: {
        width: responsiveWidth(30),
        height: responsiveWidth(30),
        borderRadius: responsiveWidth(30 / 2)
    },
    userText: {
        fontSize: responsiveFontSize(2),
        fontWeight: '500',
        right: responsiveWidth(20)
    },
    informationView: {
        alignSelf: 'center',
        width: responsiveWidth(70),
        marginTop: responsiveHeight(3),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

    },
    FlatListView: {
        marginTop: responsiveHeight(3),
        width: responsiveWidth(90),
        alignSelf: 'center',

    },
    parentView: {
        width: responsiveWidth(90),
        justifyContent: 'space-between',
        alignItems: 'center',
        
        flexDirection: 'row',
    },
    userImagecChiled: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius:responsiveWidth(20/2)
       
    },
    nameText: {
        fontSize: responsiveFontSize(2),
        fontWeight: '600',
        
    }
});


export default Index;
