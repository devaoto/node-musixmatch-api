interface ChartArtists {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      artist_list: Array<{
        artist: {
          artist_id: number;
          artist_mbid: string;
          artist_name: string;
          artist_alias_list: [];
          artist_rating: number;
          updated_time: string;
        };
      }>;
    };
  };
}

export { ChartArtists };
