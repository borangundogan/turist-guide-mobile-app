import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

const ROUTE_TYPES = [
  { id: 'historical', label: 'Tarihi', icon: 'account-balance' },
  { id: 'nature', label: 'Doğa', icon: 'park' },
  { id: 'food', label: 'Yemek', icon: 'restaurant' },
  { id: 'shopping', label: 'Alışveriş', icon: 'shopping-bag' },
];

const ROUTE_TAGS = [
  { id: 'family', label: 'Aile Dostu', icon: 'family-restroom' },
  { id: 'accessible', label: 'Engelli Erişimi', icon: 'accessible' },
  { id: 'free', label: 'Ücretsiz', icon: 'money-off' },
  { id: 'parking', label: 'Otopark', icon: 'local-parking' },
  { id: 'public-transport', label: 'Toplu Taşıma', icon: 'directions-bus' },
  { id: 'pet-friendly', label: 'Evcil Hayvan Dostu', icon: 'pets' },
  { id: 'photo-spot', label: 'Fotoğraf Noktası', icon: 'photo-camera' },
  { id: 'wifi', label: 'Ücretsiz WiFi', icon: 'wifi' },
];

type RoutePoint = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    duration: string;
    order: number;
  };

const AddRouteScreen = () => {
  const navigation = useNavigation();
  const [routeName, setRouteName] = useState('');
  const [selectedType, setSelectedType] = useState(ROUTE_TYPES[0].id);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      latitude,
      longitude,
      title: `Nokta ${points.length + 1}`,
      description: '',
      duration: '30',
      order: points.length,
    };
    setPoints([...points, newPoint]);
    setSelectedPoint(newPoint);
  };

  const updatePointDetails = (id: string, updates: Partial<RoutePoint>) => {
    setPoints(points.map(point => 
      point.id === id ? { ...point, ...updates } : point
    ));
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(point => point.id !== id));
    setSelectedPoint(null);
  };

  const handleCoverPhotoSelect = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    }, (response) => {
      if (response.assets && response.assets[0]?.uri) {
        setCoverPhoto(response.assets[0].uri);
      }
    });
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = (asDraft: boolean = false) => {
    if (!routeName.trim() && !asDraft) {
      Alert.alert('Hata', 'Lütfen rota ismi girin');
      return;
    }
    if (points.length < 2 && !asDraft) {
      Alert.alert('Hata', 'En az 2 nokta eklemelisiniz');
      return;
    }

    // TODO: Save route data
    const routeData = {
      name: routeName,
      type: selectedType,
      points: points.sort((a, b) => a.order - b.order),
      coverPhoto,
      tags: selectedTags,
      isDraft: asDraft,
    };
    
    console.log('Saving route:', routeData);
    Alert.alert('Başarılı', asDraft ? 'Rota taslak olarak kaydedildi' : 'Rota kaydedildi');
    navigation.goBack();
  };

  const renderPointsList = () => (
    <FlatList
      data={points}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.pointItem,
            selectedPoint?.id === item.id && styles.selectedPointItem,
          ]}
          onPress={() => setSelectedPoint(item)}
        >
          <View style={styles.pointItemContent}>
            <MaterialIcons name="drag-handle" size={24} color="#666" />
            <Text style={styles.pointItemTitle}>{item.title}</Text>
            <Text style={styles.pointItemDuration}>{item.duration} dk</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );

  const renderTagsModal = () => (
    <Modal
      visible={showTagsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTagsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rota Etiketleri</Text>
            <TouchableOpacity onPress={() => setShowTagsModal(false)}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {ROUTE_TAGS.map(tag => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagOption,
                  selectedTags.includes(tag.id) && styles.selectedTag,
                ]}
                onPress={() => handleTagToggle(tag.id)}
              >
                <MaterialIcons
                  name={tag.icon}
                  size={24}
                  color={selectedTags.includes(tag.id) ? '#2D63FF' : '#666'}
                />
                <Text
                  style={[
                    styles.tagLabel,
                    selectedTags.includes(tag.id) && styles.selectedTagLabel,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Yeni Rota Ekle</Text>
        <TouchableOpacity
          style={styles.draftButton}
          onPress={() => handleSave(true)}
        >
          <MaterialIcons name="save" size={24} color="#2D63FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Rota İsmi"
          value={routeName}
          onChangeText={setRouteName}
        />

        <TouchableOpacity
          style={styles.coverPhotoContainer}
          onPress={handleCoverPhotoSelect}
        >
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
          ) : (
            <View style={styles.coverPhotoPlaceholder}>
              <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
              <Text style={styles.coverPhotoText}>Kapak Fotoğrafı Ekle</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Rota Türü</Text>
        <View style={styles.typeOptions}>
          {ROUTE_TYPES.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                selectedType === type.id && styles.selectedType,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <MaterialIcons
                name={type.icon}
                size={24}
                color={selectedType === type.id ? '#2D63FF' : '#666'}
              />
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.id && styles.selectedTypeLabel,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.tagsButton}
          onPress={() => setShowTagsModal(true)}
        >
          <View style={styles.tagsButtonContent}>
            <MaterialIcons name="local-offer" size={24} color="#2D63FF" />
            <Text style={styles.tagsButtonText}>
              {selectedTags.length > 0
                ? `${selectedTags.length} Etiket Seçildi`
                : 'Etiket Ekle'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Konumlar</Text>
        <Text style={styles.hint}>Haritaya tıklayarak nokta ekleyin</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 41.0082,
              longitude: 28.9784,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {points.map((point) => (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.title}
                description={point.description}
                onPress={() => setSelectedPoint(point)}
              />
            ))}
          </MapView>
        </View>

        {points.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Nokta Sıralaması</Text>
            <Text style={styles.hint}>Sıralamayı değiştirmek için basılı tutup sürükleyin</Text>
            {renderPointsList()}
          </>
        )}

        {selectedPoint && (
          <View style={styles.pointDetails}>
            <View style={styles.pointHeader}>
              <Text style={styles.pointTitle}>Nokta Detayları</Text>
              <TouchableOpacity
                onPress={() => removePoint(selectedPoint.id)}
                style={styles.removeButton}
              >
                <MaterialIcons name="delete" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Başlık"
              value={selectedPoint.title}
              onChangeText={(text) =>
                updatePointDetails(selectedPoint.id, { title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Açıklama"
              value={selectedPoint.description}
              onChangeText={(text) =>
                updatePointDetails(selectedPoint.id, { description: text })
              }
              multiline
            />
            <View style={styles.durationInput}>
              <Text style={styles.durationLabel}>Tahmini Kalış Süresi (dakika)</Text>
              <TextInput
                style={styles.durationTextInput}
                keyboardType="numeric"
                value={selectedPoint.duration}
                onChangeText={(text) =>
                  updatePointDetails(selectedPoint.id, { duration: text.replace(/[^0-9]/g, '') })
                }
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave(false)}
        >
          <Text style={styles.saveButtonText}>Rotayı Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderTagsModal()}
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
  backButton: {
    padding: 8,
  },
  draftButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  coverPhotoContainer: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedType: {
    backgroundColor: '#e6edff',
  },
  typeLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  selectedTypeLabel: {
    color: '#2D63FF',
  },
  tagsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  tagsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2D63FF',
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  pointItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pointItemActive: {
    backgroundColor: '#f0f0f0',
  },
  selectedPointItem: {
    borderColor: '#2D63FF',
  },
  pointItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointItemTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  pointItemDuration: {
    fontSize: 14,
    color: '#666',
  },
  pointDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  durationInput: {
    marginBottom: 16,
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  durationTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: '#e6edff',
  },
  tagLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  selectedTagLabel: {
    color: '#2D63FF',
  },
  saveButton: {
    backgroundColor: '#2D63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddRouteScreen; 