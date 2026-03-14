import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ZONE_LABELS: Record<string, string> = {
  head: "head",
  chest: "chest",
  abdomen: "abdomen",
  left_arm: "left arm",
  right_arm: "right arm",
  left_leg: "left leg",
  right_leg: "right leg",
};

export interface ScriptInput {
  type: "police" | "fire" | "ems";
  address: string;
  zones?: string[];
  age?: number;
}

export async function generateScript(input: ScriptInput): Promise<string> {
  const { type, address, zones, age } = input;

  const serviceLabel = { police: "police", fire: "fire department", ems: "EMS" }[type];
  const subjectLabel = type === "ems" ? "patient" : "individual";

  const zoneText =
    zones && zones.length > 0
      ? zones.map((z) => ZONE_LABELS[z] ?? z).join(" and ")
      : null;

  const ageText = age ? `approximately ${age} years old` : null;

  let patientDetails = "";
  if (type === "ems") {
    const parts = [
      ageText ? `The patient is ${ageText}` : "",
      zoneText ? `and is reporting pain in the ${zoneText}` : "",
    ].filter(Boolean);
    patientDetails = parts.join(" ") + ".";
  }

  const prompt = [
    `You are generating a 911 emergency script to be spoken by an AI voice to a dispatcher.`,
    `Emergency type: ${type}`,
    `Location: ${address}`,
    patientDetails ? `Patient details: ${patientDetails}` : "",
    ``,
    `Write the script following these rules exactly:`,
    `- Open with: "Hello, I am an AI assistant calling on behalf of a non-English speaking ${subjectLabel}."`,
    `- State the full address clearly on the next sentence.`,
    type === "ems" && patientDetails
      ? `- Include the patient's age and the body zones they reported.`
      : `- Describe the emergency type clearly.`,
    `- Close with: "Please send ${serviceLabel} immediately."`,
    `- Keep the total script under 70 words.`,
    `- Output only the script — no labels, no explanations, no quotes.`,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 200,
  });

  const script = completion.choices[0]?.message?.content?.trim();
  if (!script) throw new Error("Groq returned an empty response");

  return script;
}
