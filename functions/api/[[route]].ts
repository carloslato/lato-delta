import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
// import { eq } from 'drizzle-orm/expressions';
// import { env } from 'hono/adapter';
import { generateId } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { users, sessionTable } from './schema';

type Bindings = {
  DB_VAR: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

const schema = z.object({
  name: z.string(),
  email: z.string(),
})

type User = z.infer<typeof schema>

app.use(async (c) => {

  const db = drizzle(c.env.DB_VAR);
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users);

  const lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: process.env.NODE_ENV === "production"
      }
    }
  });

})

 // IMPORTANT!
 declare module "lucia" {
  interface Register {
    Lucia: any;
    //		Lucia: typeof lucia;
  }
}

const route = app
  .post('/users', zValidator('form', schema), async (c) => {
    const { name, email} = c.req.valid('form')

    const db = drizzle(c.env.DB_VAR);
    const res = await db.insert(users).values({ id: generateId(15), name, email }).returning().get();
    return c.json({ res });
  })
  .get( async (c) => {

    const db = drizzle(c.env.DB_VAR);
    const result = await db.select().from(users).all()

    return c.json(result)
  });

export type AppType = typeof route
export type UsersType = typeof users

export const onRequest = handle(app)
