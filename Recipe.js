import React from 'react';
import { Icon, Button} from 'react-native-elements';
import { StatusBar, Alert, StyleSheet, View, ScrollView, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("coursedb.db");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: '', fontLoaded: false, id: '', fav: '', nimi: '', kuvaus: '', ohjeet: '', ainesosat: '', vegipes: []};
  }

  // Tallentaa reseptin suosikkeihin
  favoriteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`update vegipes set fav = 1 where id = ?;`, [id]);
      }, null, this.updateList
    )    
  }
  //Formin tulostus ja tietojen haku propseissa
  render() {
    const {navigate} = this.props.navigation;
    const {item} = this.props.navigation.state.params;
    id = item.id;
    return (
      <View style={styles.container}>
      <StatusBar
      barStyle='light-content'/>
      
      <View style={{backgroundColor: "lightgray", height:180, width:370, justifyContent:'center'}}><Icon name='image' size={50}/></View>
      <ScrollView data={item.vegipes} bounces={false} style={{width:370, marginLeft:30, flex: 1}}>
      <View style={{flexDirection:'row'}}>
      <Button color="#fff" buttonStyle={{backgroundColor:'#009933', width:110, marginTop:20, marginLeft:0, marginBottom:0, height:45, borderBottomStartRadius:50, borderTopStartRadius:50}} 
      icon={
        <Icon
          name="arrow-back"
          size={20}
          color="white"
        />
      } onPress={() => navigate('Home')} title="TAKAISIN"/>
      <Button color="#fff" buttonStyle={{backgroundColor:'darkorange', width:115, marginTop:20, paddingLeft:10, marginLeft:0, height:45}} 
      icon={
        <Icon
          name="favorite"
          size={20}
          color="white"
        />
      } iconRight  title="SUOSIKKI" onPress={() => {this.favoriteItem(id), Alert.alert(item.nimi+'\non lisätty suosikkeihin!')}}/>
      <Button color="#fff" buttonStyle={{backgroundColor:'#3333B0', width:115, marginTop:20, marginLeft:0, paddingLeft:20, height:45, borderTopEndRadius:50, borderBottomEndRadius:50}} 
      icon={
        <Icon
          name="edit"
          size={20}
          color="white"
        />
      } iconRight title="MUOKKAA" onPress={() => {navigate('Edit', {item: item})}}/>
      </View>
      <Text style={{fontSize: 16, color:"gray", fontWeight:"bold",marginLeft:20, marginTop:15}}>{item.nimi}</Text>
      <Text style={{color:"gray", fontWeight:"normal", width:320, fontSize: 16, marginLeft: 20}}>{item.kuvaus}</Text>
      <Text style={{fontSize: 16, color:"gray", fontWeight:"bold",marginLeft:20, marginTop:15}}>Ainesosat</Text>
      <Text style={{color:"gray", fontWeight:"normal", width:320, fontSize: 16, marginLeft: 20}}>{item.ainesosat}</Text>
      <Text style={{fontSize: 16, color:"gray", fontWeight:"bold",marginLeft:20, marginTop:15}}>Valmistusohjeet</Text>
      <Text style={{color:"gray", fontWeight:"normal", width:320, fontSize: 16, marginLeft: 20, marginBottom:30}}>{item.ohjeet}</Text>
      </ScrollView>
      </View>
    );
  }

  //Navigaatiopalkin tyylimääritykset
   static navigationOptions = {
    headerTitle: "Vegipes",
    title: "Add",
    headerLeft: null,
    gesturesEnabled: false,
    headerTintColor: '#fff',
    tabBarOptions: {
      headerTintColor:'#009933',
    },
    headerStyle: {
       backgroundColor: '#009933',
       width:375,
       height:75,
       borderBottomWidth:0,
      },
    headerTitleStyle: {
      fontSize:42,
      fontStyle: 'italic',
      fontFamily: 'Snell Roundhand',
    }
  }

}

//Tyylitykset
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
});