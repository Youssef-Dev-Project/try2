import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import supabase from '../supabaseClient';

const Detail = ({ route }) => {
  const { agriculteur } = route.params;
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [exploitations, setExploitations] = useState([]);

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

  const fetchExploitations = async () => {
    // Fetch exploitations with latitude and longitude by joining the Position table
    const { data, error } = await supabase
      .from('Exploitation')
      .select('Position_ID, Superficie, Position (Latitude, Longitude)')
      .eq('Owner', agriculteur.CIN_ID);

    if (error) {
      console.error('Error fetching exploitations:', error);
      setExploitations([]);
    } else {
      setExploitations(data);
    }
  };

  useEffect(() => {
    fetchProfilePicture(agriculteur.CIN_ID);
    fetchExploitations(); // Fetch exploitations on component mount
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
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.profileContainer}>
            <Image
              source={imageSource}
              style={styles.profileImage}
              resizeMode="cover"
              onError={() => setProfileImageUri("https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png")}
            />
            <Text style={styles.title}>{agriculteur.Nom} {agriculteur.Prenom}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.detailText}><Text style={styles.label}>CIN:</Text> {agriculteur.CIN_ID}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Sexe:</Text> {renderSexe()}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Date of Birth:</Text> {formatDate(agriculteur.DateNaissance)}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Created At:</Text> {formatDate(agriculteur.created_at)}</Text>
            {agriculteur.TAgriculteur && agriculteur.TAgriculteur.Type && (
              <Text style={styles.detailText}><Text style={styles.label}>Statut:</Text> {agriculteur.TAgriculteur.Type}</Text>
            )}
          </View>
          <View style={styles.exploitationSection}>
            <Text style={styles.sectionTitle}>Exploitation</Text>
            {exploitations.length > 0 ? (
              <ScrollView style={styles.tableContainer}>
                <View style={styles.table}>
                  <View style={styles.tableRowHeader}>
                    <Text style={[styles.tableHeaderCell, styles.tableCell]}></Text>
                    <Text style={[styles.tableHeaderCell, styles.tableCell]}>Lat</Text>
                    <Text style={[styles.tableHeaderCell, styles.tableCell]}>Lon</Text>
                    <Text style={[styles.tableHeaderCell, styles.tableCell]}>Sup(m2)</Text>
                    
                  </View>
                  {exploitations.map((exp, index) => (
                    <View key={`${exp.Position_ID}-${index}`} style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.tableCellBorder]}>{index + 1}</Text>
                      <Text style={[styles.tableCell, styles.tableCellBorder]}>{exp.Position.Latitude}</Text>
                      <Text style={styles.tableCell}>{exp.Position.Longitude}</Text>
                      <Text style={styles.tableCell}>{exp.Superficie}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>No exploitation found</Text>
            )}
          </View>
        </ScrollView>
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
    backgroundColor: "#a5d6a7",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    maxHeight: '100%', // Make sure it doesn't overflow beyond the screen
  },
  detailContent: {
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: "#2e7d32",
  },
  infoContainer: {
    width: '100%',
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: "#1b5e20",
  },
  exploitationSection: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center', // Center content horizontally
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#2e7d32",
    textAlign: 'center', // Center text horizontally
  },
  tableContainer: {
    width: '100%',
    maxHeight: 300, // Adjust height as needed
  },
  table: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden', // Ensure rounded corners work
    borderWidth: 1,
    borderColor: "#333",
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: "#a5d6a7",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  tableCellBorder: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
    textAlign: 'center',
  },
});

export default Detail;
