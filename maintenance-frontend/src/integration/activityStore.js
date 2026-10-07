const activities = [];
const listeners = [];

export const addActivity = (activity) => {
  activities.unshift(activity);

  listeners.forEach((listener) => {
    listener([...activities]);
  });
};

export const getActivities = (requestId) => {
  if (!requestId) {
    return [...activities];
  }

  return activities.filter(
    (activity) => activity.requestId === requestId,
  );
};

export const subscribeToActivities = (listener) => {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};