import axios, { AxiosResponse } from 'axios';
import { MXMException, MusixmatchError } from './expectations';
import {
  TrackGet,
  TrackSearch,
  ChartArtists,
  ChartTracks,
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
        const requestUrl = error.config ? error.config.url : '';
        throw new MusixmatchError(
          `Status code: ${error.response.status}\nHTTP error occurred: ${error.response.data}`,
          requestUrl
        );
      } else if (error.code === 'ECONNREFUSED') {
        throw new MusixmatchError('Connection refused', url);
      } else {
        throw new MusixmatchError(error.message, url);
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

  async trackLyricsGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.get', queryParams);
  }

  async trackLyricsPost<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('post', 'track.lyrics.post', queryParams);
  }

  async trackLyricsMoodGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.mood.get', queryParams);
  }

  async trackSnippetGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.snippet.get', queryParams);
  }

  async trackSubtitleGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.subtitle.get', queryParams);
  }

  async trackRichSyncGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.richsync.get', queryParams);
  }

  async trackLyricsTranslationGet<T extends string>(
    ...params: T[]
  ): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.lyrics.translation.get', queryParams);
  }

  async trackSubttileTranslationGet<T extends string>(
    ...params: T[]
  ): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'track.subtitle.translation.get', queryParams);
  }
  async musicGenresGet(): Promise<any> {
    return this._apiCall('get', 'music.genres.get');
  }
  async matcherLyricsGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.lyrics.get', queryParams);
  }
  async matcherTrackGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.track.get', queryParams);
  }
  async matcherSubtitleGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'matcher.subtitle.get', queryParams);
  }
  async artistGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.get', queryParams);
  }
  async artistSearch<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.search', queryParams);
  }
  async artistAlbumsGet<T extends string>(...params: T[]): Promise<any> {
    const queryParams = Object.fromEntries(
      params.map((param) => param.split('='))
    );
    return this._apiCall('get', 'artist.albums.get', queryParams);
  }
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
