import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { bingoTileSchema, customizationSchema } from "@shared/schema";

const createCardSchema = z.object({
  title: z.string().optional(),
  tiles: z.array(bingoTileSchema).optional(),
  customization: customizationSchema.partial().optional(),
});

const updateCardSchema = z.object({
  title: z.string().optional(),
  tiles: z.array(bingoTileSchema).optional(),
  customization: customizationSchema.partial().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Create a new bingo card
  app.post("/api/cards", async (req, res) => {
    try {
      const parsed = createCardSchema.parse(req.body);
      const card = await storage.createCard(parsed);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid card data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create card" });
      }
    }
  });

  // Get a bingo card by ID
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve card" });
    }
  });

  // Update a bingo card
  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const parsed = updateCardSchema.parse(req.body);
      const card = await storage.updateCard(req.params.id, parsed);
      if (!card) {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      res.json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update card" });
      }
    }
  });

  // Delete a bingo card
  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCard(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Card not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete card" });
    }
  });

  // Get all bingo cards
  app.get("/api/cards", async (_req, res) => {
    try {
      const cards = await storage.getAllCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve cards" });
    }
  });

  return httpServer;
}
