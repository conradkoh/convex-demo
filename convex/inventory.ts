import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get current inventory stock
export const getStock = query({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").first();
    if (!inventory) {
      return { stock: 0 };
    }
    return { stock: inventory.stock };
  },
});

// Get all orders
export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return orders;
  },
});

// Restock inventory to 2 items
export const restock = mutation({
  args: {},
  handler: async (ctx) => {
    const inventory = await ctx.db.query("inventory").first();
    
    if (inventory) {
      await ctx.db.patch(inventory._id, { stock: 2 });
    } else {
      await ctx.db.insert("inventory", { stock: 2 });
    }
    
    return { stock: 2 };
  },
});

// Clear all orders
export const clearOrders = mutation({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    for (const order of orders) {
      await ctx.db.delete(order._id);
    }
    return orders.length;
  },
});

// Place an order (with concurrent transaction handling)
export const placeOrder = mutation({
  args: {
    userName: v.string(),
    orderNumber: v.number(),
  },
  handler: async (ctx, args) => {
    // Get current inventory
    const inventory = await ctx.db.query("inventory").first();
    
    if (!inventory || inventory.stock <= 0) {
      // Create a failed order record
      const orderId = await ctx.db.insert("orders", {
        userName: args.userName,
        timestamp: Date.now(),
        orderNumber: args.orderNumber,
        status: "failed",
      });
      
      return { orderId, remainingStock: inventory ? inventory.stock : 0, status: "failed" };
    }
    
    // Create a successful order
    const orderId = await ctx.db.insert("orders", {
      userName: args.userName,
      timestamp: Date.now(),
      orderNumber: args.orderNumber,
      status: "success",
    });
    
    // Decrement the stock
    await ctx.db.patch(inventory._id, {
      stock: inventory.stock - 1,
    });
    
    return { orderId, remainingStock: inventory.stock - 1, status: "success" };
  },
});
