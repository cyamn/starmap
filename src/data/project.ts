// TODO: merge with webapp

import { z } from "zod";

export const DProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  roles: z.array(
    z.object({
      name: z.string(),
      users: z.array(z.string()),
      isAdmin: z.boolean(),
    }),
  ),
});

export type Project = {
  name: string;
  updatedAt: Date;
  description: string | null;
  id: string;
};

export const defaultProject: Project = {
  name: "example",
  updatedAt: new Date(),
  description: "example",
  id: "example",
};
