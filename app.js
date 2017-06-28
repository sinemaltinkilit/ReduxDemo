import React from 'react';
import { connect } from 'react-redux';
import { addPerson, deletePerson } from './actions';

import { applyMiddleware, createStore } from "redux";
//import logger from "redux-logger"

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  AppState, AsyncStorage,
  DeviceEventEmitter,
  Alert
} from 'react-native';

import { getTagId, readTag, writeTag } from 'nfc-react-native'

let items = [];
class App extends React.Component {
  state = {
    inputValue: '',
    surnameValue: 'cdcdd',
    ageValue: 8,
  }

   componentWillMount() {
    console.log('will mount');
     this.getLastQueries();
   }

   componentDidMount() {
    //AsyncStorage.setItem('lastCard',"");
    DeviceEventEmitter.addListener('onTagError', function (e) {
        console.log('error', e)
        Alert.alert(JSON.stringify(e))
    })

    DeviceEventEmitter.addListener('onTagDetected', function (e) {
        Alert.alert(JSON.stringify(e))
    })

    DeviceEventEmitter.addListener('onTagRead', (e) => {
        console.log('reading', e)
        Alert.alert(JSON.stringify(e))
    })

    DeviceEventEmitter.addListener('onTagWrite', (e) => {
        console.log('writing', e)
        Alert.alert(JSON.stringify(e))
    })
  }

  getLastQueries() { 
        items = [];  
        AsyncStorage.getItem('lastCard').then((lastC) => {
            console.log('last c: '+lastC);
            if (lastC != null) {
                var parsedArray = JSON.parse(lastC);
                console.log('parsed array: '+JSON.stringify(parsedArray));
                
                for(var i=0;i<parsedArray.length;i++){
                    items.push(parsedArray[i]);
                }              
                console.log('items: '+items.length);
                console.log('items: '+JSON.stringify(items));
                //var filtedArr = Array.from(new Set(items));
                //console.log('async lastCard ', filtedArr);
            
                items.map((person, index) => (
                  <View key={index} style={styles.person}>
                    
                    <Text>cardNo: {person.cardNo}</Text>
                    <Text onPress={() => this.deletePerson(person)}>Delete Person</Text>
                  </View>
                ))
            }else{
                console.log('last card lastC storage null');
            }
        });
  }

  readTagData() {
    readTag([
      { sector: 1, blocks: [1,2], clave: 'FFFFFFFFFFFF', keyType: 'A' },
      { sector: 2, blocks: [0,1,2], clave: 'FFFFFFFFFFFF', keyType: 'A' },
      { sector: 3, blocks: [0], clave: 'FFFFFFFFFFFF', keyType: 'A' }
    ])
    console.log('get id: ');
  }

  addPerson = () => {
    //getTagId();
    this.readTagData();
    if (this.state.inputValue === '') return;
    /*
    this.props.dispatchAddPerson({
      name: this.state.inputValue,
      surname: this.state.surnameValue,
      age: this.state.ageValue,
    });
    */
    this.setState({ inputValue: '' });
    let arr = this.props.people;
    console.log('arr length: ', items.length);

    let storingValue = JSON.stringify(this.props.people);
    console.log('storingValue ', this.props.people);
  //  for(var i=0;i<items.length;i++){
    //  this.props.dispatchAddPerson({
        //cardNo: storingValue
    //    items
    //  });       
  //  }

  //  console.log('storingValue json stringify  ', items);
    items.push({cardNo: this.state.inputValue});
    /*
    this.props.dispatchAddPerson({
          cardNo: this.state.inputValue
        });
        */
  //  console.log('storingValue json stringify 2**  ', items);
    AsyncStorage.setItem('lastCard',JSON.stringify(items));
    //var filtedArr = Array.from(new Set(items));
    //console.log('async lastCard ', filtedArr);
    //console.log(' lastCard no ', items[0].cardNo);



    //this.setState({ inputValue:  inputValue});

  }
  deletePerson = (person) => {
    this.props.dispatchdeletePerson(person);
    console.log('person ',person);
    var index = items.indexOf(person);
    console.log(index);
    items.splice(index,1);
    console.log('items index ', items);
    AsyncStorage.setItem('lastCard',JSON.stringify(items));
  }

  updateInput = (inputValue) => {
    this.setState({ inputValue })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>People</Text>
        <TextInput
          onChangeText={text => this.updateInput(text)}
          style={styles.input}
          value={this.state.inputValue}
          placeholder="Name"
        />
        <TouchableHighlight
          underlayColor="#ffa012"
          style={styles.button}
          onPress={this.addPerson}
        >
          <Text style={styles.buttonText}>Add Person</Text>
        </TouchableHighlight>
        {
          items.map((person, index) => (
            <View key={index} style={styles.person}>
              
              <Text>cardNo: {person.cardNo}</Text>
              <Text onPress={() => this.deletePerson(person)}>Delete Person</Text>
            </View>
          ))
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#e4e4e4',
    height: 55,
    borderRadius: 3,
    padding: 5,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#ff9900',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
  },
  person: {
    marginTop: 12,
  },
});

function mapStateToProps (state) {
  return {
    people: state.people.people
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchAddPerson: (person) => dispatch(addPerson(person)),
    dispatchdeletePerson: (person) => dispatch(deletePerson(person))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
