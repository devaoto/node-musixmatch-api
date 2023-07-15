interface TrackSubtitle {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      subtitle: {
        subtitle_id: number;
        restricted: number;
        subtitle_body: string;
        subtitle_language: string;
        script_tracking_url: string;
        pixel_tracking_url: string;
        html_tracking_url: string;
        lyrics_copyright: string;
      };
    };
  };
}

export { TrackSubtitle };
