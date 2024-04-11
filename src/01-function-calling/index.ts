/*
 * Sample code from https://platform.openai.com/docs/api-reference/chat/create, lightly TS-ified
 */

import OpenAI from "openai";

const input =
  process.argv.slice(2).join(" ") ?? "Who's trending on Artsy right now?";

const openai = new OpenAI();

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      `You are a helpful assistant that can provide information about the art world via Artsy's platform. ` +
      ` ` +
      `If you receive a question that cannot be answered with one of your known tools, do not force a tool response. ` +
      `Instead ask for clarification or say that you don't know how to answer the question. ` +
      ` `,
  },
  {
    role: "user",
    content: input,
  },
];

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_artists",
      description: `Get a list of artists on Artsy. Artists may be sorted chronologically by creation date, alphabetically by name, or in descending order of a popularity/trending score.`,
      parameters: {
        type: "object",
        properties: {
          size: {
            type: "integer",
            description: "The number of artists to return",
            default: 5,
            minimum: 1,
            maximum: 20,
          },
          sort: {
            type: "string",
            description: "The sort order in which to return artists",
            default: "SORTABLE_ID_ASC",
            enum: [
              "CREATED_AT_ASC",
              "CREATED_AT_DESC",
              "SORTABLE_ID_ASC",
              "SORTABLE_ID_DESC",
              "TRENDING_DESC",
            ],
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_curated_artists",
      description: `Get a list of curated artists on Artsy. These are artists whose works have been highlighted by Artsy curators, and may change from week to week.`,
      parameters: {
        type: "object",
        properties: {
          size: {
            type: "integer",
            description: "The number of artists to return",
            default: 5,
            minimum: 1,
            maximum: 20,
          },
        },
        required: ["location"],
      },
    },
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  temperature: 0,
  messages,
  tools,
  tool_choice: "auto",
});

console.log(JSON.stringify(messages));
console.log(JSON.stringify(response.choices[0]));
