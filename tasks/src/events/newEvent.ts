import { Event } from "./event";
import { topic } from "./index";


export function newEvent<T>(event: Event<T>) {
  const message = JSON.stringify(event);
  return topic.publish(Buffer.from(message), { type: "response" });
}
