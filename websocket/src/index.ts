import "source-map-support/register"
import "dotenv/config"
import WebSocket from "uWebSockets.js"
import { URLSearchParams } from "url";
import admin from "firebase-admin";
import serviceAccountJson from "./serviceAccountKey.json"
import { PubSub } from '@google-cloud/pubsub'

const serviceAccount = serviceAccountJson as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const pubsub = new PubSub({projectId: "pubsub-websockets-a8ec6", keyFilename: "./PubSubServiceAccountKey.json"});

const port = 8080;

const app = WebSocket.App()

app.ws('/*', {

  upgrade: (res, req, context) => {
    const upgradeAborted = { aborted: false };

    /* You MUST copy data out of req here, as req is only valid within this immediate callback */
    const url = req.getUrl();
    const urlParams = new URLSearchParams(req.getQuery());
    const jwt = urlParams.get('jwt');
    const secWebSocketKey = req.getHeader('sec-websocket-key');
    const secWebSocketProtocol = req.getHeader('sec-websocket-protocol');
    const secWebSocketExtensions = req.getHeader('sec-websocket-extensions');

    res.onAborted(() => {
      upgradeAborted.aborted = true;
    });

    ( async () => {

      if (!jwt) {
        console.log("no jwt")
        res.close();
        return;
      }

      const user = await admin.auth().verifyIdToken(jwt)

      if (upgradeAborted.aborted) {
        res.close();
        return;
      }

      res.upgrade({
        url,
        user
      },
      secWebSocketKey,
      secWebSocketProtocol,
      secWebSocketExtensions,
      context
      );

    })()

  },

  open: (ws) => {
    console.log(ws.user.user_id, 'Connection open')
    ws.subscribe(ws.user.user_id)
  },

  message: (ws, message, isBinary) => {
    console.log(ws.user.user_id, `Message received: ${message}`)
  },

  drain: (ws) => {
    console.log(ws.user.user_id, 'WebSocket backpressure: ' + ws.getBufferedAmount());
  },

  close: (ws, code, message) => {
    console.log(ws.user.user_id, 'Connection closed')
  }

})

app.listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port);
  } else {
    console.log('Failed to listen to port ' + port);
  }
});


(async () => {
  const subscription = pubsub.subscription("websockets");

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    const eventString = message.data.toString()
    const event = JSON.parse(eventString)
    console.log('Received message:', event);
    app.publish(event.userId, eventString);
    message.ack();
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received PubSub error:', error);
  });

})()