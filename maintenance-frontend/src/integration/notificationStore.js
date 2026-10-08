const notifications = [];
const listeners = [];

export const addNotification = (notification) => {
  notifications.unshift(notification);

  listeners.forEach((listener) => {
    listener([...notifications]);
  });
};

export const getNotifications = () => {
  return [...notifications];
};

export const subscribeToNotifications = (listener) => {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};