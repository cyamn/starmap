import { createTRPCRouter } from "src/server/api/trpc";
import { publicProcedure } from "src/server/api/trpc";

import { rebuildGraph } from "./build";
import { getGraph } from "./get";


export const graphRouter = createTRPCRouter({
  get: publicProcedure
    .meta({
      openapi: {
        description: "Get graph",
        tags: ["graph"],
        method: "GET",
        path: "/graph",
      },
    })
    .query(async ({ ctx }) => {
      return await getGraph();
    }),

  rebuild: publicProcedure
    .meta({
      openapi: {
        description: "Rebuild graph",
        tags: ["graph"],
        method: "POST",
        path: "/graph/rebuild",
      },
    })
    .mutation(async ({ ctx }) => {
      console.log("Rebuilding graph.....");
      await rebuildGraph();
    }),
});
