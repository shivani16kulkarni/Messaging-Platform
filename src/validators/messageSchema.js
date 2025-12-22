import z from "zod";
export const messageSchema = z.object({
  text: z.string().min(1),
});
