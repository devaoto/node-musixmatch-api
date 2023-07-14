const { Musixmatch } = require('../dist');

const mxm = new Musixmatch('18d9fbcac52e279a77b616137280b1eb');

mxm
  .trackSearch(
    'q_artist=Money Man Lil Baby',
    'q_track=24',
    's_track_rating=78',
    'q=VPN'
  )
  .then((l) => {
    console.log(l.message.body.track_list[0].track.album_name);
  });
mxm.chartArtistGet('country=au', 'page=1', 'page_size=3').then((s) => {
  console.log(s.message.body.artist_list[1].artist.artist_name);
});
