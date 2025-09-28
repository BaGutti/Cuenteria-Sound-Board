export interface SoundButton {
  id: string;
  emoji: string;
  label: string;
  soundFile: string;
  color: string;
}

export interface SoundBoard {
  buttons: SoundButton[];
}

export interface SocketEvents {
  playSound: (soundId: string) => void;
  soundPlayed: (soundId: string) => void;
  connect: () => void;
  disconnect: () => void;
}