interface TrackRichSync {
  message: {
    header: {
      status_code: number;
      available: number;
      execute_time: number;
    };
    body: {
      richsync: {
        richsync_id: number;
        restricted: number;
        richsync_body: string;
        lyrics_copyright: string;
        richsync_length: number;
        richsync_language: 'en';
        richsync_language_description: string;
        script_tracking_url: string;
        updated_time: string;
      };
    };
  };
}

export { TrackRichSync };
