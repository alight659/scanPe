import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { auth } from "@scanPe/auth";
import { env } from "@scanPe/env/server";
import { generateText, wrapLanguageModel } from "ai";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

const app = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

// System prompt for scanPe support assistant
const SYSTEM_PROMPT = `You are a helpful support assistant for scanPe, a mobile budgeting and QR payment app.

Your role is to help users with:

1. BUDGET MANAGEMENT:
   - How daily and monthly budgets work
   - Setting up budget limits (go to Budgets tab, use sliders)
   - Understanding spending alerts when you exceed 60% of budget
   - What happens when you're out of budget (Strict Mode blocks payments)
   - How to check current budget (Home screen shows circular chart)
   - Daily vs Monthly budget differences

2. PAYMENTS & QR SCANNING:
   - How to scan QR codes (tap center Scan button)
   - What happens during a scan (3-second recognition, payment preview)
   - How payments affect your budget (shown before confirming)
   - Transaction history and recent activity

3. APP FEATURES:
   - Home dashboard: Budget ring, spending alerts, recent transactions
   - Budget tab: Set limits, view progress bars, enable Strict Mode
   - Profile: Edit info, change theme (Light/Dark/System), get help
   - Theme switching and app customization

4. STRICT MODE:
   - What it does (prevents payments when budget exceeded)
   - How to enable/disable it (Budget tab toggle)
   - Why you might want it (avoid overspending)

5. TROUBLESHOOTING:
   - QR code not scanning (ensure good lighting, hold steady)
   - Budget not updating (pull down to refresh)
   - App performance issues (restart app, check internet)
   - Login problems (check credentials, use Sign Out and back in)

Keep responses concise (2-4 sentences), friendly, and actionable. Use emojis occasionally for warmth. If you don't know something specific, suggest contacting support@scanpe.app.

Current features available:
✓ Budget dashboard with circular progress chart
✓ Daily/Monthly budget toggles
✓ Spending alerts when >60% budget used
✓ QR code scanning for payments
✓ Transaction history with merchant details
✓ Dark/Light/System theme support
✓ Strict mode to prevent over-budget spending`;

// Simple message format from frontend
interface SimpleMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

app.post("/ai", async (req, res) => {
	try {
		const { messages = [] } = (req.body || {}) as { messages: SimpleMessage[] };

		if (!messages.length) {
			return res.status(400).json({ error: "No messages provided" });
		}

		// Find the last user message
		const lastUserMessage = [...messages]
			.reverse()
			.find((m) => m.role === "user");

		if (!lastUserMessage) {
			return res.status(400).json({ error: "No user message found" });
		}

		// Create conversation history for context
		const conversationHistory = messages
			.filter((m) => m.role === "user" || m.role === "assistant")
			.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
			.join("\n");

		// Prepare the prompt with system context and conversation
		const prompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${conversationHistory}\n\nPlease provide a helpful response to the user's last question.`;

		const model = wrapLanguageModel({
			model: google("gemini-2.5-flash"),
			middleware: devToolsMiddleware(),
		});

		const result = await generateText({
			model,
			prompt: prompt,
		});

		// Return simple JSON response
		res.json({
			role: "assistant",
			content: result.text,
		});
	} catch (error) {
		console.error("[AI] Error:", error);
		res.status(500).json({
			error: "Failed to generate response",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
