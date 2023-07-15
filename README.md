# Node Musixmatch API ✨🎵

An advanced API library for seamless integration with Musixmatch. 🎶

## API Methods 🚀

This method requires authentication. 🔐

What does the Musixmatch API do? 🤔

The Musixmatch API allows you to read objects from our huge 100% licensed lyrics database. 📚

To make your life easier, we are providing you with one or more examples to show you how it could work in the wild. You'll find both the API request and API response in all the available output formats for each API call. Follow the links below for the details. 📝🔗

The current API version is 1.1, and the root URL is located at [https://api.musixmatch.com/ws/1.1/](https://api.musixmatch.com/ws/1.1/). 🌐

Supported input parameters can be found on the page [Input Parameters](https://developer.musixmatch.com/documentation/input-parameters). Use UTF-8 to encode arguments when calling API methods. 📥

Every response includes a `status_code`. You can consult a list of all status codes at [Status Codes](https://developer.musixmatch.com/documentation/status-codes). 📊

## Input Parameters 📝

### Use UTF-8 to encode arguments. These are the supported input parameters:

#### AUTHENTICATION 🔑

- `apikey` - Your Personal API Key. You can set the API Key by using the `setApiKey()` method or in the constructor parameter.

#### OBJECTS 📌

- `track_id` - Musixmatch track ID
- `artist_id` - Musixmatch artist ID
- `album_id` - Musixmatch album ID
- `commontrack_id` - Musixmatch commontrack ID
- `track_mbid` - MusicBrainz recording or track ID
- `artist_mbid` - MusicBrainz artist ID
- `album_mbid` - MusicBrainz release ID

#### QUERYING 🔍

- `q_track` - Search for a text string among song titles
- `q_artist` - Search for a text string among artist names
- `q_lyrics` - Search for a text string among lyrics
- `q` - Search for a text string among song titles, artist names, and lyrics

#### FILTERING 🧹

- `f_has_lyrics` - Filter by objects with available lyrics
- `f_is_instrumental` - Filter instrumental songs
- `f_has_subtitle` - Filter by objects with available subtitles
- `f_music_genre_id` - Filter by objects with a specific music category
- `f_subtitle_length` - Filter subtitles by a given duration in seconds
- `f_subtitle_length_max_deviation` - Apply a deviation to a given subtitle duration (in seconds)
- `f_lyrics_language` - Filter the tracks by lyrics language
- `f_artist_id` - Filter by objects with a given Musixmatch artist ID
- `f_artist_mbid` - Filter by objects with a given MusicBrainz artist ID

#### GROUPING 🧩

- `g_commontrack` - Group a track result set by commontrack_id

#### SORTING 🔄

- `s_track_rating` - Sort the results by our popularity index for tracks. Possible values are ASC | DESC
- `s_track_release_date` - Sort the results by track release date. Possible values are ASC | DESC
- `s_artist_rating` - Sort the results by our popularity index for artists. Possible values are ASC | DESC

#### RESULT SET PAGINATION 📄

- `page` - Request a specific result page (default=1)
- `page_size` - Specify the number of items per result page (default=10, range is 1 to 100)

#### OUTPUT FORMAT 📋

- `subtitle_format` - Desired output format for the subtitle body. Possible values are LRC|DFXP|STLEDU. Defaults to LRC.

#### LOCALIZATION 🌍

- `country` - The country code of the desired country.

## Example Usage 🌟

```js
const { Musixmatch } = require('node-musixmatch-api');
const mxm = new Musixmatch('YourAPIKeyHere');

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
  });
```

## AutoComplete 🆒

Most of the functions have the AutoComplete feature. 🤩

Some of them don't have AutoComplete. In that case, you can make your own AutoComplete Interface by using the `BaseInterface` interface. (Only works with TypeScript) 💡

```ts
const { BaseInterface, Musixmatch } = require('node-musixmatch-api');

const mxm = new Musixmatch('APIKEYHERE');

interface AutoCompleteInterface extends BaseInterface {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      suggestions: string[]; // Example property for AutoComplete suggestions
    };
  };
}

const getTrackInfo = async (): AutoCompleteInterface => {
  const l = await mxm.trackSearch(
    'q_artist=Money Man Lil Baby',
    'q_track=24',
    's_track_rating=78',
    'q=VPN'
  );
  return l;
};
```

Feel free to explore different methods 🌟 with your creativity! ✨
