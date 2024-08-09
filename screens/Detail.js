import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
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

  // Table headers and data
  const tableHead = ['Exp', 'Lat/Lon', 'Sup(m2)'];
  const tableData = exploitations.map((exp, index) => [
    index + 1,
    `${exp.Position.Latitude}\n${exp.Position.Longitude}`, // Combine Lat and Lon with line break
    exp.Superficie,
  ]);

  
  const renderRow = (rowData, index) => (
    <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#a5d6a7' }]}>
      <Text style={styles.tableText}>{rowData[0]}</Text>
      <View style={styles.latLonContainer}>
        <TouchableOpacity onPress={() => navigateToMaps(rowData[1].split('\n')[0], rowData[1].split('\n')[1])}>
          <Text style={styles.tableText}>{rowData[1].split('\n')[0]}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => navigateToMaps(rowData[1].split('\n')[0], rowData[1].split('\n')[1])}>
          <Text style={styles.tableText}>{rowData[1].split('\n')[1]}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tableText}>{rowData[2]}</Text>
    </View>
  );

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
                <Table borderStyle={{ borderColor: '#2e7d32', borderWidth: 1 }}>
                  <Row data={tableHead} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                  <Rows
                    data={tableData}
                    textStyle={styles.tableText}
                    renderRow={renderRow}
                    style={styles.tableBody}
                  />
                </Table>
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
  tableHeader: {
    height: 40,
    backgroundColor: 'transparent',
  },
  tableHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#2e7d32",
  },
  tableText: {
    margin: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  latLonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#000', 
    marginVertical: 4, 
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
    textAlign: 'center',
  },
});

export default Detail;
