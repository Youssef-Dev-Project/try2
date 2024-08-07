import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import supabase from '../supabaseClient';

const Detail = ({ route }) => {
  const { agriculteur } = route.params;
  const [profileImageUri, setProfileImageUri] = useState(null);

  const renderSexe = () => {
    return agriculteur.Sexe ? 'Homme' : 'Femme';
  };

  const fetchProfilePicture = async (cin) => {
    const profileImagePath = `Agriculteur_PP/${cin}.png`;
    const defaultImagePath = 'Agriculteur_PP/Default.png'; // Path to the default image in Supabase storage

    try {
      let { data, error } = await supabase
        .storage
        .from('LocAgri')
        .getPublicUrl(profileImagePath);

      if (error || !data.publicUrl) {
        console.log('Profile picture not found, fetching default image.');
        ({ data, error } = await supabase
          .storage
          .from('LocAgri')
          .getPublicUrl(defaultImagePath));

        if (error || !data.publicUrl) {
          console.error('Error fetching default image:', error);
          setProfileImageUri(null);
        } else {
          setProfileImageUri(data.publicUrl);
        }
      } else {
        console.log('Fetched image URL:', data.publicUrl);
        setProfileImageUri(data.publicUrl);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      try {
        const { data, error } = await supabase
          .storage
          .from('LocAgri')
          .getPublicUrl(defaultImagePath);

        if (error || !data.publicUrl) {
          console.error('Error fetching default image:', error);
          setProfileImageUri(null);
        } else {
          setProfileImageUri(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching default image:', error);
        setProfileImageUri(null);
      }
    }
  };

  useEffect(() => {
    fetchProfilePicture(agriculteur.CIN_ID);
    console.log('DateNaissance:', agriculteur.DateNaissance); // Log DateNaissance
    console.log('Created At:', agriculteur.created_at); // Log created_at
  }, [agriculteur.CIN_ID, agriculteur.DateNaissance, agriculteur.created_at]);

  const imageSource = profileImageUri
    ? { uri: profileImageUri }
    : { uri: 'https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png' };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date'; // Check for invalid dates

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detail}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={imageSource}
            style={styles.profileImage}
            resizeMode="cover"
            onError={() => setProfileImageUri("https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png")}
          />
          <Text style={styles.title}>{agriculteur.Nom} {agriculteur.Prenom}</Text>
        </View>
        <Text style={styles.detailText}>CIN: {agriculteur.CIN_ID}</Text>
        <Text style={styles.detailText}>Sexe: {renderSexe()}</Text>
        <Text style={styles.detailText}>
          Date of Birth: {formatDate(agriculteur.DateNaissance)}
        </Text>
        <Text style={styles.detailText}>
          Created At: {formatDate(agriculteur.created_at)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8f5e9",
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#a5d6a7",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 8,
  },
  profileImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 75,
  },
});

export default Detail;
