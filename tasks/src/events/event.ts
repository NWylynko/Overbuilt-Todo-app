export type event = "createTask" | "updateTask";
export interface Event<T> {
  eventId: string;
  userId: string;
  event: event;
  data: T;
}
