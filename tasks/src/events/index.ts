import { PubSub } from "@google-cloud/pubsub";

import { event, Event } from "./event";
import { createTask } from "./createTask";
import { updateTask } from "./updateTask"

const pubsub = new PubSub({
  projectId: 'pubsub-websockets-a8ec6',
  keyFilename: './ServiceAccountKey.json',
});
  
export const topic = pubsub.topic("events");
const subscription = topic.subscription("tasks-api");

interface EventHandlers {
  [key: string]: (event: Event<any>) => Promise<void>;
}

const eventHandlers: EventHandlers = {
  createTask,
  updateTask
};

export const registerEventsListener = async () => {
  
  // Receive callbacks for new messages on the subscription
  subscription.on('message', async (message) => {
    try {
      // Parse the message
      const event: Event<any> = JSON.parse(message.data.toString())

      // get the correct event handler
      const eventHandler = eventHandlers[event.event];

      // call the event handler
      if (eventHandler !== undefined) {
        await eventHandler(event);
      } else {
        // event is not currently handled by this service
      }

      // Acknowledge (ack) the message to prevent it from being redelivered
      message.ack();
    } catch (error) {
      throw error
    }
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received PubSub error:', error);
  });

  console.log('Listening for messages on PubSub subscription:', subscription.name);

}
