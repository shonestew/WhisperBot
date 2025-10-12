import { ParsedQueryText } from "../types/inlineQueryTypes";

export const parseQueryText = (
  query_text: string,
): ParsedQueryText | null => {
  const pattern = /^(?:@\w+\s+)?([\w:]+)\s+(.+)$/

  const match = query_text.match(pattern)
  if (!match) return null;

  const [, idsAndNamesStr, text] = match

  const parts = idsAndNamesStr.split(":")

  const ids: number[] = []
  const usernames: string[] = [];

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      ids.push(Number(part))
    } else {
      usernames.push(part)
    }
  }

  return { ids, usernames, text };
}