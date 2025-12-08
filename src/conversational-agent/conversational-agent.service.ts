import { Injectable } from "@nestjs/common";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

@Injectable()
export class ConversationalAgentService {
  private llm;
  private parser;
  private chain;

  constructor() {
    // 1. Define expected JSON schema
    this.parser = StructuredOutputParser.fromZodSchema(
      z.object({
        reply: z.string().describe("Natural friendly response to the user"),
        korean: z.string().describe("Korean phrase or word being taught"),
        romanization: z
          .string()
          .describe("Romanized pronunciation of the Korean text"),
        meaning: z.string().describe("Meaning in Sinhala or English.If the user speaks Sinhala, respond in Sinhala"),
        explanation: z.string().describe("Teaching-style description")
      })
    );

    // 2. Gemini Model via LangChain driver
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-preview-09-2025",
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // 3. Construct a prompt
    // Escape braces in format instructions so prompt template parsing
    // doesn't mistake JSON braces for template placeholders.
    const formatInstructions = this.parser.getFormatInstructions();
    const escapedFormatInstructions = formatInstructions.replace(/\{/g, "{{").replace(/\}/g, "}}");

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `
You are a Korean language tutor.
Detect whether the user speaks English or Sinhala.
Respond with friendly explanations.

You MUST return ONLY valid JSON matching this schema:

${escapedFormatInstructions}
`
      ],
      ["user", "{input}"]
    ]);

    // 4. Build the LangChain runnable pipeline
    this.chain = prompt.pipe(this.llm).pipe(this.parser);
  }

  async runAgent(userMessage: string) {
    try {
      const result = await this.chain.invoke({
        input: userMessage,
      });

      return result;
    } catch (err) {
      return {
        reply: "Sorry, I could not process your message.",
        korean: "",
        romanization: "",
        meaning: "",
        explanation: ""
      };
    }
  }
}
