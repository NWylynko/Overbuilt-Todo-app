import { auth } from "../auth";
import { task } from "../database/task"

export const get = auth(async (req, res, user) => {
  return task.getByUser(user.uid);
})