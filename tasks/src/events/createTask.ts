import { Event } from "./event";
import { Task } from "../types/Task"
import { newEvent } from "./newEvent"
import { task } from "../database/task"

export const createTask = async (event: Event<Task>) => {
  console.log("creating new task")
  await task.create(event.userId, event.data);
  await newEvent(event)
  return;
}