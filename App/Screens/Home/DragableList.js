import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';



export default class MyTest extends React.Component {

  constructor(props) {
    super(props);

    console.log("========= dataSource Dragable =======", props.dataSource)
    this.state = {
      data: props.dataSource,
    };
  }

  render_item(item) {
    if (item) {
      let iamgeSource = require('../../images/user.png');
      if (item.user_image !== "") {
        iamgeSource = { uri: item.user_image }
      }
      return (
        
        <View
          style={styles.item}
          key={item.key}
        >
         <View>
            <Image source={iamgeSource} style={{
              width: 100,
              height: 100
            }} />
           </View>
          
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <DraggableGrid
          numColumns={4}
          renderItem={this.render_item}
          data={this.state.data}
          onDragRelease={(data) => {
            console.log("====== data =======", data);
            this.setState({ data });// need reset the props data sort after drag release
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

    justifyContent: 'center',
    alignItems: 'center',
  },
  item_text: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});