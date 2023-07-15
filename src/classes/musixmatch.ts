'use strict';

if (typeof Promise === 'undefined' || !Promise) {
  require('es6-promise').Promise;
}

import axios, { AxiosResponse } from 'axios';
import * as expectations from './expectations';
const { MXMException, MusixmatchError } = expectations;
import {
  TrackGet,
  TrackSearch,
  ChartArtists,
  ChartTracks,
  TrackLyrics,
  TrackMood,
  TrackRichSync,
  TrackSnippet,
  TrackSubtitle,
  MatcherLyrics,
  MatcherSubtitle,
  MatcherTrack,
} from '../interfaces';

/**
 * Represents the Musixmatch API wrapper.
 */
class Musixmatch {
  private apikey: string | undefined;
  private baseUrl: string = 'https://api.musixmatch.com/ws/1.1/';

  /**
   * Constructs a new instance of the Musixmatch class.
   * @param apiKey - The API Key.
   */
  constructor(apiKey?: string) {
    this.apikey = apiKey;
  }

  /**
   * Sets the API Key.
   * @param apiKey - The API Key.
   */
  setApiKey(apiKey?: string): void {
    this.apikey = apiKey;
  }

  /**
   * Calls the Musixmatch API.
   * @param method - The HTTP method (get, post, or others).
   * @param apiMethod - The API method.
   * @param params - The parameters.
   * @returns A promise that resolves to the API response.
   */
  private async _apiCall<T>(
    method: string,
    apiMethod: string,
    params?: T
  ): Promise<any> {
    const url = `${this.baseUrl}${apiMethod}`;
    const options = {
      params: params
        ? { ...params, apikey: this.apikey }
        : { apikey: this.apikey },
    };

    try {
      const response: AxiosResponse = await axios.request({
        method,
        url,
        params: options.params,
      });
      const { status_code } = response.data.message.header;

      if (status_code === 200) {
        return response.data;
      } else {
        const hint = response.data.message.header.hint || null;
        throw new MXMException(status_code, `${response.config.url}`, hint);
      }
    } catch (error: any) {
      if (error.response) {
        throw new MusixmatchError(
          `Status code: ${error.response.status}\nHTTP error occurred: ${error.response.data}`
        );
      } else if (error.code === 'ECONNREFUSED') {
        throw new MusixmatchError('Connection refused');
      } else {
        throw new MusixmatchError(error.message);
      }
    }
  }

  /**
   * Get a track info from Musixmatch database: title, artist, isrc(s), instrumental flag.
   * @param params - The parameters.
   * @returns A promise that resolves to the track information.
   *
   * Parameters:
   * - **`track_isrc`** - A valid ISRC identifier
   * - **`commontrack_id`** - The Musixmatch commontrack id
   */
  async trackGet<T extends string>(...params: T[]): Promise<TrackGet> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.get', queryParams);
  }

  /**
   * Search for track in Musixmatch database.
   * @param params - The parameters.
   * @returns A promise that resolves to the search results.
   *
   * parameters:
   * - q_track - The song title
   * - q_artist - The song artist
   * - q_lyrics - Any word in the lyrics
   * - q_track_artist - Any word in the song title or artist name
   * - q_writer Search among writers
   * - q Any word in the song title or artist name or lyrics
   * - f_artist_id When set, filter by this artist id
   * - f_music_genre_id When set, filter by this music category id
   * - f_lyrics_language Filter by the lyrics language (en,it,..)
   * - f_has_lyrics When set, filter only contents with lyrics
   * - f_track_release_group_first_release_date_min When set, filter the tracks with release date newer than value, format is YYYYMMDD
   * - f_track_release_group_first_release_date_max When set, filter the tracks with release date older than value, format is YYYYMMDD
   * - s_artist_rating Sort by our popularity index for artists (asc|desc)
   * - s_track_rating Sort by our popularity index for tracks (asc|desc)
   * - quorum_factor Search only a part of the given query string.Allowed range is (0.1 – 0.9)
   * - page Define the page number for paginated results
   * - page_size Define the page size for paginated results. Range is 1 to 100.
   */
  async trackSearch<T extends string>(...params: T[]): Promise<TrackSearch> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.search', queryParams);
  }

  /**
   * This function provides you the list of the top artists of a given country.
   * @param params - The parameters
   * @returns A promise that resolves to the chart artist.
   *
   * parameters:
   * - country - A valid country code (default US)
   * - page - Define the page number for paginated results
   * - page_size - Define the page size for paginated results. Range is 1 to 100.
   * - format - Decide the output type (json or xml) NOTE: JSON has autocomplete.
   */
  async chartArtistGet<T extends string>(
    ...params: T[]
  ): Promise<ChartArtists> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'chart.artists.get', queryParams);
  }

  /**
   * - This api provides you the list of the top songs of a given country.
   * @param params - The parameters
   * @returns A promise that resolves to the chart tracks.
   *
   * parameters:
   * countryA valid 2 letters country code (default US). Set XW as worldwide
   * - pageDefine the page number for paginated results
   * - page_size - Define the page size for paginated results. Range is 1 to 100.
   * - chart_name Select among available charts:
   *    top : editorial chart
   *
   *    hot : Most viewed lyrics in the last 2 hours
   *
   *    mxmweekly : Most viewed lyrics in the last 7 days
   *
   *    mxmweekly_new : Most viewed lyrics in the last 7 days limited to new releases only
   * - f_has_lyrics When set, filter only contents with lyrics
   */
  async chartTracksGet<T extends string>(...params: T[]): Promise<ChartTracks> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'chart.tracks.get', queryParams);
  }

  /**
   * Get the lyrics of a track.
   *
   * Make sure the fullfil the country restriction you recieve within every copyrighted content>
   * @param params - The parameters
   * @returns A promise that resolves to the track lyrics.
   *
   * parameters:
   * - track_id - The Musixmatch track id
   * - commontrack_id - The Musixmatch commontrack id
   */
  async trackLyricsGet<T extends string>(...params: T[]): Promise<TrackLyrics> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.get', queryParams);
  }

  /**
   * Submit a lyrics to Musixmatch database.
   * Use this api to submit lyrics to Musixmatch database. Musixmatch can only add lyrics if we already have the song meta-data. Musixmatch will validate every submission and in case, make it available through Musixmatch api to Musixmatch customers. The lyrics have to be submitted according to [Musixmatch Guidelines](https://community.musixmatch.com/guidelines?lng=en-US)
   * @param params - The parameters
   * @returns - A promise that resolves to the lyrics publish.
   *
   * parameters:
   * - commontrack_id - A valid commontrack_id
   * - track_isrc - A valid isrc
   * - lyrics_body - The lyrics
   */
  async trackLyricsPost<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('post', 'track.lyrics.post', queryParams);
  }

  /**
   * Get the mood list (and raw value that generated it) of a lyrics
   * @param params - The parameters
   * @returns - A promise that resolves to the track mood.
   *
   * parameters:
   * - commontrack_id - The Musixmatch track id
   * - track_isrc - A valid ISRC identifier
   */
  async trackLyricsMoodGet<T extends string>(
    ...params: T[]
  ): Promise<TrackMood> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.mood.get', queryParams);
  }

  /**
   * Get the snippet for a given track.
   *
   * A lyrics snippet is a very short representation of a song lyrics. It’s usually twenty to a hundred characters long and it’s calculated extracting a sequence of words from the lyrics.
   * @param params - The parameters
   * @returns - A promise that resolves to the track snippet
   *
   * parameters:
   * - track_id - The musixmatch track id
   */
  async trackSnippetGet<T extends string>(
    ...params: T[]
  ): Promise<TrackSnippet> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.snippet.get', queryParams);
  }

  /**
   * Retreive the subtitle of a track.
   *
   * Return the subtitle of a track in LRC or DFXP format.
   *
   * Refer to Wikipedia LRC format page or DFXP format on W3c for format specifications.
   *
   * Make sure the fullfil the country restriction you recieve within every copyrighted content.
   * @param params - The parameters
   * @returns A promise that resolves to the track subtitle.
   *
   * parameters:
   * - commontrack_id - The Musixmatch commontrack id
   * - subtitle_format - The format of the subtitle (lrc,dfxp,stledu). Default to lrc
   * - f_subtitle_length - The desired length of the subtitle (seconds)
   * - f_subtitle_length_max_deviation - The maximum deviation allowed from the f_subtitle_length (seconds)
   */
  async trackSubtitleGet<T extends string>(
    ...params: T[]
  ): Promise<TrackSubtitle> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.subtitle.get', queryParams);
  }

  /**
   * Get the Rich sync for a track
   *
   * A rich sync is an enhanced version of the standard sync which allows:
   *
   * position offset by single characther
   * - endless formatting options at single char level
   * - multiple concurrent voices
   * - multiple scrolling direction
   * @param params - The parameters
   * @returns A promise that resolves to the track rich sync.
   *
   * parameters:
   * - track_id - The musixmatch track id
   * - f_richsync_length - The desired length of the sync (seconds)
   * - f_richsync_length_max_deviation - The maximum deviation allowed from the f_sync_length (seconds)
   */
  async trackRichSyncGet<T extends string>(
    ...params: T[]
  ): Promise<TrackRichSync> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.richsync.get', queryParams);
  }

  /**
   * Get a translated lyrics for a given language
   * @param params - The parameters
   * @returns - A promise that resolves to the Lyrics Translation
   *
   * parameters:
   * - selected_languageThe language of the translated lyrics (ISO 639-1)
   * - min_completed - Teal from 0 to 1. If present, only the tracks with a translation ratio over this specific value, for a given language, are returned Set it to 1 for completed translation only, to 0.7 for a mimimum of 70% complete translation.
   * - commontrack_id - The Musixmatch commontrack id
   * - track_id - The Musixmatch track id
   * - track_isrc - A valid ISRC identifier
   * - track_mbid - The musicbrainz recording id
   */
  async trackLyricsTranslationGet<T extends string>(
    ...params: T[]
  ): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.translation.get', queryParams);
  }

  /**
   * Get a translated subtitle for a given language
   * @param params - The parameters
   * @returns - A promise that resolves to the track subtitle translation.
   *
   * parameters:
   * - selected_language - The language of the translated lyrics (ISO 639-1)
   * - min_completed - Teal from 0 to 1. If present, only the tracks with a translation ratio over this specific value, for a given language, are returned Set it to 1 for completed translation only, to 0.7 for a mimimum of 70% complete translation.
   * - commontrack_id - The Musixmatch commontrack id
   * - track_isrc - A valid ISRC identifier
   * - f_subtitle_length - The desired length of the subtitle (seconds)
   * - f_subtitle_length_max_deviation - The maximum deviation allowed from the f_subtitle_length (seconds)
   */
  async trackSubttileTranslationGet<T extends string>(
    ...params: T[]
  ): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.subtitle.translation.get', queryParams);
  }

  /**
   * Get the list of the music genres of our catalogue.
   * @returns - A promise that resolves to the all music genres.
   */
  async musicGenresGet(): Promise<any> {
    return this._apiCall('get', 'music.genres.get');
  }

  /**
   * Get the lyrics for track based on title and artist
   * @param params - The parameters
   * @returns - A promise that resolves to the matcher lyrics.
   *
   * parameters:
   * - q_track - The song title
   * - q_artist - The song artist
   * - track_isrc - If you have an available isrc id in your catalogue you can query using this id only (optional)
   */
  async matcherLyricsGet<T extends string>(
    ...params: T[]
  ): Promise<MatcherLyrics> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.lyrics.get', queryParams);
  }

  /**
   * Match your song against Musixmatch database.
   *
   * In some cases you already have some informations about the track title, artist name, album etc.
   * A possible strategy to get the corresponding lyrics could be:
   * - search our catalogue with a perfect match,
   * - maybe try using the fuzzy search,
   * - maybe try again using artist aliases, and so on.
   *
   * The matcher.track.get method does all the job for you in a single call. This way you dont’t need to worry about the details, and you’ll get instant benefits for your application without changing a row in your code, while we take care of improving the implementation behind. Cool, uh?
   * @param params - The parameters
   * @returns A promise that resolves to the matcher track.
   *
   * parameters:
   * - q_track - The song title
   * - q_artist - The song artist
   * - q_albumThe song album
   */
  async matcherTrackGet<T extends string>(
    ...params: T[]
  ): Promise<MatcherTrack> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.track.get', queryParams);
  }

  /**
   * Get the subtitles for a song given his title,artist and duration.
   * @param params - The parameters
   * @returns A promise that resolves to the matcher subtitle
   *
   * parameters:
   * - q_track - The song title
   * - q_artist - The song artist
   * f_subtitle_length - Filter by subtitle length in seconds
   * f_subtitle_length_max_deviation - Max deviation for a subtitle length in seconds
   * track_isrc If you have an available isrc id in your catalogue you can query using this id only (optional)
   */
  async matcherSubtitleGet<T extends string>(
    ...params: T[]
  ): Promise<MatcherSubtitle> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.subtitle.get', queryParams);
  }

  /**
   * Get the artist data from Musixmatch database.
   * @param params - The parameters
   * @returns - A promise that resolves to the artist get
   *
   * parameters:
   * - artist_id - Musixmatch artist id
   * - artist_mbid - Musicbrainz artist id
   */
  async artistGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.get', queryParams);
  }

  /**
   * Search for artists in Musixmatch database.
   * @param params - The parameters.
   * @returns A promise that resolves to the artist search.
   *
   * parameters:
   * - q_artist - The song artist
   * - f_artist_id - When set, filter by this artist id
   * - f_artist_mbid - When set, filter by this artist musicbrainz id
   * - page - Define the page number for paginated results
   * - page_size - Define the page size for paginated results. Range is 1 to 100.
   * - format - Decide the output type (json or xml)
   */
  async artistSearch<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.search', queryParams);
  }

  /**
   * Get the album discography of an artist
   * @param params - The parameters
   * @returns A promise that resolves to the artist albums
   *
   * parameters:
   * - artist_id - Musixmatch artist id
   * - artist_mbid - Musicbrainz artist id
   * - g_album_name - Group by Album Name
   * - s_release_date - Sort by release date (asc|desc)
   * - page - Define the page number for paginated results
   * - page_size - Define the page size for paginated results. Range is 1 to 100.
   */
  async artistAlbumsGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.albums.get', queryParams);
  }

  /**
   * Get a list of artists somehow related to a given one.
   * @param params - The parameters
   * @returns A promise that resolves to the related artists.
   *
   * parameters:
   * - artist_id - The Musixmatch artist id
   * - artist_mbid - The Musicbrainz artist id
   * - page - Define the page number for paginated results
   * - page_size - Define the page size for paginated results. Range is 1 to 100.
   * format - Decide the output type (json or xml)
   */
  async artistRelatedGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.related.get', queryParams);
  }
  async albumGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'album.get', queryParams);
  }
  async albumTracksGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'album.tracks.get', queryParams);
  }
}

export { Musixmatch };
