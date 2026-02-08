// File: app/(tabs)/settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/theme';

const playbackSpeeds = [0.5, 1, 1.5, 2];

export default function SettingsScreen() {
  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const savedSpeed = await AsyncStorage.getItem('playbackSpeed');
      const savedLoop = await AsyncStorage.getItem('isLooping');
      const savedShuffle = await AsyncStorage.getItem('isShuffling');
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedTheme = await AsyncStorage.getItem('darkTheme');

      if (savedSpeed) setSpeed(parseFloat(savedSpeed));
      if (savedLoop) setIsLooping(savedLoop === 'true');
      if (savedShuffle) setIsShuffling(savedShuffle === 'true');
      if (savedNotifications) setNotifications(savedNotifications === 'true');
      if (savedTheme) setDarkTheme(savedTheme === 'true');
    }
    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, value.toString());
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    await saveSetting('playbackSpeed', newSpeed);
  };

  const toggleLoop = async () => {
    setIsLooping((prev) => {
      saveSetting('isLooping', !prev);
      return !prev;
    });
  };

  const toggleShuffle = async () => {
    setIsShuffling((prev) => {
      saveSetting('isShuffling', !prev);
      return !prev;
    });
  };

  const toggleNotifications = async () => {
    setNotifications((prev) => {
      saveSetting('notifications', !prev);
      return !prev;
    });
  };

  const toggleTheme = async () => {
    setDarkTheme((prev) => {
      saveSetting('darkTheme', !prev);
      return !prev;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Playback Speed</Text>
      <View style={styles.row}>
        {playbackSpeeds.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => handleSpeedChange(s)}
            style={[styles.button, speed === s && { backgroundColor: Colors.primary }]}
          >
            <Text style={[styles.buttonText, speed === s && { color: '#fff', fontWeight: 'bold' }]}>{s}x</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.heading}>Playback Options</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.optionButton} onPress={toggleLoop}>
          <Text style={styles.optionText}>Loop: {isLooping ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={toggleShuffle}>
          <Text style={styles.optionText}>Shuffle: {isShuffling ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Notifications</Text>
      <View style={styles.row}>
        <Text style={styles.optionText}>App Sounds</Text>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>

      <Text style={styles.heading}>Theme</Text>
      <View style={styles.row}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch value={darkTheme} onValueChange={toggleTheme} />
      </View>

      <Text style={[styles.heading, { marginTop: 30 }]}>App Info</Text>
      <Text style={styles.infoText}>Offline Music Player v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  buttonText: { color: '#333', fontSize: 16 },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  optionText: { fontSize: 16, color: '#333' },
  infoText: { fontSize: 14, color: '#555', marginTop: 6 },
});
