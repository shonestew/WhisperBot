import fs from "fs";
import { ParsedQueryText } from "../types/inlineQueryTypes";

export default class MsgDB {
  private msg_id: number

  constructor(msg_id: number) {
    this.msg_id = msg_id
  }

  addMsg(msg_query: ParsedQueryText | null): boolean {
    if (!msg_query) return false

    try {
      const file_raw = fs.readFileSync("./db/message_list.json")
      const data = JSON.parse(String(file_raw))

      data[this.msg_id] = msg_query

      fs.writeFileSync("./db/message_list.json", JSON.stringify(data, null, 2))

      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  getMsg(): ParsedQueryText | null {
    const file_raw = fs.readFileSync("./db/message_list.json", "utf-8")
    const data = JSON.parse(file_raw)

    const key = String(this.msg_id)

    return data[key] ?? null;
  }
}