import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm/expressions';
import { env } from 'hono/adapter'

import { users } from './schema';

export interface Env {
  DB_VAR: D1Database;
}

// export default {
//   async fetch(request: Request, env: Env) {
//     const db = drizzle(env.<BINDING_NAME>);
//     const result = await db.select().from(users).all()
//     return Response.json(result);
//   },
// };

const app = new Hono<{ Bindings: Env }>().basePath('/api')

const schema = z.object({
  idUser: z.string(),
  name: z.string(),
  email: z.string(),
})

type User = z.infer<typeof schema>

//const users: User[] = []



const route = app
  .post('/users', zValidator('form', schema), async (c) => {
    const { idUser, name, email} = c.req.valid('form')

    //users.push(todo)

    const id = +idUser;

    //const { id, name, email } = await c.req.json();
    const db = drizzle(c.env.DB_VAR);
    const res = await db.insert(users).values({ id, name, email }).returning().get();
    return c.json({ res });
    // return c.json({
    //   message: 'created!',
    // })
  })
  .get( async (c) => {

    const db = drizzle(c.env.DB_VAR);
    const result = await db.select().from(users).all()

    return c.json(result)
  })

export type AppType = typeof route
export type UsersType = typeof users

export const onRequest = handle(app)