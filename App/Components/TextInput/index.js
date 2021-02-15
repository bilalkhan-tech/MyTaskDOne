//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,TextInput } from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
// create a component
const Index = (props) => {
    return (
       <TextInput
       placeholder={props.placeholder}
       onChangeText={()=>props.onChangeText}
       keyboardType={props.keyboardType}
      
       onSubmitEditing={props.onSubmitedEdit}
       style={styles.InputStyles}

       />
    );
};
const styles=StyleSheet.create({
  
})

export default Index;
