import "source-map-support/register"
import "dotenv/config"
import Fastify from "fastify";
import cors from "fastify-cors";
import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub({projectId: "pubsub-websockets-a8ec6", keyFilename: "./PubSubServiceAccountKey.json"});
const topic = pubsub.topic("notifications");

const app = Fastify({ logger: true });

app.register(require('fastify-cors'), { 
  origin: "http://localhost:3000"
})

app.post("/", async (req, res) => {
  const data = req.body;
  topic.publish(Buffer.from(JSON.stringify(data)));
  return data;
})

try {
  app.listen(4000);
  console.log("listening on port 4000")
} catch (error) {
  console.error("failed to listen on port 4000")
}