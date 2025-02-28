import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';

const FooterMenu = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!isFocused || keyboardVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MenuItem
        routeName="Home"
        currentRoute={route.name}
        activeIcon={require('../../img/icons/home_active.png')}
        inactiveIcon={require('../../img/icons/home.png')}
        navigation={navigation}
      />
      <MenuItem
        routeName="Allblog"
        currentRoute={route.name}
        activeIcon={require('../../img/icons/search_active.png')}
        inactiveIcon={require('../../img/icons/search.png')}
        navigation={navigation}
      />
      <MenuItem
        routeName="Post"
        currentRoute={route.name}
        activeIcon={require('../../img/icons/addblog_active.png')}
        inactiveIcon={require('../../img/icons/addblog.png')}
        navigation={navigation}
      />
      <MenuItem
        routeName="Myposts"
        currentRoute={route.name}
        activeIcon={require('../../img/icons/history_active.png')}
        inactiveIcon={require('../../img/icons/history.png')}
        navigation={navigation}
      />
      <MenuItem
        routeName="Account"
        currentRoute={route.name}
        activeIcon={require('../../img/icons/account_active.png')}
        inactiveIcon={require('../../img/icons/account.png')}
        navigation={navigation}
      />
    </View>
  );
};

const MenuItem = ({ routeName, currentRoute, activeIcon, inactiveIcon, navigation }) => {
  const isActive = routeName === currentRoute;
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
      <Image source={isActive ? activeIcon : inactiveIcon} style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth:0.5,
    borderBlockColor:"#87CEFA",
 


  },
  iconStyle: {
    width: 25,
    height: 25,
    margin: 12,
  },
});

export default FooterMenu;
