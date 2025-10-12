import { Document } from "mongoose";
import { ParsedQueryText } from "./inlineQueryTypes";

export interface Message extends Document {
  msg_id: number;
  data: ParsedQueryText
}