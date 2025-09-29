export interface SoundButton {
  id: string;
  emoji: string;
  label: string;
  soundFile: string;
  color: string;
  volume?: number; // 0.0 to 1.0, defaults to 1.0
}

export interface StoryMode {
  id: string;
  name: string;
  description: string;
  buttons: SoundButton[];
}

export interface SoundBoard {
  buttons: SoundButton[];
}

export interface SocketEvents {
  playSound: (soundId: string) => void;
  soundPlayed: (soundId: string) => void;
  storyModeChanged: (modeId: string) => void;
  connect: () => void;
  disconnect: () => void;
}