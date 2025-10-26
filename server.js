import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// --- Firebase ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "crypto-empire7976.firebaseapp.com",
  projectId: "crypto-empire7976",
  storageBucket: "crypto-empire7976.firebasestorage.app",
  messagingSenderId: "376112980961",
  appId: "1:376112980961:web:ebc1c7b7a5727e039468a0",
  measurementId: "G-JM76SQZ7FV"
};
initializeApp(firebaseConfig);

// --- Telegram Bot ---
const BOT_TOKEN = process.env.BOT_TOKEN;
const EXTERNAL_URL = process.env.EXTERNAL_URL;
const WEB_APP_URL = process.env.WEB_APP_URL || "https://profitplay.netlify.app";

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

app.post(`/tg-webhook/${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🎉 *Welcome to ProfitPlay!*  
💰 Earn 30% profit with investment plans.`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Open Web App", web_app: { url: WEB_APP_URL } }],
          [{ text: "📊 View Plans", callback_data: "plans" }]
        ]
      }
    }
  );
});

bot.on("callback_query", (q) => {
  if (q.data === "plans") {
    bot.sendMessage(
      q.message.chat.id,
      `📈 *Plans*  
1️⃣ ₹100 → ₹130 (10 Days)  
2️⃣ ₹200 → ₹260 (20 Days)  
3️⃣ ₹500 → ₹650 (30 Days)`,
      { parse_mode: "Markdown" }
    );
  }
});

app.get("/", (req, res) => res.send("✅ ProfitPlay backend running!"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
  console.log(`Server on port ${PORT}`);
  if (BOT_TOKEN && EXTERNAL_URL) {
    const url = `${EXTERNAL_URL}/tg-webhook/${BOT_TOKEN}`;
    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`
    );
    console.log("✅ Webhook set to", url);
  }
});