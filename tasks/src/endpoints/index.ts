import Fastify from "fastify";
import cors from "fastify-cors";

import { get } from "./get"

export const app = Fastify({ logger: true });

app.register(cors, { 
  origin: "http://localhost:3000"
})

app.get("/", get);
