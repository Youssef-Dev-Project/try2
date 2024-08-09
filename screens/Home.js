import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import { fetchAgriculteurs } from '../DB_Queries/AgriculteurTable'; // Import the fetchAgriculteurs function
import { useAuthentication } from '../hooks/useAuthentication';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Home({ navigation }) {
  const { isAuthenticated, logout } = useAuthentication();
  const [agriculteurs, setAgriculteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgriculteurs, setFilteredAgriculteurs] = useState([]);
  const [columns] = useState(2);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Default profile image URL
  const defaultImageUrl = 'https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png';

  const handleLogout = () => {
    logout(navigation);
  };

  const fetchData = async () => {
    const agriculteursData = await fetchAgriculteurs();
    setAgriculteurs(agriculteursData);
    setFilteredAgriculteurs(agriculteursData);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = agriculteurs.filter((agriculteur) =>
        `${agriculteur.Nom} ${agriculteur.Prenom}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredAgriculteurs(filtered);
    } else {
      setFilteredAgriculteurs(agriculteurs);
    }
  }, [searchQuery, agriculteurs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { agriculteur: item })}
    >
      <Image
        source={{ uri: item.imageUrl || defaultImageUrl }} // Use default image if imageUrl is not available
        style={styles.itemImage}
        resizeMode="cover"
        onError={() => { item.imageUrl = defaultImageUrl; }} // Handle image error
      />
      <Text style={styles.itemText}>{`${item.Nom} ${item.Prenom}`}</Text>
      <Text style={styles.itemSubText}>CIN: {item.CIN_ID}</Text>
    </Pressable>
  );

  return (
    <View style={styles.view}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Bubble elements */}
          <View style={[styles.bubble, styles.topBubble]}></View>
          <View style={[styles.bubble, styles.bottomBubble]}></View>
          <View style={[styles.bubble, styles.rightBubble]}></View>
          <View style={[styles.bubble, styles.leftBubble]}></View>
          <View style={[styles.bubble, styles.extraBubble1]}></View>
          <View style={[styles.bubble, styles.extraBubble2]}></View>
          <View style={[styles.bubble, styles.extraBubble3]}></View>
          <View style={[styles.bubble, styles.extraBubble4]}></View>
          <View style={[styles.bubble, styles.extraBubble5]}></View>

          <View style={styles.header}>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <AntDesign name="logout" size={25} color="white" />
            </Pressable>
            <Text style={styles.title}>Home</Text>
            <Pressable onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.searchToggleButton}>
              <MaterialIcons name={isSearchVisible ? 'close' : 'search'} size={24} color="white" />
            </Pressable>
          </View>
          <View style={styles.listContainerWrapper}>
            <View style={styles.listContainer}>
              {isSearchVisible && (
                <View style={styles.searchContainer}>
                  <MaterialIcons name="search" size={24} color="gray" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                  />
                  {searchQuery ? (
                    <Pressable onPress={() => setSearchQuery('')}>
                      <MaterialIcons name="close" size={24} color="gray" style={styles.clearIcon} />
                    </Pressable>
                  ) : null}
                </View>
              )}
              {loading ? (
                <ActivityIndicator size="large" color="#4caf50" />
              ) : (
                <FlatList
                  data={filteredAgriculteurs}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.CIN_ID.toString()}
                  numColumns={columns}
                  columnWrapperStyle={styles.row}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  contentContainerStyle={{ paddingBottom: 15 }} // Add this line to ensure padding at the bottom
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#e8f5e9",
    position: 'relative', // Make positioning relative for bubble positioning
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingTop: 40,
    position: "relative",
    backgroundColor: "#388e3c",
    borderRadius: 20,
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
  searchToggleButton: {
    padding: 10,
    position: "absolute",
    right: 10,
    zIndex: 1, // Ensure the button is on top
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  searchBar: {
    flex: 1,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  clearIcon: {
    marginLeft: 5,
  },
  listContainerWrapper: {
    flex: 1,
    overflow: 'hidden', // Ensures the rounded borders stay rounded
  },
  item: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#a5d6a7",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    elevation: 3,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  itemSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#388e3c', // Dark green bubble
    borderRadius: 50, // Circle shape
  },
  topBubble: {
    top: -60,
    left: 10,
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  bottomBubble: {
    bottom: -60,
    right: 10,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  rightBubble: {
    top: '50%',
    right: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  leftBubble: {
    top: '50%',
    left: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  extraBubble1: {
    top: 100,
    left: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble2: {
    bottom: 100,
    right: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble3: {
    top: 200,
    right: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble4: {
    bottom: 200,
    left: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble5: {
    top: 300,
    left: 80,
    width: 90,
    height: 90,
    opacity: 0.2,
  },
});
