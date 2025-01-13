import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Share,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeTab: undefined;
  Destination: { routeId: string };
  Add: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SortOption = 'name' | 'date' | 'rating' | 'duration';
type FilterType = 'all' | 'historical' | 'nature' | 'food' | 'shopping';

// Örnek veriler
const MY_ROUTES = [
  {
    id: '1',
    title: 'İstanbul Tarihi Yarımada',
    type: 'historical',
    points: [
      { title: 'Ayasofya' },
      { title: 'Topkapı Sarayı' },
      { title: 'Sultanahmet Camii' },
    ],
    duration: '4 saat',
    rating: 4.8,
    image: 'https://example.com/istanbul.jpg',
    distance: '5.2 km',
    createdAt: '2024-01-15',
    isFavorite: true,
    visitCount: 3,
    lastVisited: '2024-01-10',
  },
  {
    id: '2',
    title: 'Boğaz Turu',
    type: 'nature',
    points: [
      { title: 'Ortaköy' },
      { title: 'Bebek' },
      { title: 'Rumeli Hisarı' },
    ],
    duration: '3 saat',
    rating: 4.5,
    image: 'https://example.com/bosphorus.jpg',
    distance: '8.7 km',
    createdAt: '2024-01-12',
    isFavorite: false,
    visitCount: 1,
    lastVisited: '2024-01-12',
  },
];

const ItineraryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [routes, setRoutes] = useState(MY_ROUTES);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'historical':
        return 'account-balance';
      case 'nature':
        return 'park';
      case 'food':
        return 'restaurant';
      case 'shopping':
        return 'shopping-bag';
      default:
        return 'place';
    }
  };

  const handleRoutePress = (routeId: string) => {
    navigation.navigate('Destination', { routeId });
  };

  const handleShare = async (route: typeof MY_ROUTES[0]) => {
    try {
      const result = await Share.share({
        message: `${route.title}\n\nRotadaki Yerler:\n${route.points.map(p => `- ${p.title}`).join('\n')}\n\nToplam Mesafe: ${route.distance}\nSüre: ${route.duration}`,
        title: route.title,
      });
    } catch (error) {
      Alert.alert('Hata', 'Rota paylaşılırken bir hata oluştu');
    }
  };

  const handleFavorite = (routeId: string) => {
    setRoutes(routes.map(route => 
      route.id === routeId ? { ...route, isFavorite: !route.isFavorite } : route
    ));
  };

  const handleDelete = (routeId: string) => {
    Alert.alert(
      'Rotayı Sil',
      'Bu rotayı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setRoutes(routes.filter(route => route.id !== routeId));
          },
        },
      ]
    );
  };

  const filterRoutes = () => {
    let filtered = [...MY_ROUTES];
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(route => route.type === selectedFilter);
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrele</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              {/* @ts-ignore */}
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {['all', 'historical', 'nature', 'food', 'shopping'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterOption,
                selectedFilter === type && styles.selectedFilter,
              ]}
              onPress={() => {
                setSelectedFilter(type as FilterType);
                setShowFilterModal(false);
              }}
            >
              {/* @ts-ignore */}
              <MaterialIcons
                name={getTypeIcon(type)}
                size={24}
                color={selectedFilter === type ? '#2D63FF' : '#666'}
              />
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === type && styles.selectedFilterText,
                ]}
              >
                {type === 'all' ? 'Tümü' :
                 type === 'historical' ? 'Tarihi' :
                 type === 'nature' ? 'Doğa' :
                 type === 'food' ? 'Yemek' : 'Alışveriş'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sırala</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              {/* @ts-ignore */}
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {[
            { id: 'name', label: 'İsme Göre', icon: 'sort-by-alpha' },
            { id: 'date', label: 'Tarihe Göre', icon: 'date-range' },
            { id: 'rating', label: 'Puana Göre', icon: 'star' },
            { id: 'duration', label: 'Süreye Göre', icon: 'schedule' },
          ].map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                sortBy === option.id && styles.selectedFilter,
              ]}
              onPress={() => {
                setSortBy(option.id as SortOption);
                setShowSortModal(false);
              }}
            >
              {/* @ts-ignore */}
              <MaterialIcons
                name={option.icon}
                size={24}
                color={sortBy === option.id ? '#2D63FF' : '#666'}
              />
              <Text
                style={[
                  styles.filterOptionText,
                  sortBy === option.id && styles.selectedFilterText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rotalarım</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSortModal(true)}
          >
            {/* @ts-ignore */}
            <MaterialIcons name="sort" size={24} color="#2D63FF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilterModal(true)}
          >
            {/* @ts-ignore */}
            <MaterialIcons name="filter-list" size={24} color="#2D63FF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filterRoutes().map(route => (
          <TouchableOpacity
            key={route.id}
            style={styles.routeCard}
            onPress={() => handleRoutePress(route.id)}
          >
            <View style={styles.routeImageContainer}>
              <View style={styles.routeTypeIcon}>
                {/* @ts-ignore */}
                <MaterialIcons
                  name={getTypeIcon(route.type)}
                  size={20}
                  color="#fff"
                />
              </View>
              {/* Placeholder image */}
              <View style={styles.imagePlaceholder}>
                {/* @ts-ignore */}
                <MaterialIcons name="image" size={40} color="#ddd" />
              </View>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeTitle}>{route.title}</Text>
              <View style={styles.routePoints}>
                {route.points.map((point, index) => (
                  <Text key={index} style={styles.routePoint}>
                    {index > 0 ? ' → ' : ''}{point.title}
                  </Text>
                ))}
              </View>
              <View style={styles.routeStats}>
                <View style={styles.routeStat}>
                  {/* @ts-ignore */}
                  <MaterialIcons name="schedule" size={16} color="#666" />
                  <Text style={styles.routeStatText}>{route.duration}</Text>
                </View>
                <View style={styles.routeStat}>
                  {/* @ts-ignore */}
                  <MaterialIcons name="straighten" size={16} color="#666" />
                  <Text style={styles.routeStatText}>{route.distance}</Text>
                </View>
                <View style={styles.routeStat}>
                  {/* @ts-ignore */}
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.routeStatText}>{route.rating}</Text>
                </View>
              </View>
              <View style={styles.routeStats}>
                <View style={styles.routeStat}>
                  {/* @ts-ignore */}
                  <MaterialIcons name="history" size={16} color="#666" />
                  <Text style={styles.routeStatText}>{route.visitCount} ziyaret</Text>
                </View>
                <View style={styles.routeStat}>
                  {/* @ts-ignore */}
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.routeStatText}>Son: {new Date(route.lastVisited).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.routeActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleFavorite(route.id)}
              >
                {/* @ts-ignore */}
                <MaterialIcons
                  name={route.isFavorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={route.isFavorite ? '#ff4444' : '#666'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(route)}
              >
                {/* @ts-ignore */}
                <MaterialIcons name="share" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(route.id)}
              >
                {/* @ts-ignore */}
                <MaterialIcons name="delete" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {routes.length === 0 && (
          <View style={styles.emptyState}>
            {/* @ts-ignore */}
            <MaterialIcons name="route" size={48} color="#ddd" />
            <Text style={styles.emptyStateText}>Henüz rota eklemediniz</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Add')}
            >
              <Text style={styles.addButtonText}>Yeni Rota Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {renderFilterModal()}
      {renderSortModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  routeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    position: 'relative',
  },
  routeTypeIcon: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#2D63FF',
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  routePoints: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  routePoint: {
    fontSize: 12,
    color: '#666',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  routeStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  routeActions: {
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  actionButton: {
    padding: 4,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: '#e6edff',
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#666',
  },
  selectedFilterText: {
    color: '#2D63FF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#2D63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ItineraryScreen; 