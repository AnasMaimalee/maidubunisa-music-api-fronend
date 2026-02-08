import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const playbackSpeeds = [0.5, 1, 1.5, 2];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const savedSpeed = await AsyncStorage.getItem('playbackSpeed');
        const savedLoop = await AsyncStorage.getItem('isLooping');
        const savedShuffle = await AsyncStorage.getItem('isShuffling');
        const savedNotifications = await AsyncStorage.getItem('notifications');

        if (savedSpeed) setSpeed(parseFloat(savedSpeed));
        if (savedLoop !== null) setIsLooping(savedLoop === 'true');
        if (savedShuffle !== null) setIsShuffling(savedShuffle === 'true');
        if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
      } catch (error) {
        console.warn('Failed to load settings:', error);
      }
    }
    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.warn('Failed to save setting:', error);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    await saveSetting('playbackSpeed', newSpeed);
  };

  const toggleLoop = async () => {
    const newVal = !isLooping;
    setIsLooping(newVal);
    await saveSetting('isLooping', newVal);
  };

  const toggleShuffle = async () => {
    const newVal = !isShuffling;
    setIsShuffling(newVal);
    await saveSetting('isShuffling', newVal);
  };

  const toggleNotifications = async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    await saveSetting('notifications', newVal);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#1DB954" barStyle="light-content" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Playback Speed */}
        <Text style={styles.heading}>Playback Speed</Text>
        <View style={styles.row}>
          {playbackSpeeds.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => handleSpeedChange(s)}
              style={[
                styles.speedButton,
                speed === s && styles.speedButtonActive,
              ]}
            >
              <Text style={[
                styles.speedButtonText,
                speed === s && styles.speedButtonTextActive,
              ]}>
                {s}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Playback Options */}
        <Text style={styles.heading}>Playback Options</Text>
        
        <TouchableOpacity style={styles.optionCard} onPress={toggleLoop}>
          <View style={styles.optionLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="repeat" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.optionTitle}>Loop</Text>
              <Text style={styles.optionSubtitle}>Repeat current playlist</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              { color: isLooping ? '#1DB954' : '#666' }
            ]}>
              {isLooping ? 'On' : 'Off'}
            </Text>
            <MaterialIcons 
              name="arrow-forward-ios" 
              size={16} 
              color="#ccc" 
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={toggleShuffle}>
          <View style={styles.optionLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="shuffle" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.optionTitle}>Shuffle</Text>
              <Text style={styles.optionSubtitle}>Play songs in random order</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              { color: isShuffling ? '#1DB954' : '#666' }
            ]}>
              {isShuffling ? 'On' : 'Off'}
            </Text>
            <MaterialIcons 
              name="arrow-forward-ios" 
              size={16} 
              color="#ccc" 
            />
          </View>
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={styles.heading}>Notifications</Text>
        <View style={styles.switchCard}>
          <View style={styles.optionLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="notifications" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.optionTitle}>App Sounds</Text>
              <Text style={styles.optionSubtitle}>Enable notification sounds</Text>
            </View>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={toggleNotifications}
            trackColor={{ true: '#1DB954' }}
            thumbColor="#fff"
          />
        </View>

        {/* Footer - Now scrolls naturally */}
        <View style={styles.footerCard}>
          <Text style={styles.footerDesigner}>App Designer</Text>
          <Text style={styles.footerCompany}>CodeBridge Technology</Text>
          
          <View style={styles.contactSection}>
            <View style={styles.contactItem}>
              <View style={[styles.contactIcon, styles.whatsappIcon]}>
                <FontAwesome name="whatsapp" size={20} color="#fff" />
              </View>
              <Text style={styles.contactText}>+2348123442014</Text>
            </View>

            <View style={styles.contactItem}>
              <View style={[styles.contactIcon, styles.emailIcon]}>
                <MaterialIcons name="email" size={20} color="#fff" />
              </View>
              <Text style={styles.contactText}>anasment6@gmail.com</Text>
            </View>
          </View>

          <Text style={styles.versionText}>Mai Dubun Isa Music Player v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  
  header: {
    backgroundColor: '#1DB954',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },

  scrollContent: { 
    padding: 24, 
    paddingBottom: 40 
  },
  
  heading: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 16, 
    color: '#1a1a1a',
    marginTop: 8 
  },
  
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 24 
  },
  
  speedButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  speedButtonActive: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
    shadowColor: '#1DB954',
    shadowOpacity: 0.3,
  },
  speedButtonText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#666' 
  },
  speedButtonTextActive: { 
    color: '#fff' 
  },

  optionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  switchCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  optionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1a1a1a',
    marginBottom: 2 
  },
  optionSubtitle: { 
    fontSize: 14, 
    color: '#666' 
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: { 
    fontSize: 16, 
    fontWeight: '500' 
  },

  // Footer now inside ScrollView - scrolls naturally
  footerCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginTop: 32,
    marginBottom: 42,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  footerDesigner: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  footerCompany: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1DB954',
    marginBottom: 20,
  },
  contactSection: {
    gap: 12,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    backgroundColor: '#28a745',
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  emailIcon: {
    backgroundColor: '#D44638',
  },
  contactText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
});
