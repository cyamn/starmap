import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "@/server/api/trpc";

import { blocksRouter } from "./routers/blocks/router";
import { emailRouter } from "./routers/email/router";
import { graphRouter } from "./routers/graph/router";
import { pagesRouter } from "./routers/pages/router";
import { sheetsRouter } from "./routers/sheets/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sheets: sheetsRouter,
  pages: pagesRouter,
  blocks: blocksRouter,
  graph: graphRouter,
  email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
