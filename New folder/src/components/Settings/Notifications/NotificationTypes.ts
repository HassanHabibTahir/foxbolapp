export interface NotificationMethod {
  email: boolean;
  sms: boolean;
  desktop: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  manager: NotificationMethod;
  dispatcher: NotificationMethod;
}

export const defaultNotificationMethods: NotificationMethod = {
  email: false,
  sms: false,
  desktop: false,
};