import {
  type BingoCard,
  type BingoTile,
  type Customization,
  bingoCards,
  createEmptyTiles,
  defaultCustomization,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

interface CardInput {
  title?: string;
  tiles?: BingoTile[];
  customization?: Partial<Customization>;
}

export interface IStorage {
  getCard(id: string): Promise<BingoCard | undefined>;
  createCard(card: CardInput): Promise<BingoCard>;
  updateCard(id: string, updates: CardInput): Promise<BingoCard | undefined>;
  deleteCard(id: string): Promise<boolean>;
  getAllCards(): Promise<BingoCard[]>;
}

export class MemoryStorage implements IStorage {
  private cards: Map<string, BingoCard> = new Map();

  async getCard(id: string): Promise<BingoCard | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: CardInput): Promise<BingoCard> {
    const id = randomUUID();
    const card: BingoCard = {
      id,
      title: insertCard.title || "My Goal Bingo",
      tiles: insertCard.tiles || createEmptyTiles(),
      customization: { ...defaultCustomization, ...insertCard.customization },
    };
    this.cards.set(id, card);
    return card;
  }

  async updateCard(id: string, updates: CardInput): Promise<BingoCard | undefined> {
    const existing = this.cards.get(id);
    if (!existing) return undefined;

    const updatedCard: BingoCard = {
      id: existing.id,
      title: updates.title !== undefined ? updates.title : existing.title,
      tiles: updates.tiles !== undefined ? updates.tiles : existing.tiles,
      customization: updates.customization !== undefined 
        ? { ...existing.customization, ...updates.customization }
        : existing.customization,
    };

    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }

  async getAllCards(): Promise<BingoCard[]> {
    return Array.from(this.cards.values());
  }
}

export class DatabaseStorage implements IStorage {
  async getCard(id: string): Promise<BingoCard | undefined> {
    const [card] = await db.select().from(bingoCards).where(eq(bingoCards.id, id));
    return card;
  }

  async createCard(insertCard: CardInput): Promise<BingoCard> {
    const id = randomUUID();
    const card: BingoCard = {
      id,
      title: insertCard.title || "My Goal Bingo",
      tiles: insertCard.tiles || createEmptyTiles(),
      customization: { ...defaultCustomization, ...insertCard.customization },
    };
    await db.insert(bingoCards).values(card);
    return card;
  }

  async updateCard(id: string, updates: CardInput): Promise<BingoCard | undefined> {
    const existing = await this.getCard(id);
    if (!existing) return undefined;

    const updatedCard: BingoCard = {
      id: existing.id,
      title: updates.title !== undefined ? updates.title : existing.title,
      tiles: updates.tiles !== undefined ? updates.tiles : existing.tiles,
      customization: updates.customization !== undefined 
        ? { ...existing.customization, ...updates.customization }
        : existing.customization,
    };

    await db.update(bingoCards).set({
      title: updatedCard.title,
      tiles: updatedCard.tiles,
      customization: updatedCard.customization,
    }).where(eq(bingoCards.id, id));

    return updatedCard;
  }

  async deleteCard(id: string): Promise<boolean> {
    const result = await db.delete(bingoCards).where(eq(bingoCards.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllCards(): Promise<BingoCard[]> {
    return db.select().from(bingoCards);
  }
}

function createStorage(): IStorage {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found, using in-memory storage");
    return new MemoryStorage();
  }
  return new DatabaseStorage();
}

export const storage = createStorage();
