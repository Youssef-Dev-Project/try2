import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuthentication } from '../hooks/useAuthentication'; // Import useAuthentication

export default function Maps({ navigation }) {
  const { logout } = useAuthentication(); // Get the logout function
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const mapRef = useRef(null);

  // Define initial region for the map
  const initialRegion = {
    latitude: 34.0515706,
    longitude: -6.8125429,
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

  const handleLogout = () => {
    logout(navigation); // Call logout and pass navigation
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true} // Show the user's location on the map
        followUserLocation={true} // Keep the map centered on the user's location
        showsMyLocationButton={false} // Show the user's location button
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
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#388e3c",
    borderRadius: 20,
    height: 40,
    position: 'absolute', // Keep the header fixed at the top
    top: 30, // Stick to the top of the screen
    left: 15, // Align with Home screen's left margin
    right: 15, // Align with Home screen's right margin
    zIndex: 1, // Ensure the header is above the map
    marginTop: 20, // Extra margin to adjust its position if needed
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  logoutButton: {
    padding: 10,
    position: "absolute",
    left: 10,
    zIndex: 1, // Ensure the button is on top
  },
  locateButton: {
    padding: 10,
    position: "absolute",
    right: 10,
    zIndex: 1, // Ensure the button is on top
  },
});
