import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@db/schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const g = globalThis as unknown as { __schoolDb?: Db };

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  const client = postgres(url, { max: 10 });
  return drizzle(client, { schema });
}

function getDb(): Db {
  g.__schoolDb ??= createDb();
  return g.__schoolDb;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
