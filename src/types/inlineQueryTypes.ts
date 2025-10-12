import { InlineKeyboard } from "grammy";

export type QueryResponse = {
  type: "article";
  id: string;
  title: string;
  input_message_content: {
    message_text: string,
  }
  parse_mode?: string;
  reply_markup?: InlineKeyboard
}

export type ParsedQueryText = {
  ids: number[];
  usernames: string[],
  text: string;
} | null