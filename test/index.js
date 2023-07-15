const { Musixmatch } = require('../dist');

const mxm = new Musixmatch('APIKEY');

let trackId;

mxm
  .trackSearch(
    'q_artist=Money Man Lil Baby',
    'q_track=24',
    's_track_rating=78',
    'q=VPN'
  )
  .then((l) => {
    console.log(l.message.body.track_list[0].track.album_name);
    trackId = l.message.body.track_list[0].track.track_id;
  })
  .catch((err) => console.log(err));
mxm
  .chartArtistGet('country=au', 'page=1', 'page_size=3')
  .then((s) => {
    console.log(s.message.body.artist_list[1].artist.artist_name);
  })
  .catch((err) => console.log(err));
mxm
  .matcherTrackGet('q_artist=MC Blue', 'q_track=Khankir Chele')
  .then((k) => {
    console.log(k.message.body.track.commontrack_id);
  })
  .catch((err) => console.log(err));
