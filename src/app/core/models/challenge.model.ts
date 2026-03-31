export interface LevelStatus {
  completed: boolean;
  completedAt?: number;
}

export interface Progress {
  levels: Record<number, LevelStatus>;
  playerName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
