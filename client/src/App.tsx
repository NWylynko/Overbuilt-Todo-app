import React, { useState, useEffect } from 'react';
import { signInWithGoogle, auth } from './firebase';
import { getIdToken, User, onAuthStateChanged } from "firebase/auth" 
import { useData } from "./context"
import { axiosIngress } from "./axios"

function App() {
  const [title, setTitle] = useState<string>("");
  const { user, tasks, setTasks, loading } = useData();

  const submitMessage = async (e: any) => {
    e.preventDefault();

    // creating the id client side is risky as it opens up the services to vulnerability
    // so we use the server side to generate the id, this does add a delay, but react complains
    // a lot if we add an item to the tasks list without an id
    // and while we could have it like "0", trying to find it in the list is a lot of work
    // this endpoint is only creating the id, and adding the new task to the pubsub queue
    // both functions that take very little time, so it should be fine
    const { data: newTask } = await axiosIngress.post("/task/create", { title })
    setTasks(tasks => [...tasks, newTask])
  }

  if (loading) {
    return <div><span>Loading...</span></div>
  }

  if (!user) {
    return (
      <div>
        <button onClick={signInWithGoogle}>Sign in with google</button>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={submitMessage}>
        <label>Add Task</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required/>
        <button>Submit</button>
      </form>
      {tasks.map(task => <Task key={task.id} {...task} />)}
    </div>
  );
}

interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
}

const Task = ({ id, title, completed }: TaskProps) => {
  
  const { setTasks } = useData();

  const toggle = () => {
    console.log(`toggle ${id} to ${!completed}`)

    const state = !completed;

    setTasks(tasks => tasks.map(task => {
      if (task.id === id) {
        task.completed = state;
      }
      return task;
    }))
    axiosIngress.patch("/task/update", { id, completed: state })
  }
  
  return (
    <div>
      <input type="checkbox" checked={completed} onChange={toggle} />
      <span>{title}</span>
    </div>
  )
}

export default App;
