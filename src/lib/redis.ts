import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

// File-based fallback for local development if Upstash keys are missing
// Turbopack uses isolated workers, so memory maps won't sync across requests!
const DB_PATH = path.join(process.cwd(), '.mock-redis.json');

function getMockDB(): Record<string, string[]> {
  try {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveMockDB(data: Record<string, string[]>) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data));
}

class MockRedis {
  async get(key: string) {
    const db = getMockDB();
    const val = db[key];
    return val ? val[0] : null;
  }
  async set(key: string, value: string) {
    const db = getMockDB();
    db[key] = [value];
    saveMockDB(db);
    return "OK";
  }
  async lpush(key: string, ...values: string[]) {
    const db = getMockDB();
    const list = db[key] || [];
    db[key] = [...values.reverse(), ...list];
    saveMockDB(db);
    return db[key].length;
  }
  async lrange(key: string, start: number, end: number) {
    const db = getMockDB();
    const list = db[key] || [];
    return list.slice(start, end + 1);
  }
  async ltrim(key: string, start: number, end: number) {
    const db = getMockDB();
    const list = db[key] || [];
    db[key] = list.slice(start, end + 1);
    saveMockDB(db);
    return "OK";
  }
}

const hasUpstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasUpstash 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : new MockRedis() as unknown as Redis;
