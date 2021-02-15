import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import Color from "../../Components/Colors";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

import DragableListComponent from './DragableList';
import { openDatabase } from 'react-native-sqlite-storage';
import converter from 'number-to-words';
const db = openDatabase({ name: 'ContactsBooks.db' });
const Index = ({ navigation }) => {
    const [dataSource, setdataSource] = useState([])
    const [modalVisible, setmodalVisible] = useState(false)
    const [visible, setvisible] = useState(false)
    const [ImagesSizes, setImagesSizes] = useState('large')
    




    const ImageSizeObj = {
        small: {
            width: responsiveWidth(20),
            height: responsiveWidth(25),
            numColumns: 4

        },
        large: {
            width: responsiveWidth(45),
            height: responsiveWidth(45),
            numColumns: 2
        },
        medium: {
            width: responsiveWidth(30),
            height: responsiveWidth(30),
            numColumns: 3

        }
    }



    useEffect(() => {
        GetContact()
    }, [])


    render_item = (item, index) => {
        return (
            <View style={{backgroundColor:Color.white }} >
                <TouchableOpacity key={index}
                    onLongPress={() => navigation.navigate('FamilyWindow', { data: item.item })}
                    onPress={() => navigation.navigate('ViewSingleUser', { data: item.item })}
                    style={[styles.Imagebutton, { width: ImagesSizes.width, height: ImagesSizes.height }]}>
                    {visible ?
                        <View style={styles.iconeView2}>
                            <TouchableOpacity onPress={() => Alert.alert('Alert', 'Are you sure you want to delete?',
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    { text: "OK", onPress: () => deleteUser(item.item.user_id) }
                                ],
                                { cancelable: false }
                            )}>
                                <MaterialCommunityIcons name='delete-empty' size={30} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                               
                            </View>

                        </View>
                        : null}

                    <Image source={item.item.user_image !== "" ? { uri: item.item.user_image } : require('../../images/user.png')} style={{
                        width: ImageSizeObj[ImagesSizes].width,
                        height: ImageSizeObj[ImagesSizes].height
                    }} />

                </TouchableOpacity>
            </View>

        );
    }





    GetContact = async () => {

        await db.transaction(async function (tx) {
            tx.executeSql(
                'Select * from MyContactBook',
                [],
                (tx, results) => {
                    let mydata = [];
                    if (results.rows.length > 0) {
                        for (let i = 0; i < results.rows.length; i++) {
                            console.log(results.rows.item(i))
                            if (results.rows.item(i)) {
                                let item = results.rows.item(i);
                                item.key = converter.toWords(i);
                                mydata.push(item);
                            }
                        }
                        // console.log("======My dat ====",JSON.stringify(mydata))
                        console.log("======= mydata ======", mydata);
                        setdataSource([...mydata])
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

    const deleteUser = async (id) => {
        await db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM  MyContactBook where user_id=?',
                [id],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        GetContact()
                        Toast.showWithGravity(
                            'Contact Successfully Deleted',
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


    console.log(ImagesSizes)


    const renderFlatList = (data) => {
        if (ImagesSizes) {
            return <FlatList
            key={ImagesSizes}
                showsVerticalScrollIndicator={false}

                numColumns={data.numColumns}
                style={styles.flatlist}

                data={dataSource}
                keyExtractor={item => item.user_id.toString()}
                renderItem={render_item}
            />
        }
    }

    return (


        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}

            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setImagesSizes('large')
                                setmodalVisible(false)

                            }}
                        >
                            <Text style={styles.textStyle}>Large</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setImagesSizes('small')
                                setmodalVisible(false)
                            }}
                        // height: 70, width: 70, columns: 4, modalVisible: false 
                        >
                            <Text style={styles.textStyle}>Small</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalView}>

                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setImagesSizes('medium')
                                setmodalVisible(false)
                            }}
                        >
                            <Text style={styles.textStyle}>Medium</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.headerView}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddContacts')}
                >
                    <AntDesign name="plus" size={25} color={Color.iconeColor} />
                </TouchableOpacity>

                <Text style={styles.headerTEXT}>Photo Dialer</Text>
                <View style={styles.iconView}>
                    <TouchableOpacity onPress={() => setvisible(!visible)}>
                        <Feather name="edit" size={25} color={Color.iconeColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setmodalVisible(true)}>

                        <Ionicons name="settings-sharp" size={25} color={Color.iconeColor} />
                    </TouchableOpacity>
                </View>

            </View>

            {renderFlatList(ImageSizeObj[ImagesSizes])}



        </View>

    );
};


const styles = StyleSheet.create({
   
    container: {
        flex: 1,
       
        backgroundColor: Color.White
    },
    headerView: {
        width: responsiveWidth(90),
        alignSelf: 'center',
        marginTop: responsiveHeight(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    flatlist: {
        marginTop: responsiveHeight(3),
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        width: responsiveWidth(90),
        
        

    },

    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: responsiveWidth(80),
        height: responsiveHeight(30),
        marginTop: responsiveHeight(40),
        borderRadius: responsiveWidth(2),
        backgroundColor: '#eee',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    iconView: {
        width: responsiveWidth(15),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    headerTEXT: {
        fontSize: responsiveFontSize(2),
        fontWeight: '500'
    },


    iconeView2: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
        flexDirection: 'row',


    },
    openButton: {
        width: responsiveWidth(70),
        height: responsiveHeight(6),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: responsiveHeight(1)
    },
    textStyle: {
        fontSize: responsiveFontSize(2),
        color: Color.white,
        fontWeight: '600'
    },
    Imagebutton: {
        
        padding:responsiveWidth(1),
        
        
    },
    item: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default Index;

