import { type User, type InsertUser, type PaymentRequest, type InsertPaymentRequest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPaymentRequest(request: InsertPaymentRequest): Promise<PaymentRequest>;
  getPaymentRequest(id: string): Promise<PaymentRequest | undefined>;
  updatePaymentRequestStatus(id: string, status: "pending" | "completed" | "expired"): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private paymentRequests: Map<string, PaymentRequest>;

  constructor() {
    this.users = new Map();
    this.paymentRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPaymentRequest(request: InsertPaymentRequest): Promise<PaymentRequest> {
    const id = randomUUID();
    const paymentRequest: PaymentRequest = {
      ...request,
      id,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    this.paymentRequests.set(id, paymentRequest);
    return paymentRequest;
  }

  async getPaymentRequest(id: string): Promise<PaymentRequest | undefined> {
    return this.paymentRequests.get(id);
  }

  async updatePaymentRequestStatus(id: string, status: "pending" | "completed" | "expired"): Promise<void> {
    const request = this.paymentRequests.get(id);
    if (request) {
      request.status = status;
      this.paymentRequests.set(id, request);
    }
  }
}

export const storage = new MemStorage();
