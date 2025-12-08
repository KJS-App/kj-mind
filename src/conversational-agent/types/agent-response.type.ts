export interface AgentResponse {
  reply: string; // main natural-language response
  korean?: string;
  romanization?: string;
  meaning?: string;
  explanation?: string;
}
