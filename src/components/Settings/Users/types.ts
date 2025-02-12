export interface User {
  id: string;
  name: string;
  username: string;
  lastLoginWeb?: string;
  lastLoginAndroid?: string;
  lastLoginIPhone?: string;
}

export interface UserGroup {
  id: string;
  name: string;
  checked: boolean;
}

export interface UserFilters {
  showInactives: boolean;
  showDeleted: boolean;
  selectedGroups: string[];
}