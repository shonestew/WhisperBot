import { Bot } from "grammy";

export default class StartCommandHandler {
  private bot: Bot

  constructor(bot: Bot) {
    this.bot = bot
  }

  execute() {
    this.bot.on("message:text").command("start", async (ctx) => {
      ctx.reply(`Привет, это бот для создания прошептанных сообщении, которые предназначены для одного или нескольких пользователей, айди или юзернейм которых указаны.

Как использовать бота:
@${ctx.me.username} [id:username] [message]

Пример использования:
@${ctx.me.username} 123456 привет
@${ctx.me.username} 123456:username привет1`, {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: "HTML"
      })
    })
  }
}