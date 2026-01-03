import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  events: defineTable({
    type: v.string(),
    message: v.string(),
    timestamp: v.number(),
  }),
});
