import { graphql } from "ponder";
import { ponder } from "ponder:registry";

ponder.use("/graphql", graphql());
ponder.use("/", graphql());
