import React from 'react';
import { Icon, Input, Button } from 'react-native-elements';
import { Text, StatusBar, Alert, Keyboard, StyleSheet, View, ScrollView} from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("coursedb.db");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const {item} = this.props.navigation.state.params;
    id = item.id;
    this.state = {message: '', fontLoaded: false, id: id, nimi: item.nimi, kuvaus: item.kuvaus, ohjeet: item.ohjeet, ainesosat: item.ainesosat, vegipes: []};
  }

  keyExtractor = (item, id) => item+id


  // Tallenna resepti tietokantaan
  saveItem = () => {
    //Navigointi-muuttuja
    const {navigate} = this.props.navigation;
    Keyboard.dismiss();
    //Jos joku kentistä on tyhjä, virheilmoitus
    if(this.state.nimi == '' || this.state.kuvaus == '' || this.state.ohjeet == '' || this.state.ainesosat == '') {
      Alert.alert(
        'Ilmoitus',
        '\nTäytä puuttuvat tyhjät kentät!'
        )
      return;
    } else {
    db.transaction(tx => {
      //Lisää tietokantaan ja päivitä taulukko
        tx.executeSql(`update vegipes set nimi ="`+ this.state.nimi +`", kuvaus ="`+ this.state.kuvaus+ `", ohjeet =`+ JSON.stringify(this.state.ohjeet).replace(/(?:\\r)?\\n/g, '\n') +`, ainesosat =`+ JSON.stringify(this.state.ainesosat).replace(/(?:\\r)?\\n/g, '\n') +` where id = ?`, [id]); 
        //Ilmoitus onnistuneesta reseptin lisäyksestä ja ohjaus listaan
        Alert.alert('Resepti muokattu!')
        navigate('Home', {vegipes: this.state.vegipes})
      }, error => {
        this.setState({message: error});
        console.log(this.state.message)
     }); null, this.updateList
    }
    
  }
  //puput on kivoja ja mahu
  //Näppäimistön piilotus muualle painettaessa
  handleUnhandledTouches(){
    Keyboard.dismiss();
    return false;
  }

  //Formin tulostus
  render() {
    const {navigate} = this.props.navigation;
    const {item} = this.props.navigation.state.params;
    id = item.id;

    return (
      <View style={styles.container} onStartShouldSetResponder={this.handleUnhandledTouches}>
        <StatusBar
        barStyle='light-content'/>
        <ScrollView bounces={false} keyboardShouldPersistTaps="never" style={{width:370, marginLeft:40, flex: 1}}>
          <Button color="#fff" buttonStyle={{backgroundColor:'#3333B0', width:330, marginTop:20, marginLeft:0, marginBottom:2, height:45, borderRadius:50}} 
            icon={{name:'arrow-back', size: 20, color: 'white'}} onPress={() => navigate('Home')} title="TAKAISIN RESEPTILISTAAN"/>
            <Input label={'Reseptin nimi'} multiline blurOnSubmit returnKeyType='done' placeholder='Nimi' containerStyle={{ marginTop:20, marginBottom: 0, width: 330, borderBottomColor: 'lightgray'}}
                inputStyle={{marginTop:-1, fontSize:16, height:60,maxHeight:40, width: 330, color: '#000'}} onChangeText={(nimi) => this.setState({nimi})}
                underlineColorAndroid="transparent" 
                value={this.state.nimi}/>
            <Input label={'Kuvaus'} multiline blurOnSubmit returnKeyType='done' placeholder='Kuvaus' containerStyle={{ marginBottom: 0, height:60, width: 330, borderBottomColor: 'lightgray'}}
                inputStyle={{marginTop:-1, fontSize:16, height:60,maxHeight:40, width: 330, color: '#000'}} onChangeText={(kuvaus) => this.setState({kuvaus})}
                underlineColorAndroid="transparent" 
                value={this.state.kuvaus}/>
            <Input label={'Ainesosat'} multiline placeholder='Ainesosat' containerStyle={{ marginBottom: 0, height:100, width: 330,borderColor: 'lightgray'}}
                inputStyle={{maxHeight:80, marginTop:0, marginLeft:3, marginRight:3, fontSize:16, height:100, width: 330, color: '#000'}} onChangeText={(ainesosat) => this.setState({ainesosat})}
                numberOfLines={4} underlineColorAndroid="transparent" 
                value={this.state.ainesosat}/> 
            <Input label={'Valmistusohjeet'} multiline placeholder='Valmistusohjeet' containerStyle={{ marginBottom: 0, height:160, width: 330, borderColor: 'lightgray'}}
                inputStyle={{maxHeight: 140, marginTop:-1, marginLeft:3, marginRight:3, fontSize:16, height:160, width: 330, color: '#000'}} onChangeText={(ohjeet) => this.setState({ohjeet})}
                underlineColorAndroid="transparent"
                value={this.state.ohjeet}/>
            <View style={{flexDirection:'row'}}>
              <Button buttonStyle={{backgroundColor: '#a6a6a6', width:140, marginLeft:5, marginTop:20, marginBottom:50, height:45, borderRadius:25}} 
              icon={
                <Icon
                  name="add-a-photo"
                  size={16}
                  color="white"
                />
              } iconRight onPress={() => Alert.alert('Ilmoitus','\nLISÄÄ KUVA-toiminto on\ntulossa tulevaisuudessa!')} title="LISÄÄ KUVA"/>
              <Button buttonStyle={{backgroundColor: '#009933', width:170, marginLeft:8, marginTop:20, marginBottom:20, height:45, borderRadius:25}} 
              icon={
                <Icon
                  name="save"
                  size={16}
                  color="white"
                />
              } iconRight onPress={this.saveItem} title="TALLENNA "/>
            </View>
          <View style={{flex: 1, height: 170}}/>
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