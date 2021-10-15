import "source-map-support/register"
import "dotenv/config"

import { registerEventsListener } from "./events"
import { app } from "./endpoints"

const main = async () => {
 await registerEventsListener();
 await app.listen(5000)
 return;
}

main();