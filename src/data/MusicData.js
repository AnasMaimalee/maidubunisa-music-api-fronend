// File: src/data/musicData.js

export const albums = [
  {
    id: 'album-1',
    title: 'Faith & Harmony',
    releaseDate: '2023-06-01',
    songs: [
      {
        id: 'song-1',
        title: 'Morning Prayer',
        filePath: require('../assets/songs/morning_prayer.mp3'),
        artist: 'Maidubunisa',
        artwork: require('../assets/artwork/album1.jpg'),
      },
      {
        id: 'song-2',
        title: 'Evening Blessings',
        filePath: require('../assets/songs/evening_blessings.mp3'),
        artist: 'Maidubunisa',
        artwork: require('../assets/artwork/album1.jpg'),
      },
    ],
  },
  {
    id: 'album-2',
    title: 'Peace & Light',
    releaseDate: '2022-12-15',
    songs: [
      {
        id: 'song-3',
        title: 'Calm Mind',
        filePath: require('../assets/songs/calm_mind.mp3'),
        artist: 'Maidubunisa',
        artwork: require('../assets/artwork/album2.jpg'),
      },
    ],
  },
];
