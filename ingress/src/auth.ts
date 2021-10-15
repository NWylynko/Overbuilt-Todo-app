import { FastifyRequest, FastifyReply } from "fastify";
import admin from "firebase-admin";
import serviceAccountJson from "./serviceAccountKey.json"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const serviceAccount = serviceAccountJson as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// this auth middleware verifies the jwt from the user before allowing them to access the route
// if the verification is successful, it passes the user object along as a third argument to the route handler

export function auth(handler: (req: FastifyRequest, res: FastifyReply, user: DecodedIdToken) => any) {
  return async (req: FastifyRequest, res: FastifyReply) => {

    const jwt = req.headers["authorization"]?.split(" ")[1];

    if (!jwt) {
      console.log("no jwt");
      res.status(403).send({ error: "no jwt" });
      return;
    }

    try {

      const user = await admin.auth().verifyIdToken(jwt);
      return handler(req, res, user);

    } catch (error) {
      
      console.log(error);
      res.status(403).send({ error: "invalid jwt" });

    }
  };
}
