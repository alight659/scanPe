import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";
import ws from "ws";

import { PrismaClient } from "./generated/client";

// Load environment variables
config({ path: "../../apps/server/.env" });

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const defaultCategories = [
	{ name: "Food", icon: "utensils", color: "#F59E0B", isDefault: true },
	{ name: "Entertainment", icon: "film", color: "#8B5CF6", isDefault: true },
	{ name: "Shopping", icon: "shopping-bag", color: "#EC4899", isDefault: true },
	{ name: "Transport", icon: "truck", color: "#3B82F6", isDefault: true },
	{ name: "Utilities", icon: "zap", color: "#F97316", isDefault: true },
	{ name: "Health", icon: "heart", color: "#EF4444", isDefault: true },
	{ name: "Education", icon: "book", color: "#10B981", isDefault: true },
	{ name: "Travel", icon: "map-pin", color: "#06B6D4", isDefault: true },
	{ name: "Personal Care", icon: "smile", color: "#84CC16", isDefault: true },
	{ name: "Payments", icon: "credit-card", color: "#6366F1", isDefault: true },
	{
		name: "Others",
		icon: "more-horizontal",
		color: "#6B7280",
		isDefault: true,
	},
];

async function seed() {
	console.log("Seeding default categories...");

	for (const category of defaultCategories) {
		await prisma.category.upsert({
			where: { name: category.name },
			update: {},
			create: category,
		});
	}

	console.log("Seeding default Payments budget for existing users...");

	// Find the Payments category
	const paymentsCategory = await prisma.category.findFirst({
		where: { name: "Payments", isDefault: true },
	});

	if (paymentsCategory) {
		// Get all users
		const users = await prisma.user.findMany();

		for (const user of users) {
			// Check if user already has a daily Payments budget
			const existingBudget = await prisma.budget.findFirst({
				where: {
					userId: user.id,
					categoryId: paymentsCategory.id,
					period: "daily",
				},
			});

			// If not, create one
			if (!existingBudget) {
				await prisma.budget.create({
					data: {
						userId: user.id,
						categoryId: paymentsCategory.id,
						limit: 100,
						period: "daily",
						strictMode: false,
					},
				});
			}
		}
	}

	console.log("Seeding completed!");
}

seed()
	.catch((e) => {
		console.error("Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
