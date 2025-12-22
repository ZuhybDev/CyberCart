import express from "express";
import { ENV } from "../config/env.js";
import path from "path";
import { connectionDB } from "../config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "../config/innges.js";

import adminRoute from "../routes/admin.route.js";
import usersRoute from "../routes/users.route.js";
import ordersRoute from "../routes/orders.route.js";

const app = express();
//clerk
app.use(clerkMiddleware());

app.use(express.json());

//ingest
app.use("/api/inngest", serve({ client: inngest, functions }));

// admin route
app.use("/api/admin", adminRoute);
//users route
app.use("/api/users", usersRoute);

// orders route
app.use("/api/orders", ordersRoute);

app.get("/api", (req, res) => {
  res.status(200).send("Welcome CyberCart");
});

const startServer = async () => {
  await connectionDB();
  app.listen(ENV.PORT, () => {
    console.log("Server Successfully start");
  });
};
startServer();
