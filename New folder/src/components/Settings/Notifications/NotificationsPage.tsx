import React, { useState } from 'react';
import { NotificationMethodIcons } from './NotificationMethodIcons';
import { NotificationRow } from './NotificationRow';
import { NotificationSetting, NotificationMethod, defaultNotificationMethods } from './NotificationTypes';

const initialNotifications: NotificationSetting[] = [
  {
    id: '1',
    title: 'When a call is sent by email',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '2',
    title: 'When a call is sent by a web request form',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '3',
    title: 'When a call is sent by an account user',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '4',
    title: 'When a call moves from Scheduled to Waiting',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '5',
    title: 'When driver accepts a call',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '6',
    title: 'When a call\'s status changes to "On Scene"',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '7',
    title: 'When a call\'s status changes to "Towing"',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
  {
    id: '8',
    title: 'Driver Clear (call completed)',
    manager: { ...defaultNotificationMethods, desktop: true },
    dispatcher: { ...defaultNotificationMethods, desktop: true },
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleToggle = (notificationId: string, role: 'manager' | 'dispatcher', type: keyof NotificationMethod) => {
    setNotifications(notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          [role]: {
            ...notification[role],
            [type]: !notification[role][type]
          }
        };
      }
      return notification;
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold mb-2">Notifications</h1>
      <p className="text-gray-600 mb-6">
        Manage what events and notification methods will be used with to your team.
      </p>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Dispatching</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1" />
          <div className="w-48">
            <div className="text-sm font-medium mb-2">Manager</div>
            <NotificationMethodIcons />
          </div>
          <div className="w-48">
            <div className="text-sm font-medium mb-2">Dispatcher</div>
            <NotificationMethodIcons />
          </div>
          <div className="w-8" />
        </div>

        {notifications.map(notification => (
          <NotificationRow
            key={notification.id}
            title={notification.title}
            manager={notification.manager}
            dispatcher={notification.dispatcher}
            onToggle={(role, type) => handleToggle(notification.id, role, type)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;