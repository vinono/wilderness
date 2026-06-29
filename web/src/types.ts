export interface Track {
  id: string;
  name: string;
  icon: string;
  url: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  nameZh: string;
  lightBgUrl: string;
  darkBgUrl: string;
  thumbnailUrl: string;
  bgmUrl: string;
  defaultVolumes: { [trackId: string]: number };
  accentColor: string; // HSL value, e.g. "210 80% 65%"
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface FocusSession {
  mode: 'pomodoro' | 'stopwatch';
  durationMinutes: number;
  timeLeft: number; // in seconds
  isRunning: boolean;
}
