export interface User {
  id: string;
  name: string;
  email: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface ExternalAccessSettings {
  enabled: boolean;
}