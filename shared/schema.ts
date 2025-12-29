import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bingo tile schema - now supports individual background images
export const bingoTileSchema = z.object({
  id: z.number(),
  text: z.string(),
  completed: z.boolean(),
  completedAt: z.string().nullable(),
  backgroundImage: z.string().nullable().optional(),
});

export type BingoTile = z.infer<typeof bingoTileSchema>;

// Marker type options (includes "custom" for backward compatibility with existing cards)
export const markerTypes = ["checkmark", "circle", "star", "heart", "custom"] as const;
export type MarkerType = typeof markerTypes[number];

// Tile corner options (rounded vs square corners)
export const tileCorners = ["square", "rounded"] as const;
export type TileCorner = typeof tileCorners[number];

// Board size presets
export const boardSizePresets = ["3x3", "4x4", "5x5", "custom"] as const;
export type BoardSizePreset = typeof boardSizePresets[number];

// Text alignment options
export const textAlignments = ["left", "center", "right"] as const;
export type TextAlignment = typeof textAlignments[number];

// Font options
export const fontOptions = [
  "Inter",
  "Arial", 
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Comic Sans MS",
  "Impact",
] as const;
export type FontOption = typeof fontOptions[number];

// Customization settings schema
export const customizationSchema = z.object({
  boardBackgroundColor: z.string(),
  boardBackgroundImage: z.string().nullable(),
  tileBackgroundColor: z.string(),
  tileBackgroundImage: z.string().nullable(),
  tileTextColor: z.string(),
  markerType: z.enum(markerTypes),
  markerColor: z.string(),
  markerImage: z.string().nullable(),
  markerSize: z.number().min(20).max(100).optional(),
  tileCorners: z.enum(tileCorners),
  tileGlassEffect: z.boolean().optional(),
  rows: z.number().min(2).max(10),
  columns: z.number().min(2).max(10),
  tileSpacing: z.number().min(0).max(20),
  titleAlignment: z.enum(textAlignments),
  titleFont: z.string(),
  titleColor: z.string(),
  goalFont: z.string(),
  goalColor: z.string(),
  deadline: z.string().nullable(),
});

export type Customization = z.infer<typeof customizationSchema>;

// Default customization
export const defaultCustomization: Customization = {
  boardBackgroundColor: "#f3f4f6",
  boardBackgroundImage: null,
  tileBackgroundColor: "#ffffff",
  tileBackgroundImage: null,
  tileTextColor: "#1f2937",
  markerType: "checkmark",
  markerColor: "#7c3aed",
  markerImage: null,
  markerSize: 50,
  tileCorners: "rounded",
  tileGlassEffect: false,
  rows: 5,
  columns: 5,
  tileSpacing: 8,
  titleAlignment: "center",
  titleFont: "Inter",
  titleColor: "#ffffff",
  goalFont: "Inter",
  goalColor: "#1f2937",
  deadline: null,
};

// Create initial empty tiles based on grid size
export function createEmptyTiles(rows: number = 5, columns: number = 5): BingoTile[] {
  const count = rows * columns;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: "",
    completed: false,
    completedAt: null,
    backgroundImage: null,
  }));
}

// Bingo card database table
export const bingoCards = pgTable("bingo_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("My Goal Bingo"),
  tiles: jsonb("tiles").notNull().$type<BingoTile[]>(),
  customization: jsonb("customization").notNull().$type<Customization>(),
});

export const insertBingoCardSchema = createInsertSchema(bingoCards).omit({
  id: true,
});

export type InsertBingoCard = z.infer<typeof insertBingoCardSchema>;
export type BingoCard = typeof bingoCards.$inferSelect;

// Users table (kept for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
