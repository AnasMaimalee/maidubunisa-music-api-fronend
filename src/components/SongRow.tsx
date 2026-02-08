// SongRow.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Song } from '@/src/components/SongCard';

interface Props {
  song: Song;
  selected: boolean;
  onToggle: (id: string) => void;
  animation: Animated.SharedValue<number>;
}

export default function SongRow({ song, selected, onToggle, animation }: Props) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animation.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        if (!selected) animation.value = withSpring(1.3, { damping: 5, stiffness: 180 }, () => {
          animation.value = withSpring(1);
        });
        onToggle(song.id);
      }}
    >
      <Text style={{ flex: 1 }}>{song.title}</Text>
      <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          {
            backgroundColor: selected ? '#1DB954' : 'transparent',
            borderWidth: 1,
            borderColor: '#1DB954',
          },
        ]}
      >
        {selected && <IconSymbol name="check" size={12} color="#fff" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  circle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
});
