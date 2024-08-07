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
import supabase from '../supabaseClient';
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

  const handleLogout = () => {
    logout(navigation);
  };

  const fetchProfilePicture = async (cin) => {
    const profileImagePath = `Agriculteur_PP/${cin}.png`;
    const defaultImagePath = 'Agriculteur_PP/Default.png'; // Correct path to default image

    try {
      let { data, error } = await supabase
        .storage
        .from('LocAgri')
        .getPublicUrl(profileImagePath);

      if (error || !data.publicUrl) {
        console.log(`Profile image not found for ${cin}, fetching default image.`);
        ({ data, error } = await supabase
          .storage
          .from('LocAgri')
          .getPublicUrl(defaultImagePath));

        if (error || !data.publicUrl) {
          console.error('Error fetching default image:', error);
          return 'https://via.placeholder.com/100'; // Return a placeholder URL if default image fails
        }
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'https://via.placeholder.com/100'; // Return placeholder URL if any error occurs
    }
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('Agriculteur')
        .select('CIN_ID, Nom, Prenom, Sexe, DateNaissance, created_at');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const agriculteursWithImages = await Promise.all(data.map(async (agriculteur) => {
          const imageUrl = await fetchProfilePicture(agriculteur.CIN_ID);
          agriculteur.imageUrl = imageUrl;
          return agriculteur;
        }));

        const sortedData = agriculteursWithImages.sort((a, b) => a.Nom.localeCompare(b.Nom));
        setAgriculteurs(sortedData);
        setFilteredAgriculteurs(sortedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
        source={{ uri: item.imageUrl }} 
        style={styles.itemImage} 
        resizeMode="cover"
      />
      <Text style={styles.itemText}>{`${item.Nom} ${item.Prenom}`}</Text>
      <Text style={styles.itemSubText}>CIN: {item.CIN_ID}</Text>
    </Pressable>
  );

  return (
    <View style={styles.view}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
  listContainer: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
  },
});
