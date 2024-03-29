import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text("id").notNull().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	// hashed_password: text('hashed_password').notNull()
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull()
});
