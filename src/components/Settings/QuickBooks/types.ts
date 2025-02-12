export interface QuickBooksConnectionStatus {
  isConnected: boolean;
  lastSyncDate?: string;
}

export interface QuickBooksSettings {
  connectionStatus: QuickBooksConnectionStatus;
}