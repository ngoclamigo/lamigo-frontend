import OpenAI from "openai";
import { envConfig } from "~/config/env.config";

export const openai = new OpenAI({
  apiKey: envConfig.openai.apiKey,
});
