import { expo } from "@better-auth/expo";
import prisma from "@scanPe/db";
import { env } from "@scanPe/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),

	trustedOrigins: [
		env.CORS_ORIGIN,
		"mybettertapp://",
		...(env.NODE_ENV === "development"
			? [
					"exp://",
					"exp://**",
					"exp://192.168.*.*:*/**",
					"http://localhost:8081",
				]
			: []),
	],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	plugins: [expo()],
	events: {
		async onUserCreate({ user }: { user: { id: string } }) {
			const paymentsCategory = await prisma.category.findFirst({
				where: { name: "Payments", isDefault: true },
			});

			if (paymentsCategory) {
				await prisma.budget.upsert({
					where: {
						userId_categoryId_period: {
							userId: user.id,
							categoryId: paymentsCategory.id,
							period: "daily",
						},
					},
					update: {},
					create: {
						userId: user.id,
						categoryId: paymentsCategory.id,
						limit: 100,
						period: "daily",
						strictMode: false,
					},
				});
			}
		},
	},
});
