import { z } from "zod";
export const conversationSchema = z.object({
  userId: z.string(),
});
