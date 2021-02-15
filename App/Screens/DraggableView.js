//import liraries
import React, { Component,useState } from 'react';
import { View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import GridView from 'react-native-draggable-gridview'
// create a component
const DraggableView = () => {
    const [data, setData] = useState(['1', '2', '3', '4', '5', '6'])



    return (
        <GridView
        data={data}
        numColumns={3}
        renderItem={(item) => (
            <View style={{ flex: 1, margin: 1, justifyContent: 'center', backgroundColor: 'gray' }}>
            <Text style={{ textAlign: 'center' }}>{item}</Text>
            </View>
        )}
        onReleaseCell={(items) => setData(items)}
    />
    );
};

export default DraggableView;
