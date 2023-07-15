interface MatcherLyrics {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      lyrics: {
        lyrics_id: number;
        restricted: number;
        instrumental: number;
        lyrics_body: string;
        lyrics_language: string;
        script_tracking_url: string;
        pixel_tracking_url: string;
        html_tracking_url: string;
        lyrics_copyright: string;
        updated_time: string;
      };
    };
  };
}

export { MatcherLyrics };
