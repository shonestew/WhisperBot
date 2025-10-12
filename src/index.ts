import { Bot } from "grammy"
import { connect } from "mongoose"
import { config } from "dotenv"

import StartCommandHandler from "./handlers/StartCommandHandler.ts"
import InlineModeHandler from "./handlers/InlineModeHandler.ts"
import ReadWhisperMessageHandler from "./handlers/ReadWhisperMessageHandler.ts"

config()

async function main() {
  const token = process.env.BOT_TOKEN
  if (!token) throw new Error("BOT_TOKEN in .env is empty")

  const mongo_url = process.env.MONGO_URL
  if (!mongo_url) throw new Error("MONGO_URL is empty!")

  const mongo_db_name = process.env.MONGO_DB_NAME
  if (!mongo_db_name) throw new Error("MONGO_DB_NAME is empty!")

  const bot = new Bot(token)

  const handlers = [
    new InlineModeHandler(bot),
    new StartCommandHandler(bot),
    new ReadWhisperMessageHandler(bot)
  ]

  handlers.forEach(handler => handler.execute())

  try {
    await connect(mongo_url, { dbName: mongo_db_name })
    console.log("✅ Подключение к MongoDB прошло успешно!")
  } catch (err) {
    console.error("❌ Ошибка при подключении к MongoDB:", err)
    process.exit(1)
  }

  bot.start()
  console.log("🤖 Бот запущен и готов к работе!")
}

main()