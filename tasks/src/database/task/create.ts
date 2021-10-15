import { Task } from "../../types/Task"
import { tasksDB } from "../index"

export const create = async (userId: string, task: Task) => {
  return tasksDB.doc(task.id).set({
    ...task,
    userId
  })
};