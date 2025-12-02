import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Text, Button, Card, Snackbar, Searchbar, Chip } from 'react-native-paper';
import CustAppBar from '../components/CustAppBar';
import { gymService } from '../services/gymService';
import { gymRepo } from '../repositories/gymRepo';

// Näkymä kuntosalikartalle ja sijainnille
export default function MapScreen({ route }) {

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGym, setSelectedGym] = useState(null);
  const [favoriteGyms, setFavoriteGyms] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(null);
  const [ gyms, setGyms ] = useState ([]);
  const [searching, setSearching] = useState(false);

  // Pyydä sijaintilupa ja hae käyttäjän sijainti
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Enable it in settings.');
        setLoading(false);
        return;
      }

      // Hae käyttäjän nykyinen sijainti
      const userLocation = await Location.getCurrentPositionAsync({});
      const lat = userLocation.coords.latitude;
      const lng = userLocation.coords.longitude;

      // Aseta sijainti ja hae lähistön kuntosalit
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      await fetchNearbyGyms(lat, lng);
      setError(null);
      } catch (err) {
        setError('Error getting location');
        console.error('Location error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Hae lähistön kuntosalit
    const fetchNearbyGyms = async (lat, lng) => {
    try {
      setSearching(true);
      const fetchedGyms = await gymService.searchGymsNearby(lat, lng, 15);
      setGyms(fetchedGyms);
      setError(null);
    } catch (err) {
      setError('Error fetching gyms. Try again.');
      console.error('fetchNearbyGyms error', err);
    } finally {
      setSearching(false);
    }
    };
  
    // Käsittele kuntosalien hakua nimen perusteella
  const handleSearch = async () => {
    if (!searchQuery.trim() || !location) return;
    try {
      setSearching(true);
      const results = await gymService.searchGymsByName(
        searchQuery,
        location.latitude,
        location.longitude,
        10
      );
      setGyms(results);
      setError(null);
    } catch (err) {
      setError('Search failed. Try again.');
      console.error('handleSearch error', err);
    } finally {
      setSearching(false);
    }
  };

  // Palauta lähistön kuntosalit, jos hakukenttä tyhjä
  useEffect (() => {
    if (!location) return;
    if (searchQuery.trim() === '') {
      if (!searching) {
        fetchNearbyGyms(location.latitude, location.longitude);
        setSelectedGym(null);
      }
    }
  }, [searchQuery, location]);

  // Suodata kuntosalit hakukyselyn perusteella
  const filteredGyms = searchQuery.trim()
    ? gyms.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (gym.address || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : gyms;

    // Käsittele suosikkikuntosalien lisääminen/poistaminen
  const toggleFavorite = async (gym) => {
    const isFavorited = favoriteGyms.some((fav) => fav.id === gym.id);
    try {
    if (isFavorited) {
      await gymRepo.removeFavoriteGym(gym.id);
      setFavoriteGyms(favoriteGyms.filter((fav) => fav.id !== gym.id));
      setSnackbarMessage(`${gym.name} removed from favorites`);
    } else {
      await gymRepo.saveFavoriteGym(gym);
      setFavoriteGyms([...favoriteGyms, gym]);
      setSnackbarMessage(`${gym.name} added to favorites ⭐`);
    }
    setSnackbarVisible(true);
  } catch (err) {
    setSnackbarMessage('Error saving favorites');
    setSnackbarVisible(true);
    console.error('toggleFavorite error', err);
    }
  };
useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await gymRepo.getAllFavoriteGyms();
      if (!mounted) return;
      setFavoriteGyms(saved);
      if (route?.params?.showFavorites) {
        setGyms(saved);
        setSelectedGym(null);
        setSearchQuery('');
      }
    })();
    return () => {
      mounted = false;
   };
  }, [route?.params?.showFavorites]);

  // Tarkista, onko kuntosali suosikeissa
  const isFavorited = (gymId) => favoriteGyms.some((fav) => fav.id === gymId);

  // Renderöi latausindikaattori, virheviesti tai kartta
  if (loading) {
    return (
      <View style={styles.container}>
        <CustAppBar title="Gyms" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Getting location...</Text>
        </View>
      </View>
    );
  }

  // Näytä virheviesti, jos sijaintia ei saada
  if (error && !location) {
    return (
      <View style={styles.container}>
        <CustAppBar title="Gyms" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Button
            mode="contained"
            onPress={requestLocationPermission}
            style={styles.retryButton}
            icon="refresh"
          >
            Try again
          </Button>
        </View>
      </View>
    );
  }

  // Päärenderöinti
  return (
    <View style={styles.container}>
      <CustAppBar title="Gyms 🗺️" />

      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          showsUserLocation
          zoomEnabled
          scrollEnabled
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your location"
            pinColor="#1E88E5"
          />

          {filteredGyms.map((gym) => (
            <Marker
              key={gym.id}
              coordinate={{
                latitude: gym.latitude,
                longitude: gym.longitude,
              }}
              title={gym.name}
              description={gym.address}
              pinColor={isFavorited(gym.id) ? '#FFD700' : '#FF6B6B'}
              onPress={() => setSelectedGym(gym)}
            />
          ))}
        </MapView>
      )}

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for gyms..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      {selectedGym && (
        <View style={styles.detailsSheet}>
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Text style={styles.gymName}>{selectedGym.name}</Text>
              <Text style={styles.gymAddress}>📍 {selectedGym.address}</Text>
              <Text style={styles.gymDistance}>
                📏 {selectedGym.distance.toFixed(1)} km away
              </Text>
              <Text style={styles.gymRating}>
                ⭐ {selectedGym.rating} / 5.0
              </Text>

              <Text style={styles.facilitiesLabel}>Facilities:</Text>
              <View style={styles.facilitiesContainer}>
                {selectedGym.facilities && selectedGym.facilities.length > 0 ? (
                  selectedGym.facilities.map((facility) => (
                    <Chip key={facility} style={styles.facilityChip} mode="outlined" compact>
                      {facility}
                    </Chip>
                  ))
                ) : (
                  <Text style={styles.noFacilitiesText}>No facility information</Text>
                )}
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button
                mode="outlined"
                onPress={() => setSelectedGym(null)}
              >
                Close
              </Button>
              <Button
                mode="contained"
                onPress={() => toggleFavorite(selectedGym)}
                icon={isFavorited(selectedGym.id) ? 'star' : 'star-outline'}
                buttonColor={isFavorited(selectedGym.id) ? '#FFD700' : undefined}
              >
                {isFavorited(selectedGym.id) ? 'In favorites' : 'Add to favorites'}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      )}

      {!selectedGym && (
        <View style={styles.listContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredGyms.length > 0 ? (
              filteredGyms.map((gym) => (
                <Card
                  key={gym.id}
                  style={styles.gymCard}
                  onPress={() => setSelectedGym(gym)}
                >
                  <Card.Content style={styles.gymCardContent}>
                    <View style={styles.gymCardHeader}>
                      <Text style={styles.gymCardName}>{gym.name}</Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: isFavorited(gym.id) ? '#FFD700' : '#999',
                        }}
                      >
                        {isFavorited(gym.id) ? '⭐' : '☆'}
                      </Text>
                    </View>
                    <Text style={styles.gymCardDistance}>
                      {gym.distance.toFixed(1)} km • {gym.rating} ⭐
                    </Text>
                    <Text style={styles.gymCardAddress}>{gym.address}</Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Card style={styles.emptyCard}>
                <Card.Content>
                  <Text style={styles.emptyText}>
                    No gyms found with search term "{searchQuery}"
                  </Text>
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        </View>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
  },
  searchContainer: {
    position: 'absolute',
    top: 90,
    left: 10,
    right: 60,
    zIndex: 10,
  },
  searchbar: {
    elevation: 4,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  detailsSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: '50%',
  },
  detailsCard: {
    elevation: 0,
    backgroundColor: '#F9F9F9',
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '45%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  gymCard: {
    marginBottom: 10,
    elevation: 2,
  },
  gymCardContent: {
    paddingVertical: 12,
  },
  gymCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gymCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  gymCardDistance: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  gymCardAddress: {
    fontSize: 12,
    color: '#999',
  },
  gymName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  gymAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  gymDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  gymRating: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
    marginBottom: 12,
  },
  facilitiesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  noFacilitiesText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  facilityChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingTop: 12,
  },
  detailsCard: {
    elevation: 0,
    backgroundColor: '#FFF',
  },
  emptyCard: {
    marginVertical: 20,
    elevation: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});