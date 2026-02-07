import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Album } from '../types/Album';

interface AlbumCardProps {
  album: Album;
  onPress: () => void;
}

const placeholderImages = [
  'https://picsum.photos/200/200?random=1',
  'https://picsum.photos/200/200?random=2',
  'https://picsum.photos/200/200?random=3',
  'https://picsum.photos/200/200?random=4',
  'https://picsum.photos/200/200?random=5',
];

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onPress }) => {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme ?? 'light';

  const imageUrl =
    album.cover_url && album.cover_url.length > 0
      ? album.cover_url
      : placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

  const cardColor = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const shadowColor = theme === 'dark' ? '#000' : '#ccc';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#333333';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        { backgroundColor: cardColor, shadowColor },
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: textColor }]}
          numberOfLines={1}
        >
          {album.title}
        </Text>

        {album.release_date && (
          <Text style={[styles.subTitle, { color: textColor }]}>
            {album.release_date}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AlbumCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 12,
    marginRight: 16,
    paddingBottom: 8,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
});
