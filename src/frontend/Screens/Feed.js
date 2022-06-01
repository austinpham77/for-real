import { StyleSheet, Text, View, FlatList, ImageBackground, Touchable} from 'react-native';
import React, { useContext } from "react";
import RightPost from '../components/RightPost';
import LeftPost from '../components/LeftPost';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_300Light, Roboto_300Light_Italic, Roboto_700Bold} from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { getPosts } from '../../../firebase';
import { useState, useEffect} from 'react';
import { UserContext } from '../../context/userContext';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function Feed({ navigation }) {
  const {username, setUsername} = useContext(UserContext);
  const [data, setData] = useState();

  const gettingData = async () =>{
  const dummyDataBaseData = await getPosts();
  setData(dummyDataBaseData.reverse());
  }

  useEffect(
    () => {
       gettingData(); 
    },
  // optional dependency array
    [ ]
  );

  const image = {
    // uri: 'https://i.pinimg.com/736x/41/33/f9/4133f987e7712ec45394bb2bf9204002.jpg',
    uri: 'https://i.imgur.com/WgIfoZ4.jpg'
  };

  let [fontsLoaded] = useFonts({
    Roboto_300Light_Italic,
    Roboto_300Light,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const questionHandler = () => {
    navigation.navigate('Question');
  };

  const profileHandler = () => {
    navigation.navigate('Profile');
  };

  const communityHandler = () => {
    navigation.navigate('Community');
  };

  const feedHandler = () => {
    navigation.navigate('Feed');
  };



  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          opacity: 0.8,
        }}
      ></ImageBackground>
      {/* <Image 
        source={require("../../assets/tempgrad.png/")}
        style={styles.bgimage}>
      </Image> */}
      <View style={styles.header}>
        <View style={styles.menu}>
          <Text style={[styles.menuItem, styles.clicked]} onPress={feedHandler}>
            Global
          </Text>
          <Text style={styles.menuItem} onPress={communityHandler}>
            Your Community
          </Text>
          <Text style={styles.menuItem} onPress={profileHandler}>
            Profile
          </Text>
        </View>
        <Text style={styles.question} onPress={questionHandler}>
          Would you rather have $5 million or dinner with Jay Z and why?
        </Text>
      </View>

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={(thing) => {
          const goodThing = JSON.parse(JSON.stringify(thing));
          const number =
            Object.keys(goodThing.item.upvotes).length -
            Object.keys(goodThing.item.downvotes).length;

          if (thing.index % 2 == 0) {
            return (
              <TouchableOpacity
              onPress = {()=>navigation.navigate('ProfileOthers',{name:goodThing.item.user})}
              >
              <RightPost
                user={goodThing.item.user}
                answer={goodThing.item.answer}
                number={number}
                id={goodThing.item.postID}
                realtime={goodThing.item.realtime}
                keyExtractor={(thing) => thing.index}
              />
              </TouchableOpacity>
              
            );
          } else {
            return (
              <TouchableOpacity  
              onPress = {()=>navigation.navigate('ProfileOthers',{name:goodThing.item.user})}
              >
              <LeftPost
              user={goodThing.item.user}
              answer={goodThing.item.answer}
              number={number}
              realtime={goodThing.item.realtime}
              keyExtractor={(thing) => thing.index}
            />
              </TouchableOpacity>

            );
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  question: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: 35,
    paddingRight: 35,
    fontFamily: 'Roboto_700Bold',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 4,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  menu: {
    marginTop: 40,
    alignContent: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menuItem: {
    marginHorizontal: 15,
    fontFamily: 'Roboto_300Light',
  },
  clicked: {
    color: '#AA83FF',
    fontFamily: 'Roboto_700Bold',
  },
});
