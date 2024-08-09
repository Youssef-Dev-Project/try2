import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Pressable, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function Maps() {
  const { width, height } = Dimensions.get('window');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Define initial region for the map
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
        setLocation(coords);
      } else {
        setErrorMsg('Could not fetch location');
      }
    })();
  }, []);

  const handleLocateUser = async () => {
    if (location) {
      // Center map on user's current location
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    } else {
      Alert.alert('Error', 'Unable to fetch location');
    }
  };

  let mapRef = React.useRef(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="My Location"
            description="This is your current location"
          />
        )}
      </MapView>
      <View style={styles.header}>
        <Pressable style={styles.logoutButton}>
          <AntDesign name="logout" size={25} color="white" />
        </Pressable>
        <Text style={styles.title}>Maps</Text>
        <Pressable style={styles.locateButton} onPress={handleLocateUser}>
          <MaterialIcons name="my-location" size={25} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#388e3c',
    borderRadius: 20,
    height: 40,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    padding: 10,
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  locateButton: {
    padding: 10,
    position: 'absolute',
    right: 10,
    zIndex: 2,
  },
});
