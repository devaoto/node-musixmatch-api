interface TrackMood {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      mood_list: Array<{
        label: string;
        value: number;
      }>;
      raw_data: {
        valence: number;
        arousal: number;
      };
    };
  };
}

export { TrackMood };
