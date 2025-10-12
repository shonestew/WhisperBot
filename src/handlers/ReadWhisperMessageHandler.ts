import { Bot } from "grammy";
import MsgDB from "../utils/MsgDB";

export default class ReadWhisperMessageHandler {
  private bot: Bot

  constructor(bot: Bot) {
    this.bot = bot
  }

  execute() {
    this.bot.callbackQuery(/^msg_(\d+)$/, async (ctx) => {
      const msg_id = Number(ctx.callbackQuery.data.replace("msg_", ""))
      const msg_db = new MsgDB(msg_id)
      const msg_info = msg_db.getMsg()

      if (!msg_info) {
        await ctx.answerCallbackQuery({ text: "Сообщение не найдено", show_alert: true })
        return;
      }

      const ids = msg_info.ids || [];
      const usernames = msg_info.usernames || [];
      const text = msg_info.text || "";

      if (
        !ids.includes(ctx.callbackQuery.from.id) &&
        !usernames.includes(ctx.callbackQuery.from?.username || "")
      ) {
        await ctx.answerCallbackQuery({ text: "У вас нет доступа", show_alert: true })
        return;
      }

      await ctx.answerCallbackQuery({ text, show_alert: true })
    })
  }
}