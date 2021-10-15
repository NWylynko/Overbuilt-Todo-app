import { Event } from "./event";
import { Task } from "../types/Task"
import { newEvent } from "./newEvent"
import { task } from "../database/task"

export const updateTask = async (event: Event<Task>) => {
  console.log("updating task")
  await task.update(event.data);
  await newEvent(event)
  return;
}