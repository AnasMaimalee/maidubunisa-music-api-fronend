// File: src/screens/AlbumDetailScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import SongCard from '../components/SongCard';
import api from '../api/api';
import { ThemeContext } from '../context/ThemeContext';
import colors from '../styles/colors';

export default function AlbumDetailScreen({ route, navigation }) {
  const { albumId } = route.params;
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get(`/albums/${albumId}/songs`);
        setSongs(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [albumId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors[theme].background }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            onPress={() => navigation.navigate('Player', { song })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
