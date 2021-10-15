import { useState, useEffect, useContext, createContext } from "react"
import { auth } from './firebase';
import { getIdToken, User, onAuthStateChanged } from "firebase/auth" 
import { axiosIngress, axiosTasks } from "./axios"
import unionBy from "lodash/unionBy";

interface Store {
  user: User | null;
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  connected: boolean;
  loading: boolean;
}

const Context = createContext<Store>({
  user: null,
  tasks: [],
  setTasks: () => {},
  connected: false,
  loading: true,
})

export const useData = () => useContext(Context);

export const Provider = ({ children }: { children: JSX.Element[] }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJWT] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      const jwt = await getIdToken(user);

      // @ts-ignore
      axiosIngress.defaults.headers["authorization"] = `jwt ${jwt}`;
      // @ts-ignore
      axiosTasks.defaults.headers["authorization"] = `jwt ${jwt}`;

      setUser(user);
      setJWT(jwt);
      setLoading(false);
    })
    return sub
  }, [])

  useEffect(() => {
    if (user && jwt) {
      (async () => {
        const { data } = await axiosTasks.get<any[]>("/");
        setTasks(tasks => unionBy(tasks, data, "id"))
      })()
    }
  }, [user, jwt]);

  useEffect(() => {
    let websocket: WebSocket;
    if (user && jwt) {
      console.log("connecting to websocket");
      websocket = new WebSocket(`ws://localhost:8080/?jwt=${jwt}`);
      websocket.onopen = () => {
        console.log("connected to websocket");
        setConnected(true)
      }
      websocket.onmessage = (message) => {
        const event = JSON.parse(message.data.toString());
        const newTask = event.data;
        setTasks(tasks => unionBy(tasks, [newTask], "id"))
      }
      websocket.onclose = () => {
        console.log("disconnected from websocket");
        setConnected(false)
      }
    }
    return (() => {
      if (websocket) { websocket.close(); }
    })
  }, [user, jwt]);

  return (
    <Context.Provider value={{ user, tasks, setTasks, connected, loading }}>
      {children}
    </Context.Provider>
  );
};