export type AIMessage = { role: "system" | "user" | "assistant"; content: string };

export interface AIProvider {
  readonly name: string;
  chat(messages: AIMessage[]): Promise<string>;
  summarize(content: string): Promise<string>;
}
