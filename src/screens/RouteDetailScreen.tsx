import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RouteDetailScreen = () => {
  const navigation = useNavigation();

  const schedule = [
    {
      time: '09 AM',
      title: 'Ngurah Rai International Airport',
      subtitle: 'Arrival from Makassar',
      image: 'https://source.unsplash.com/300x200/?airport',
    },
    {
      time: '12 PM',
      title: 'Check-in Hotel',
      subtitle: 'Alila Villas Uluwatu',
      image: 'https://source.unsplash.com/300x200/?hotel',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Travelling to Bali</Text>
      </View>

      <View style={styles.routeInfo}>
        <Text style={styles.routeFrom}>Makassar → Bali</Text>
        <View style={styles.tags}>
          <View style={[styles.tag, styles.tagRed]}>
            <Text style={styles.tagText}>4 Days</Text>
          </View>
          <View style={[styles.tag, styles.tagBlue]}>
            <Text style={styles.tagText}>7 Spots</Text>
          </View>
          <View style={[styles.tag, styles.tagPurple]}>
            <Text style={styles.tagText}>3 Restaurant</Text>
          </View>
        </View>
      </View>

      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>October, 2024</Text>
          <View style={styles.calendarControls}>
            <TouchableOpacity>
              <Text style={styles.calendarControl}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.calendarControl}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daysContainer}
        >
          {[20, 21, 22, 23, 24, 25, 26].map((day, index) => (
            <TouchableOpacity 
              key={day}
              style={[
                styles.dayItem,
                index === 2 && styles.dayItemActive
              ]}
            >
              <Text style={[
                styles.dayText,
                index === 2 && styles.dayTextActive
              ]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.schedule}>
        {schedule.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{item.time}</Text>
            <View style={styles.scheduleContent}>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                <Text style={styles.scheduleSubtitle}>{item.subtitle}</Text>
              </View>
              <Image 
                source={{ uri: item.image }}
                style={styles.scheduleImage}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  routeInfo: {
    padding: 20,
  },
  routeFrom: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  tags: {
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagRed: {
    backgroundColor: '#FFE8E8',
  },
  tagBlue: {
    backgroundColor: '#E8F1FF',
  },
  tagPurple: {
    backgroundColor: '#F3E8FF',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendar: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  calendarControls: {
    flexDirection: 'row',
    gap: 15,
  },
  calendarControl: {
    fontSize: 18,
    color: '#666666',
  },
  daysContainer: {
    flexDirection: 'row',
  },
  dayItem: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dayItemActive: {
    backgroundColor: '#2D63FF',
  },
  dayText: {
    fontSize: 14,
    color: '#666666',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  schedule: {
    flex: 1,
    padding: 20,
  },
  scheduleItem: {
    marginBottom: 20,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  scheduleContent: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
  },
  scheduleInfo: {
    flex: 1,
    marginRight: 15,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  scheduleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});

export default RouteDetailScreen; 