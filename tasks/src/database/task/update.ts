import { Task } from "../../types/Task"
import { tasksDB } from "../index"

export const update = async (task: Task) => {
  return tasksDB.doc(task.id).update(task)
};