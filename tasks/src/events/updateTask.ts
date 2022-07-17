import { Event } from "./event";
import { Task } from "../types/Task"
import { newEvent } from "./newEvent"
import { task } from "../database/task"

export const updateTask = async (event: Event<Task>) => {
  try {
    console.log("updating task")
    return task.update(event.data);
  } catch (error) {
    newEvent("")
  }
}