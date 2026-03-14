// TODO: Generate a professional 911 script using Groq LLaMA
//
// Input:
//   type: "police" | "fire" | "ems"
//   address: string
//   zones?: string[]   (body zones for EMS — e.g. ["chest", "left_arm"])
//   age?: number
//
// Output: string — the full script the dispatcher will hear
//
// Example output:
//   "Hello, I am an AI assistant calling on behalf of a non-English speaking
//    patient located at 312 King Street North, Waterloo. The patient is
//    approximately 45 years old and is reporting pain in the chest and left arm.
//    Please send EMS immediately."
//
// Prompt should instruct LLaMA to:
//   - Be calm and professional
//   - Lead with AI context so the dispatcher knows this is automated
//   - State the full address clearly
//   - Describe injury zones in plain anatomical language
//   - End with an explicit request for the right service

export interface ScriptInput {
  type: "police" | "fire" | "ems";
  address: string;
  zones?: string[];
  age?: number;
}

export async function generateScript(input: ScriptInput): Promise<string> {
  // TODO: implement using groq-sdk
  throw new Error("Not implemented");
}
