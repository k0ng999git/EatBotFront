export interface BotState {
  isEnabled: boolean;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}
