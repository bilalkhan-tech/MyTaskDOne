//import liraries
import React, { Component,useState,useEffect,useCallback } from 'react';
import { View, Text,Linking,TouchableOpacity ,Image,FlatList,SafeAreaView,TextInput,StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native'
import  Color  from "../../Components/Colors";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from "react-native-vector-icons/AntDesign";
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'ContactsBooks.db'});
const Index = ({navigation}) => {

const [dataSource, setdataSource] = useState([])
const [SearchingData, setSearchingData] = useState([])
const [isSearcingText, setisSearcingText] = useState('')
const [isSearching, setisSearching] = useState(false)


useFocusEffect(useCallback(() => {
  GetContact()
}, []))



GetContact = async () => {
  
  await db.transaction(async function (tx) {
    tx.executeSql(
      'Select * from MyContactBook',
      [],
      (tx, results) => {
        let mydata = [];
        if (results.rows.length > 0) {
          console.log('results.rows: ' + JSON.stringify(results.rows));
          for (let i = 0; i < results.rows.length; i++) {
            mydata.push(results.rows.item(i));
          }
         // alert(JSON.stringify(mydata))
          console.log("===== Fetch data =====",JSON.stringify(mydata))
          setdataSource(mydata);
         // console.log(datasource)
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





   const onSubmitedEdit= async ()=>{
      
          await db.transaction(async function (tx) {
            tx.executeSql(
              'Select * from MyContactBook where user_name=?',
              [isSearcingText],
              (tx, results) => {
                let mydata = [];
                if (results.rows.length > 0) {
                  console.log('results.rows: ' + JSON.stringify(results.rows));
                  for (let i = 0; i < results.rows.length; i++) {
                    mydata.push(results.rows.item(i));
                  }
                 // alert(JSON.stringify(mydata))
                 setisSearching(true)
                  console.log(JSON.stringify(mydata))
                  setSearchingData(mydata);
                } else {
                  return console.log('Data not Found')
                 
                }
              },
              (err) => {
                // alert(err);
                console.log('error: ' + JSON.stringify(err));
                return false;
              },
            );
          });
       
      }


    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
     <Text style={styles.searchText}> Search </Text>
   </View>
   <View style={styles.searchView}>
     <TouchableOpacity onPress={()=>onSubmitedEdit()}>

     <AntDesign name='search1' color={Colors.grey} size={25}/>
     </TouchableOpacity>
   
     <TextInput
     placeholder='Search Contacts'
     
     autoCorrect={false}
     onChangeText={(text)=>setisSearcingText(text)}
     onSubmitEditing={()=>onSubmitedEdit}
     style={styles.TextInput}
     />

   </View>


   {isSearching?



<View style={styles.footerView}>
<FlatList
showsVerticalScrollIndicator={false}
data={SearchingData}
keyExtractor={item=>item.user_id.toString()}
ListEmptyComponent={()=>{
  return <View>
    <Text>Data Not Found</Text>
  </View>
}}
renderItem={({item,index})=>{
 return(
   <TouchableOpacity 
   onLongPress={()=>navigation.navigate('FamilyWindow',{data:item})}
   onPress={()=>navigation.navigate('ViewSingleUser',{data:item})}
  // onPress={()=>Linking.openURL(`tel:${item.user_contact}`)}
   key={index} style={styles.searchButton}>
     <Image
     resizeMode='cover'
     source={item.user_image?{uri:item.user_image}:
     require('../../images/user.png')
   }
     style={styles.userImage}
     />
     <Text style={styles.nameText}>{item.user_name}</Text>

   </TouchableOpacity>
 )
}}

/>
</View>:

<View style={styles.footerView}>
<FlatList
showsVerticalScrollIndicator={false}
data={dataSource}
keyExtractor={item=>item.user_id.toString()}
renderItem={({item,index})=>{
 return(
   <TouchableOpacity 
   onLongPress={()=>navigation.navigate('FamilyWindow',{data:item})}
   onPress={()=>navigation.navigate('ViewSingleUser',{data:item})}
   //onPress={()=>Linking.openURL(`tel:${item.user_contact}`)}
   key={index} style={styles.searchButton}>
     <Image
     resizeMode='cover'
     source={item.user_image?{uri:item.user_image}:
     require('../../images/user.png')
   }
     style={styles.userImage}
     />
     <Text style={styles.nameText}>{item.user_name}</Text>

   </TouchableOpacity>
 )
}}

/>
</View>
}
   </SafeAreaView>
  
    );
};


const styles = StyleSheet.create({
  container:{
    flex:1,
    alignSelf: 'center',
    backgroundColor:Color.White
  },
  headerView:{
    width:responsiveWidth(100),
    height:responsiveHeight(5),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  searchText:{
    fontSize:responsiveFontSize(2),
    marginTop:responsiveHeight(2),
    fontWeight:'500'
  },
  searchView:{
    alignSelf: 'center',
    width:responsiveWidth(90),
    height:responsiveHeight(6),
    borderRadius:responsiveWidth(2),
    flexDirection: 'row',
    marginTop:responsiveHeight(3),
    overflow:'hidden',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  backgroundColor: '#fff',
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 1,
},
shadowOpacity: 0.20,
shadowRadius: 1.41,

elevation: 2,
  },
  TextInput:{
    width:responsiveWidth(70)
  },
  footerView:{
    alignSelf: 'center',
    width:responsiveWidth(100),

    marginTop: responsiveHeight(3),
  },
  searchButton:{
    width:responsiveWidth(95),
    padding:responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: .3,
  },
  userImage:{
    width:responsiveWidth(20),
    height:responsiveWidth(20), 
    marginLeft: responsiveWidth(3),
  },
  nameText:{
    marginLeft:responsiveWidth(2),
    fontSize:responsiveFontSize(2),
    fontWeight:'500'

  }
});

//make this component available to the app
export default Index;
