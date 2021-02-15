import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';


export default class MyTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: '1', key: 'one' },
        { name: '2', key: 'two' },
        { name: '3', key: 'three' },
        { name: '4', key: 'four' },
        { name: '5', key: 'five' },
        { name: '6', key: 'six' },
        { name: '7', key: 'seven' },
        { name: '8', key: 'eight' },
        { name: '9', key: 'night' },
        { name: '0', key: 'zero' },
      ],
      buttonClicked:"",
    };
  }

  render_item(item) {
    return (
      <View
        style={styles.item}
        key={item.key}
      >
        <Text style={styles.item_text}>{item.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <DraggableGrid
          numColumns={4}
          renderItem={this.render_item}
          onItemPress={() => alert('Hello')}
          data={this.state.data}
        
          onDragStart={()=>
            Alert.alert(
              "Choose",
              "My Alert Msg",
              [
                
                {
                  text: "Move",
                  onPress: () => this.setState({buttonClicked:"Move"})
                },
                { 
                  text: "Family", 
                  onPress: () => this.setState({buttonClicked:"Family"})
                }
              ],
              { cancelable: false}
            )

    
          }
          onDragRelease={(data) => {
            this.setState({ data })


          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 100,
    backgroundColor: 'blue',
  },
  wrapper: {
    paddingTop: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  item: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});