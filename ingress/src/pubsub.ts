import { PubSub } from "@google-cloud/pubsub";
import { v4 as uuid } from "uuid"

const pubsub = new PubSub({
  projectId: "pubsub-websockets-a8ec6", 
  keyFilename: "./PubSubServiceAccountKey.json"
});
const topic = pubsub.topic("events");

type event = 
  "task.create" | "task.create.error" |
  "task.update" | "task.update.error" |
  "task.delete" | "task.delete.error"
  
export const newEvent = (event: event, userId: string, data: any) => {
  const eventId = uuid();
  const message = JSON.stringify({
    eventId,
    userId,
    event,
    data,
    timestamp: new Date().getTime(),
  });
  return topic.publish(Buffer.from(message));
}