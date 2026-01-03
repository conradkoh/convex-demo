import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").order("desc").collect();
    return events;
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const newEventId = await ctx.db.insert("events", {
      type: args.type,
      message: args.message,
      timestamp: Date.now(),
    });
    return newEventId;
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }
    return events.length;
  },
});
