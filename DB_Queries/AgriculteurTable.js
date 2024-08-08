import supabase from '../supabaseClient';

export const fetchProfilePicture = async (cin) => {
  const profileImagePath = `Agriculteur_PP/${cin}.png`;
  const defaultImagePath = 'Agriculteur_PP/Default.png';

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
        return 'https://via.placeholder.com/100';
      }
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://via.placeholder.com/100';
  }
};

export const fetchAgriculteurs = async () => {
  try {
    const { data, error } = await supabase
      .from('Agriculteur')
      .select(`
        CIN_ID,
        Nom,
        Prenom,
        Sexe,
        DateNaissance,
        created_at,
        Type_ID,
        TAgriculteur!inner(Type)
      `);

    if (error) {
      console.error('Error fetching data:', error);
      return [];
    } else {
      const agriculteursWithImages = await Promise.all(data.map(async (agriculteur) => {
        const imageUrl = await fetchProfilePicture(agriculteur.CIN_ID);
        agriculteur.imageUrl = imageUrl;
        return agriculteur;
      }));

      const sortedData = agriculteursWithImages.sort((a, b) => a.Nom.localeCompare(b.Nom));
      return sortedData;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const fetchExploitationsWithPositions = async (cin) => {
  try {
    const { data: exploitations, error: exploitationsError } = await supabase
      .from('Exploitation')
      .select('Position_ID, Superficie')
      .eq('Owner', cin);

    if (exploitationsError) {
      console.error('Error fetching exploitations:', exploitationsError);
      return [];
    }

    const positions = await Promise.all(exploitations.map(async (exploitation) => {
      const { data: position, error: positionError } = await supabase
        .from('Position')
        .select('Latitude, Longitude')
        .eq('Position_ID', exploitation.Position_ID)
        .single();

      if (positionError) {
        console.error('Error fetching position:', positionError);
        return null;
      }

      return {
        Position_ID: exploitation.Position_ID,
        Latitude: position.Latitude,
        Longitude: position.Longitude,
        Superficie: exploitation.Superficie,
      };
    }));

    return positions.filter(position => position !== null);
  } catch (error) {
    console.error('Error fetching exploitations and positions:', error);
    return [];
  }
};
