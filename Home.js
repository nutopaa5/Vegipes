import React, { Component } from 'react';
import { Icon, ListItem, Button } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { StatusBar, Alert, StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import Swipeout from 'react-native-swipeout';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("coursedb.db");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: '', fontLoaded: false, id: '', nimi: '', kuvaus: '', ohjeet: '', ainesosat: '', vegipes: []};
    //Funktioiden bindaus
    this.renderRow = this.renderRow.bind(this);
    this.updateList = this.updateList.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  //Reseptin lisäyksen ja sivun ohjauksen jälkeinen listan päivitys
  componentWillReceiveProps() {
    this.updateList();
  }

  //Sivun ladatessa...
  componentDidMount() {
    this.updateList();
    // Luo taulukko tietokantaan, jos ei ole jo olemassa
    db.transaction(tx => {
      //tx.executeSql(`drop table vegipes;`);
      tx.executeSql(`create table if not exists vegipes (id integer primary key not null, fav integer, nimi text, kuvaus text, ohjeet varchar, ainesosat varchar);`);
    //Tietokannan virheilmoitus tarvittaessa konsoliin
    }, error => {
        this.setState({message: error});
        console.log(this.state.message)
    });
  }

  // Päivitä resepti-lista
  updateList = () => {
    db.transaction(tx => {
      tx.executeSql(`select * from vegipes`, [], (_, { rows }) =>
        this.setState({vegipes: rows._array})
      );
    });
  }

  // Tallentaa reseptin suosikkeihin
  favoriteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`update vegipes set fav = 1 where id = ?;`, [id]);
      }, null, this.updateList
    )    
  }

  // Poistaa reseptin listasta poistonappia painettaessa
  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from vegipes where id = ?;`, [id]);
      }, null, this.updateList
    )    
  }

  keyExtractor = (item, id) => item+id
  
  //Reseptilistan määrittelyt
  renderRow ({item, id}) {
    id = item.id;
    //Poisto- sekä suosikkinappi reseptiä oikealle pyyhkäisemällä + ilmoitukset / varmistus painettaessa
    let swipeBtns = [
      {
      data: item,
      component: (<View style={{flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
      <Icon name='favorite' color='#fff' size={28}/></View>),
      backgroundColor: 'darkorange',
      onPress: () => {this.favoriteItem(id), Alert.alert(item.nimi+'\non lisätty suosikkeihin!')}
      },
      {
        data: item,
        component: (<View style={{flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <Icon name='edit' color='#fff' size={28}/></View>),
        backgroundColor: '#3333B0',
        onPress: () => navigate('Edit', {item: item})
      },
      {
      data: item,
      component: (<View style={{flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
      <Icon name='delete' color='#fff' size={28}/></View>),
      backgroundColor: '#CD1414',
      onPress: () => {
        Alert.alert(
          'Ilmoitus',
          '\nHaluatko poistaa reseptin\n"'+item.nimi+'" ?',
          [
            {text: 'Peruuta', onPress: () => console.log('Poistaminen peruutettu'), style:'cancel'},
            {text: 'Poista', onPress: () => {this.deleteItem(id)}}
          ],
          { cancelable: true }
        );
      }
    }];

    //Navigointi-muuttuja
    const {navigate} = this.props.navigation;
    //Listaus (sisältäen Swipeout suosikki- ja poistonapin)
    return (
      <Swipeout right={swipeBtns}
      autoClose={true}
      backgroundColor='transparent'
      alwaysBounceVertical={false}
      alwaysBounceHorizontal={false}
      bounces={false}
      buttonWidth={50}
      close={true}>
      <ListItem
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        bounces={false}
        bottomDivider
        data={item}
        key={id}
        //Reseptiä painettaessa > navigointi reseptin tietosivulle tiedot mukana
        onPress={() => navigate('Recipe', {
            item: item
         })}
        keyExtractor={this.keyExtractor}
        leftIcon={<View style={{backgroundColor: "lightgray", marginLeft: -9, marginTop:-8, marginBottom: -8, height:65, width:65, justifyContent:'center'}}><Icon name='image'/></View>}
        title={<Text numberOfLines={1} style={{width:260, fontSize: 16, color:"gray", fontWeight:"bold", marginBottom:5, marginLeft:-5}}>{item.nimi}</Text>}
        subtitle={<Text numberOfLines={1} style={{width:260, maxWidth: 260, fontSize: 16, color:"gray", fontWeight:"normal", marginLeft:-5}}>{item.kuvaus}</Text>}
        avatar={<View><Text style={{fontSize: 15, color: 'gray', width:50}}></Text></View>}
      />
      </Swipeout>
    )
  }

  //Sivun tulostus + ehto jos reseptejä ei vielä ole, tulosta ilmoitusteksti
  render() {
    const {navigate} = this.props.navigation;
    if(this.state.vegipes == '') {
      return (
        <View style={styles.container}>
        <StatusBar
        barStyle='light-content'/>
          <View style={{flexDirection:'row'}}>
          <Button color="#fff" buttonStyle={{backgroundColor:'darkorange', width:130, marginTop:20, height:45, borderRadius:25}} 
          icon={
            <Icon
              name="favorite"
              size={20}
              color="white"
            />
          } iconRight onPress={() => navigate('Favorites', {data:this.state.vegipes})} title="SUOSIKIT"/>
          <Button color="#fff" buttonStyle={{backgroundColor:'#009933', width:200, marginLeft: 8, marginTop:20, height:45, borderRadius:25}} 
          icon={
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
            />
          } iconRight onPress={() => navigate('Add', {data:this.state.vegipes})} title="LISÄÄ UUSI RESEPTI"/>
          </View>
          <ScrollView alwaysBounceHorizontal={false} alwaysBounceVertical={false} bounces={false} style={{width:370, marginLeft:0, flex: 1}}>
          <View style={{marginTop:20, flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
          <Text style={{color:"gray", fontWeight:"normal", width:320, fontSize: 17, textAlign:'center'}}>Reseptejä ei vielä ole lisätty.{'\n'}Voit lisätä reseptejä yllä olevasta painikkeesta.</Text>
          </View>
          </ScrollView>
        </View>
      );
    } else {
    return (
      <View style={styles.container}>
      <StatusBar
      barStyle='light-content'/>
        <View style={{flexDirection:'row'}}>
        <Button color="#fff" buttonStyle={{backgroundColor:'darkorange', width:130, marginTop:20, height:45, borderRadius:25}} 
          icon={
            <Icon
              name="favorite"
              size={20}
              color="white"
            />
          } iconRight onPress={() => navigate('Favorites', {data:this.state.vegipes})} title="SUOSIKIT"/>
          <Button color="#fff" buttonStyle={{backgroundColor:'#009933', width:200, marginLeft: 8, marginTop:20, height:45, borderRadius:25}} 
          icon={
            <Icon
              name="arrow-forward"
              size={20}
              color="white"
            />
          } iconRight onPress={() => navigate('Add', {data:this.state.vegipes})} title="LISÄÄ UUSI RESEPTI"/>
        </View>
        <ScrollView alwaysBounceHorizontal={false} alwaysBounceVertical={false} bounces={false} bouncesZoom={false} style={{width:370, marginLeft:0, flex: 1}}>
        <View style={{marginTop:20, borderBottomWidth: 1, borderBottomColor: 'lightgray', width: 371}}/>
        <FlatList 
          bounces={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          data={this.state.vegipes}
          style={{flex: 1, width: 370, maxWidth: 370}}
          keyExtractor = {this.keyExtractor}
          renderItem={this.renderRow}
        />
        </ScrollView>
      </View>
    );
    }
  }

  //Navigaatiopalkin tyylimääritykset
   static navigationOptions = {
    headerTitle: 'Vegipes',
    title: "Home",
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

export default App