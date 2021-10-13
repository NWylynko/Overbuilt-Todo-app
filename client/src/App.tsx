import React, { useState, useEffect } from 'react';
import { signInWithGoogle, auth } from './firebase';
import { getIdToken, User, onAuthStateChanged } from "firebase/auth" 
import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:4000"
})

function App() {

  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJWT] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const sub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      const jwt = await getIdToken(user);
      setUser(user);
      setJWT(jwt);
    })
    return sub
  }, [])

  useEffect(() => {
    let websocket: WebSocket;
    if (user && jwt) {
      console.log("connecting to websocket");
      websocket = new WebSocket(`ws://localhost:8080/?jwt=${jwt}`);
      websocket.onopen = () => {
        console.log("connected to websocket");
      }
      websocket.onmessage = (event) => {
        const message = {...JSON.parse(event.data.toString()), received: new Date()};
        console.log(message);
        setNotifications(s => [...s, message])
      }
      websocket.onclose = () => {
        console.log("disconnected from websocket");
      }
    }
    return (() => {
      if (websocket) { websocket.close(); }
    })
  }, [user, jwt]);

  const submitMessage = (e: any) => {
    e.preventDefault();
    console.log(message)
    axios.post("/", { sent: new Date(), message })
  }

  return (
    <div>
      {/* {jwt && <pre>{jwt}</pre>} */}
      {/* {user && <pre>{JSON.stringify(user, null, 2)}</pre>} */}
      {!user && <button onClick={signInWithGoogle}>Sign in with google</button>}
      <form onSubmit={submitMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button>Submit</button>
      </form>
      <h2>Notifications</h2>
      {notifications.map(n => <pre>{JSON.stringify(n)}</pre>)}
    </div>
  );
}

export default App;
