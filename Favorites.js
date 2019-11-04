import React from 'react';
import { Icon, ListItem, Button } from 'react-native-elements';
import { StatusBar, Alert, StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import Swipeout from 'react-native-swipeout';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("coursedb.db");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: '', fontLoaded: false, id: '', nimi: '', kuvaus: '', ohjeet: '', ainesosat: '', vegipes: []};
    //Funktioiden bindaus
    this.renderRow = this.renderRow.bind(this);
    this.updateList = this.updateList.bind(this);
  }

  //Reseptin lisäyksen ja sivun ohjauksen jälkeinen listan päivitys
  componentWillReceiveProps() {
    this.updateList();
  }

  //Sivun ladatessa...
  componentDidMount() {
    this.updateList();
  }

  // Päivitä resepti-lista
  updateList = () => {
    db.transaction(tx => {
      tx.executeSql(`select * from vegipes where fav = 1;`, [], (_, { rows }) =>
        this.setState({vegipes: rows._array})
      );
    });
  }

  // Tallentaa reseptin suosikkeihin
  unfavoriteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`update vegipes set fav = 0 where id = ?;`, [id]);
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
      <Icon name='favorite-border' color='#fff' size={28}/></View>),
      backgroundColor: 'darkorange',
      onPress: () => {this.unfavoriteItem(id), Alert.alert(item.nimi+'\npoistettu suosikeista.')}
      }  
    ];

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
          <Button color="#fff" buttonStyle={{backgroundColor:'darkorange', width:330, marginTop:20, marginLeft:0, marginBottom:2, height:45, borderRadius:50}} 
            icon={{name:'arrow-back', size: 20, color:'white'}} onPress={() => navigate('Home')} title="TAKAISIN RESEPTILISTAAN"/>
          <ScrollView alwaysBounceHorizontal={false} alwaysBounceVertical={false} bounces={false} keyboardShouldPersistTaps="never" style={{width:370, marginLeft:0, flex: 1}}>
          <View style={{marginTop:20, flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
          <Text style={{color:"gray", fontWeight:"normal", width:320, fontSize: 17, textAlign:'center'}}>Suosikkeja ei vielä ole lisätty.{'\n'}Voit lisätä listalla olevia reseptejä suosikiksi{'\n'}swipe-valikosta tai reseptin tietosivulta.</Text>
          </View>
          </ScrollView>
        </View>
      );
    } else {
    return (
      <View style={styles.container}>
      <StatusBar
      barStyle='light-content'/>
        <Button color="#fff" buttonStyle={{backgroundColor:'darkorange', width:330, marginTop:20, marginLeft:0, marginBottom:2, height:45, borderRadius:50}} 
            icon={{name:'arrow-back', size: 20, color:'white'}} onPress={() => navigate('Home')} title="TAKAISIN RESEPTILISTAAN"/>
        <ScrollView alwaysBounceHorizontal={false} alwaysBounceVertical={false} bounces={false} keyboardShouldPersistTaps="never" style={{width:370, marginLeft:0, flex: 1}}>
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
    headerTitle: "Vegipes",
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