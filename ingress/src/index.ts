import "source-map-support/register"
import "dotenv/config"
import Fastify from "fastify";
import cors from "fastify-cors";
import { newEvent } from "./pubsub"
import { v4 as uuid } from "uuid"
import admin from "firebase-admin";
import { auth } from "./auth";

const app = Fastify({ logger: true });

app.register(cors, { 
  origin: "http://localhost:3000"
})

interface TaskId {
  id: string;
}

interface NewTask {
  title: string;
}

interface Task extends NewTask {
  completed: boolean;
}

app.post("/task/create", auth(async (req, res, user) => {
  const task = req.body as NewTask;
  const id = uuid();
  const data = { 
    ...task, 
    id, 
    completed: false, 
    userId: user.uid
  };

  // here I am specifically choosing to not await the publish
  // because I want to be able to return the task id as fast as possible
  // and I don't want to wait for the publish to finish as it takes about a second
  // to publish to the pubsub server
  // the issue is, if the publish fails, the task will be lost
  // but I don't want to wait for the publish to fail
  // so I am just going to return the task id and let the client deal with the error
  // if the publish fails
  newEvent("createTask", user.uid, data)
  return data;
}))

app.patch("/task/update", auth(async (req, res, user) => {
  const data = req.body as TaskId & Partial<Task>;
  newEvent("updateTask", user.uid, data)
  return data;
}))

try {
  app.listen(4000);
  console.log("listening on port 4000")
} catch (error) {
  console.error("failed to listen on port 4000")
}
