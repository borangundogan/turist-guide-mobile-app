import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeTab'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Have a Good Day,</Text>
              <Text style={styles.userName}>Gerry Johnson 👋</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBar}>
            <TextInput
              placeholder="I want to..."
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.dateFilters}>
            <TouchableOpacity style={styles.dateFilterActive}>
              <Text style={styles.dateFilterTextActive}>Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilter}>
              <Text style={styles.dateFilterText}>Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateFilter}>
              <Text style={styles.dateFilterText}>Next Week</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Itinerary</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={styles.itineraryCard}
              onPress={() => navigation.navigate('RouteDetail')}
            >
              <Image
                source={{ uri: 'https://i.imgur.com/QJ1SV5R.jpg' }}
                style={styles.itineraryImage}
              />
              <View style={styles.itineraryOverlay}>
                <Text style={styles.itineraryTitle}>Travelling to Bali</Text>
                <View style={styles.itineraryInfo}>
                  <Text style={styles.itineraryDate}>🗓 Oct 2024</Text>
                  <Text style={styles.itineraryDuration}>• 7 Days</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destination</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
          >
            {['Bangkok', 'Tokyo', 'Paris', 'Bali'].map((city) => (
              <TouchableOpacity key={city} style={styles.destinationCard}>
                <Image
                  source={{ uri: `https://source.unsplash.com/300x200/?${city}` }}
                  style={styles.destinationImage}
                />
                <Text style={styles.destinationName}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    padding: 15,
    fontSize: 16,
  },
  dateFilters: {
    flexDirection: 'row',
    gap: 10,
  },
  dateFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  dateFilterActive: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2D63FF',
    borderRadius: 20,
  },
  dateFilterText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  dateFilterTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    color: '#2D63FF',
    fontSize: 14,
  },
  itineraryCard: {
    width: 300,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
  },
  itineraryImage: {
    width: '100%',
    height: '100%',
  },
  itineraryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  itineraryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itineraryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itineraryDate: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  itineraryDuration: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
  destinationsContainer: {
    paddingRight: 20,
  },
  destinationCard: {
    width: 150,
    marginRight: 15,
  },
  destinationImage: {
    width: '100%',
    height: 100,
    borderRadius: 15,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#1A1A1A',
  },
});

export default HomeScreen; 