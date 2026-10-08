import { publish } from "./eventBus";
import { mockEvents } from "../data/mockEvents";

let mockEventsLoaded = false;

export const loadMockEvents = () => {
  if (mockEventsLoaded) {
    return;
  }

  mockEventsLoaded = true;

  mockEvents.forEach((event) => {
    publish(event);
  });
};