
import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Home';
import Add from './Add';
import Edit from './Edit';
import Recipe from './Recipe';
import Favorites from './Favorites';



const MyApp = createStackNavigator(
  {
    Home: {screen: Home},
      Add: {screen: Add},
        Edit: {screen: Edit},
        Recipe: {screen: Recipe},
        Favorites: {screen: Favorites},
  },
  {
    initialRouteName: 'Home',
defaultNavigationOptions: {
      headerTitle:'Disable back Options',
      headerTitleStyle: {color:'white'},
      headerStyle: {backgroundColor:'black'},
      headerTintColor: 'red',
      headerForceInset: {vertical: 'never'},
      headerLeft: " "
}
  }
);

export default createAppContainer(MyApp)