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
import { Scrypt } from "lucia";

type Bindings = {
  DB_VAR: D1Database,
  ENVIRONMENT: string
}
type Variables = {
  lucia_context: any
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>().basePath('/api')

const schema = z.object({
  name: z.string(),
  email: z.string(),
})

type User = z.infer<typeof schema>
let lucia: ReturnType<typeof initializeLucia>

app.use(async (c, next) => {

  const db = drizzle(c.env.DB_VAR);
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users);

   if (!lucia) {
     lucia = initializeLucia(db, c.env.ENVIRONMENT === "production")
   }
 
   c.set('lucia_context', lucia);
   await next()
});

export function initializeLucia(D1: DrizzleD1Database, secure: boolean) {
  const adapter = new DrizzleSQLiteAdapter(D1, sessionTable, users);
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: false,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email
      }
    },
  })
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}


interface DatabaseSessionAttributes {
	country: string;
}
interface DatabaseUserAttributes {
	username: string;
  email: string;
}
export function isValidEmail(email: string): boolean {
	return /.+@.+/.test(email);
}



const route = app
  .post('/users', zValidator('form', schema), async (c) => {
    const { name, email} = c.req.valid('form');

    const db = drizzle(c.env.DB_VAR);
    //const res = await db.insert(users).values({ id: generateId(15), name, email }).returning().get();
    //return c.json({ res });
  })
  .get( async (c) => {

    const db = drizzle(c.env.DB_VAR);
    const result = await db.select().from(users).all()

    return c.json(result)
  });

  const schemaSingup = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });

  //const authHandler = new Hono<{ Bindings: Bindings, Variables: Variables }>().basePath('/api');

  const authExport = app.post('/singup', zValidator('form', schemaSingup), async (c) => {
    const { name, email, password} = c.req.valid('form');

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return c.text('Invalid email', 400)
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return c.text('Invalid password', 400)
    }

    const db = drizzle(c.env.DB_VAR);
    const scrypt = new Scrypt();
    const hashedPassword = await scrypt.hash(password);
    const userId = generateId(15);

    try {
      await db.insert(users).values({ id: userId, name, email, hashed_password: hashedPassword }).returning().get();
  
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return c.json({
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": sessionCookie.serialize()
        }
      }, 302)

      //return c.json(res)

    } catch(err: any) {
      // db error, email taken, etc
      return c.text(err, 400)
    }
  
    //return c.json({ res });
  });

  //app.route('/auth', authHandler);


export type AppType = typeof route
export type AuthType = typeof authExport
export type UsersType = typeof users

export const onRequest = handle(app)