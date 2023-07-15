interface TrackSnippet {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      snippet: {
        snippet_language: string;
        restricted: number;
        instrumental: number;
        snippet_body: string;
        script_tracking_url: string;
        pixel_tracking_url: string;
        html_tracking_url: string;
        updated_time: string;
      };
    };
  };
}

export { TrackSnippet };
