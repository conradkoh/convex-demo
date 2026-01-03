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
  inventory: defineTable({
    stock: v.number(),
  }),
  orders: defineTable({
    userName: v.string(),
    timestamp: v.number(),
    orderNumber: v.number(),
    status: v.union(v.literal("success"), v.literal("failed")),
  }),
});
