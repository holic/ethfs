import { Hono } from "hono";
import { client, graphql } from "ponder";
import { db } from "ponder:api";
import schema from "ponder:schema";

const app = new Hono();

app.use("/graphql", graphql({ db, schema }));
app.use(client({ db }));

export default app;
