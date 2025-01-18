import React, { useState, useEffect, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Share,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { routeApi, type Route } from '../services/api';

type RootStackParamList = {
  HomeTab: undefined;
  Destination: { routeId: string };
  Add: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SortOption = 'name' | 'date' | 'rating' | 'duration';
type FilterType = 'all' | 'historical' | 'nature' | 'food' | 'shopping';

// Yardımcı fonksiyonlar
const getTypeIcon = (type: string): string => {
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

const ForwardedMapView = forwardRef<MapView, MapViewProps>((props, ref) => (
  <MapView {...props} ref={ref} />
));

const RouteCard = ({ route, onPress, onFavorite, onShare, onDelete }: {
  route: Route;
  onPress: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onDelete: () => void;
}) => {
  const centerCoordinate = route.points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude / route.points.length,
      longitude: acc.longitude + point.longitude / route.points.length,
    }),
    { latitude: 0, longitude: 0 }
  );

  const deltas = route.points.reduce(
    (acc, point) => ({
      latitudeDelta: Math.max(acc.latitudeDelta, Math.abs(point.latitude - centerCoordinate.latitude) * 2.5),
      longitudeDelta: Math.max(acc.longitudeDelta, Math.abs(point.longitude - centerCoordinate.longitude) * 2.5),
    }),
    { latitudeDelta: 0.02, longitudeDelta: 0.02 }
  );

  const renderPoint = ({ item, index }: { item: Route['points'][0], index: number }) => (
    <View style={styles.routePoint}>
      <View style={styles.pointNumber}>
        <Text style={styles.pointNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.pointDetails}>
        <Text style={styles.pointTitle}>{item.title}</Text>
        {item.duration && (
          <Text style={styles.pointDuration}>{item.duration} dk</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <View style={styles.routeTitleContainer}>
          <MaterialIcons name={getTypeIcon(route.type)} size={24} color="#2D63FF" />
          <Text style={styles.routeTitle}>{route.title}</Text>
        </View>
        <View style={styles.routeStats}>
          <View style={styles.routeStat}>
            <MaterialIcons name="place" size={16} color="#666" />
            <Text style={styles.routeStatText}>{route.points.length} nokta</Text>
          </View>
          {route.duration && (
            <View style={styles.routeStat}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.routeStatText}>{route.duration}</Text>
            </View>
          )}
          {route.distance && (
            <View style={styles.routeStat}>
              <MaterialIcons name="straighten" size={16} color="#666" />
              <Text style={styles.routeStatText}>{route.distance}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={onPress}>
        <View style={styles.mapContainer}>
          <ForwardedMapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              ...centerCoordinate,
              ...deltas,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {route.points.map((point, index) => (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.title}
              >
                <View style={styles.markerContainer}>
                  <Text style={styles.markerText}>{index + 1}</Text>
                </View>
              </Marker>
            ))}
          </ForwardedMapView>
        </View>
      </TouchableOpacity>

      <FlatList
        data={route.points}
        renderItem={renderPoint}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        style={styles.routePoints}
      />

      <View style={styles.routeActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onFavorite}>
          <MaterialIcons
            name={route.isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={route.isFavorite ? '#ff4444' : '#666'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <MaterialIcons name="share" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <MaterialIcons name="delete" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {route.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {route.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const ItineraryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadRoutes();
    }, [])
  );

  const loadRoutes = async () => {
    try {
      setIsLoading(true);
      const fetchedRoutes = await routeApi.getRoutes();
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
      Alert.alert('Hata', 'Rotalar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoutePress = (routeId: string | undefined) => {
    if (!routeId) return;
    navigation.navigate('Destination', { routeId });
  };

  const handleShare = async (route: Route) => {
    try {
      const pointsList = route.points.map(p => `- ${p.title}`).join('\n');
      const result = await Share.share({
        message: `${route.title}\n\nRotadaki Yerler:\n${pointsList}\n\nToplam Mesafe: ${route.distance || 'Belirtilmemiş'}\nSüre: ${route.duration || 'Belirtilmemiş'}`,
        title: route.title,
      });
    } catch (error) {
      Alert.alert('Hata', 'Rota paylaşılırken bir hata oluştu');
    }
  };

  const handleFavorite = async (routeId: string | undefined) => {
    if (!routeId) return;
    try {
      const route = routes.find(r => r.id === routeId);
      if (route) {
        await routeApi.updateRoute(routeId, { isFavorite: !route.isFavorite });
        setRoutes(routes.map(r => 
          r.id === routeId ? { ...r, isFavorite: !r.isFavorite } : r
        ));
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Hata', 'Favori durumu güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (routeId: string | undefined) => {
    if (!routeId) return;
    
    Alert.alert(
      'Rotayı Sil',
      'Bu rotayı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await routeApi.deleteRoute(routeId);
              setRoutes(routes.filter(route => route.id !== routeId));
            } catch (error) {
              console.error('Error deleting route:', error);
              Alert.alert('Hata', 'Rota silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const filterRoutes = () => {
    let filtered = [...routes];
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(route => route.type === selectedFilter);
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const durationA = parseInt((a.duration || '0').replace(/[^0-9]/g, ''));
          const durationB = parseInt((b.duration || '0').replace(/[^0-9]/g, ''));
          return durationA - durationB;
        });
        break;
      case 'date':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
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
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {[
            { id: 'all', label: 'Tümü', icon: 'list' },
            { id: 'historical', label: 'Tarihi', icon: getTypeIcon('historical') },
            { id: 'nature', label: 'Doğa', icon: getTypeIcon('nature') },
            { id: 'food', label: 'Yemek', icon: getTypeIcon('food') },
            { id: 'shopping', label: 'Alışveriş', icon: getTypeIcon('shopping') },
          ].map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterOption,
                selectedFilter === type.id && styles.selectedFilter,
              ]}
              onPress={() => {
                setSelectedFilter(type.id as FilterType);
                setShowFilterModal(false);
              }}
            >
              <MaterialIcons
                name={type.icon}
                size={24}
                color={selectedFilter === type.id ? '#2D63FF' : '#666'}
              />
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === type.id && styles.selectedFilterText,
                ]}
              >
                {type.label}
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="route" size={48} color="#ddd" />
      <Text style={styles.emptyStateText}>Henüz rota eklemediniz</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add')}
      >
        <Text style={styles.addButtonText}>Yeni Rota Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rotalarım</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSortModal(true)}
          >
            <MaterialIcons name="sort" size={24} color="#2D63FF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilterModal(true)}
          >
            <MaterialIcons name="filter-list" size={24} color="#2D63FF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList<Route>
        data={filterRoutes()}
        renderItem={({ item: route }) => (
          <RouteCard
            route={route}
            onPress={() => handleRoutePress(route.id)}
            onFavorite={() => handleFavorite(route.id)}
            onShare={() => handleShare(route)}
            onDelete={() => handleDelete(route.id)}
          />
        )}
        keyExtractor={item => item.id || Date.now().toString()}
        contentContainerStyle={styles.content}
        ListEmptyComponent={renderEmptyState}
      />

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeHeader: {
    marginBottom: 12,
  },
  routeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  routeStatText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: '#2D63FF',
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  routePoints: {
    marginTop: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointNumber: {
    backgroundColor: '#2D63FF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  pointNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pointDetails: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  pointDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  routeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    marginLeft: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
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