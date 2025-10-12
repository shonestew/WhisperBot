import { Bot, InlineKeyboard } from "grammy";
import { parseQueryText } from "../utils/parseQueryText.ts";
import { QueryResponse } from "../types/inlineQueryTypes.ts";
import { generateMsgId } from "../utils/generateMsgId.ts";
import MsgDB from "../utils/MsgDB.ts";

export default class InlineModeHandler {
  private bot: Bot

  constructor(bot: Bot) {
    this.bot = bot
  }

  execute() {
    this.bot.on("inline_query", async (ctx) => {
      const query_text = ctx.inlineQuery.query || ""
      const parsed_query_text = parseQueryText(query_text)
      let query_res: QueryResponse[] = []

      if (!query_text) {
        query_res.push({
          type: "article",
          id: "1",
          title: "Введите юзернейм(ы) или айди",
          input_message_content: {
            message_text: `Как использовать бота:
@${ctx.me.username} [id:username] [message]

Пример использования:
@${ctx.me.username} 123456 привет
@${ctx.me.username} 123456:username привет1`
          },
          parse_mode: "HTML"
        })
      } else if (!parsed_query_text) {
        query_res.push({
          type: "article",
          id: "2",
          title: "Ошибка ввода",
          input_message_content: {
            message_text: `Как использовать бота:
@${ctx.me.username} [id:username] [message]

Пример использования:
@${ctx.me.username} 123456 привет
@${ctx.me.username} 123456:username привет1`
          }
        })
      } else {
        const msg_id = generateMsgId()
        await new MsgDB(msg_id).saveMessage(parsed_query_text)

        const keyboard = new InlineKeyboard().text("Открыть сообщение", `msg_${msg_id}`)

        const recipients = [
          ...parsed_query_text.usernames.map(u => `@${u}`)
        ]

        query_res.push({
          type: "article",
          id: "3",
          title: "Прошептать сообщение",
          input_message_content: {
            message_text: `Прошёптанное сообщение для:\n${recipients.join(", ")}\n\nТолько вышеперечисленные пользователи с тем же юзернеймом/айди могут прочитать сообщение.`
          },
          reply_markup: keyboard
        })
      }

      try {
        await ctx.answerInlineQuery(query_res, { cache_time: 0 })
      } catch (err) {
        console.error("Ошибка при answerInlineQuery:", err)
      }
    })
  }
}