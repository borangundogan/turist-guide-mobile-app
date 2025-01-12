import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ROUTE_COORDINATES = [
  {
    latitude: 41.0370,
    longitude: 28.9850,
    title: 'Taksim Square',
    description: 'Starting point',
  },
  {
    latitude: 41.0256,
    longitude: 28.9744,
    title: 'Galata Tower',
    description: 'Historical tower with panoramic views',
  },
  {
    latitude: 41.0186,
    longitude: 28.9709,
    title: 'Eminönü',
    description: 'Historic waterfront district',
  },
  {
    latitude: 41.0086,
    longitude: 28.9802,
    title: 'Sultanahmet Square',
    description: 'End point - Historic center',
  },
];

const TRANSPORT_OPTIONS = [
  {
    type: 'bus',
    icon: 'directions-bus',
    segments: [
      {
        from: 'Taksim Square',
        to: 'Galata Tower',
        transport: 'Bus 35T',
        duration: '15 min',
        instructions: 'Take Bus 35T from Taksim Square, get off at Galata Tower stop',
      },
      {
        from: 'Galata Tower',
        to: 'Eminönü',
        transport: 'Walking',
        duration: '12 min',
        instructions: 'Walk down through Galata Bridge to Eminönü',
      },
      {
        from: 'Eminönü',
        to: 'Sultanahmet Square',
        transport: 'Tram T1',
        duration: '8 min',
        instructions: 'Take Tram T1 from Eminönü, get off at Sultanahmet stop',
      },
    ],
    totalDuration: '35 min',
    price: '15.50 TL',
  },
  {
    type: 'metro',
    icon: 'subway',
    segments: [
      {
        from: 'Taksim Square',
        to: 'Şişhane',
        transport: 'M2 Metro',
        duration: '5 min',
        instructions: 'Take M2 Metro from Taksim, get off at Şişhane station',
      },
      {
        from: 'Şişhane',
        to: 'Karaköy',
        transport: 'Walking',
        duration: '10 min',
        instructions: 'Walk down to Karaköy tram station',
      },
      {
        from: 'Karaköy',
        to: 'Sultanahmet Square',
        transport: 'Tram T1',
        duration: '12 min',
        instructions: 'Take Tram T1 from Karaköy, get off at Sultanahmet stop',
      },
    ],
    totalDuration: '27 min',
    price: '18.00 TL',
  },
  {
    type: 'walking',
    icon: 'directions-walk',
    segments: [
      {
        from: 'Taksim Square',
        to: 'Galata Tower',
        transport: 'Walking',
        duration: '20 min',
        instructions: 'Walk down İstiklal Street towards Galata Tower',
      },
      {
        from: 'Galata Tower',
        to: 'Eminönü',
        transport: 'Walking',
        duration: '15 min',
        instructions: 'Walk through Galata Bridge to Eminönü',
      },
      {
        from: 'Eminönü',
        to: 'Sultanahmet Square',
        transport: 'Walking',
        duration: '18 min',
        instructions: 'Walk through Sirkeci to Sultanahmet Square',
      },
    ],
    totalDuration: '53 min',
    price: '0 TL',
  },
];

const DestinationScreen = () => {
  const [selectedTransport, setSelectedTransport] = React.useState(TRANSPORT_OPTIONS[0]);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* @ts-ignore */}
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Route Details</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.0256,
            longitude: 28.9744,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {ROUTE_COORDINATES.map((coordinate, index) => (
            <Marker
              key={index}
              coordinate={coordinate}
              title={coordinate.title}
              description={coordinate.description}
            />
          ))}
          <Polyline
            coordinates={ROUTE_COORDINATES}
            strokeColor="#2D63FF"
            strokeWidth={3}
          />
        </MapView>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Transport Options</Text>
        <View style={styles.transportOptions}>
          {TRANSPORT_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.transportOption,
                selectedTransport.type === option.type && styles.selectedTransport,
              ]}
              onPress={() => setSelectedTransport(option)}
            >
              {/* @ts-ignore */}
              <MaterialIcons
                name={option.icon}
                size={24}
                color={selectedTransport.type === option.type ? '#2D63FF' : '#666'}
              />
              <Text style={styles.transportTime}>{option.totalDuration}</Text>
              <Text style={styles.transportPrice}>{option.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.segmentsList}>
          {selectedTransport.segments.map((segment, index) => (
            <View key={index} style={styles.segment}>
              <View style={styles.segmentHeader}>
                <Text style={styles.segmentTransport}>{segment.transport}</Text>
                <Text style={styles.segmentDuration}>{segment.duration}</Text>
              </View>
              <Text style={styles.segmentRoute}>
                {segment.from} → {segment.to}
              </Text>
              <Text style={styles.segmentInstructions}>{segment.instructions}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Navigation</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  transportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  transportOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  selectedTransport: {
    backgroundColor: '#e6edff',
  },
  transportTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  transportPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  segmentsList: {
    flex: 1,
  },
  segment: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  segmentTransport: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D63FF',
  },
  segmentDuration: {
    fontSize: 14,
    color: '#666',
  },
  segmentRoute: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  segmentInstructions: {
    fontSize: 13,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#2D63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DestinationScreen; 