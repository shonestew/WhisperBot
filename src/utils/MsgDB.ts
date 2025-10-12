import mongoose, { Schema } from "mongoose";
import { ParsedQueryText } from "../types/inlineQueryTypes";
import { Message } from "../types/message";

const MessageSchema = new Schema<Message>({
  msg_id: { type: Number, required: true, unique: true },
  data: { type: Object, required: true }
})

const WhisperMessageModel = mongoose.models.whisper_message || mongoose.model<Message>("whisper_message", MessageSchema)

export default class WhisperMessageDB {
  private msg_id: number

  constructor(msg_id: number) {
    this.msg_id = msg_id
  }

  async saveMessage(msg_query: ParsedQueryText | null): Promise<boolean> {
    if (!msg_query) return false;
    try {
      await WhisperMessageModel.findOneAndUpdate(
        { msg_id: this.msg_id },
        { msg_id: this.msg_id, data: msg_query },
        { upsert: true, new: true }
      )
      return true;
    } catch (e) {
      console.error("Ошибка при сохранении сообщения", e)
      return false;
    }
  }

  async getMessage(): Promise<ParsedQueryText | null> {
    try {
      const doc = await WhisperMessageModel.findOne({ msg_id: this.msg_id })
      return doc ? (doc.data as ParsedQueryText) : null;
    } catch (e) {
      console.error("Ошибка при получении сообщения:", e)
      return null;
    }
  }
}