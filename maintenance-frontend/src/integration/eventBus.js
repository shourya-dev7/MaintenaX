const listeners = {};

export const subscribe = (eventType, callback) => {
  if (!listeners[eventType]) {
    listeners[eventType] = [];
  }

  listeners[eventType].push(callback);

  // Return a function to unsubscribe
  return () => {
    listeners[eventType] = listeners[eventType].filter(
      (listener) => listener !== callback
    );
  };
};

export const publish = (event) => {
  const eventListeners = listeners[event.type] || [];

  eventListeners.forEach((callback) => {
    callback(event);
  });
};