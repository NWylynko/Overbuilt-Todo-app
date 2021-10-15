import { tasksDB } from "../index"

export const getByUser = async (userId: string) => {
  const query = await tasksDB.where("userId", "==", userId).get()
  return query.docs.map((doc) => doc.data());
};