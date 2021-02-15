//import liraries
import React, { Component,useState,useEffect } from 'react';
import { View, Text,Image, Alert,TouchableOpacity,Linking, StyleSheet,FlatList,SafeAreaView, InteractionManager } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import Color from "../../Components/Colors";
import CallLogs from 'react-native-call-log';
import Swipeout from 'react-native-swipeout';
import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'ContactsBooks.db' });

// create a component
const Index = () => {
    const [CallLogsData, setCallLogsData] = useState([])
useEffect(() => {
   GetCallLogs()
}, [])

const GetCallLogs= async()=>{

    try {
        await db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM CallHistory',
              [],
              (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; i++)
                  temp.push(results.rows.item(i));
                  setCallLogsData(temp);
                 // console.log('=========logs data ========',JSON.stringify(CallLogsData) )
              }
            );
          });
    
    } catch (error) {
        console.log('========error========',error)
        
    }
 
}

const deleteUser = async (id) => {
    await db.transaction((tx) => {
        tx.executeSql(
            'DELETE FROM CallHistory where user_id=?',
            [id],
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    GetCallLogs()
                    Toast.showWithGravity(
                        'CallLog Successfully Deleted',
                        Toast.SHORT,
                        Toast.BOTTOM,

                    )

                } else {
                    alert('Please insert a valid User Id');
                }
            }
        );
    });
};




    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.headerView} >
            <Text style={styles.HeaderText}>Recent Calls</Text>
            <FlatList
            showsVerticalScrollIndicator={false}
            data={CallLogsData}
            renderItem={({item,index})=>{

                //let Time=JSON.parse(item.Date_Time)
                const swipeoutBtns = [
                    {

                        backgroundColor: 'green',
                        text: 'Call',
                        onPress: () => { Linking.openURL(`tel:${item.user_Contact}`) }
                    },
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
                                onPress: () => { deleteUser(item.user_Id) }
                            },


                            { cancelable: false }
                        ])
                    }

                ]
                console.log('=========item data=========',item)
                
                return(
                    <Swipeout right={swipeoutBtns} style={{ backgroundColor:Color.White }}>
                    <TouchableOpacity key={index} style={styles.ButtonView}>
                        <View style={styles.parentView}>
                        <Image 
                        resizeMode='cover'
                        style={styles.image}
                        source={item.user_Image? {uri:item.user_Image}:require('../../images/user.png')}
                        />
                        <View style={{ marginVertical:10 }}>
                        <Text>{item.user_Name}</Text>
                        <Text style={{ marginTop:10 }}>{item.user_Contact}</Text>
                        </View>
                        <View style={{width:'40%', }}>
                        <Text numberOfLines={2}>{item.Date_Time}</Text>
                        </View>
                       
                        </View>
                    </TouchableOpacity>
                    </Swipeout>
                )
            }}
            keyExtractor={(index)=>index.toString()}
            />




        </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Color.White
        
       
    },
    headerView:{
        width:responsiveWidth(100),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        

    },
    HeaderText:{
        fontSize:responsiveFontSize(3),
        fontWeight:'500',
        
    },
    image:{
        height:responsiveWidth(20),
        width:responsiveWidth(20),
        borderRadius:responsiveWidth(20/2)
    },
    parentView:{
        alignSelf: 'center',
        width:responsiveWidth(90),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding:5,
        marginTop:responsiveHeight(1)
    }
});

//make this component available to the app
export default Index;
