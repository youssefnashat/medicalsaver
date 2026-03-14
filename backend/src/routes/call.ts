import { Router, Request, Response } from "express";
import { generateScript } from "../services/groqService";
import { generateAudio } from "../services/elevenLabsService";
import { uploadAudio } from "../services/supabaseService";
import { placeCall } from "../services/twilioService";

// FRONTEND INTEGRATION POINT
// Called by the frontend when the user confirms the emergency.
// Orchestrates the full flow: script → audio → upload → call.
//
// Expected request body:
//   {
//     type: "police" | "fire" | "ems",
//     address: string,
//     coords: { lat: number, lng: number },
//     zones?: string[],   // EMS only — e.g. ["chest", "left_arm"]
//     age?: number
//   }
//
// Response:
//   { success: true, callSid: string }

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // --- Uncomment when frontend is ready to integrate ---
  //
  // const { type, address, zones, age } = req.body;
  //
  // if (!type || !address) {
  //   return res.status(400).json({ error: "type and address are required" });
  // }
  //
  // // 1. Generate the 911 script via Groq LLaMA
  // const script = await generateScript({ type, address, zones, age });
  //
  // // 2. Convert script to audio via ElevenLabs
  // const audioBuffer = await generateAudio(script);
  //
  // // 3. Upload audio to Supabase Storage and get a public URL
  // const fileName = `call-${Date.now()}.mp3`;
  // const audioUrl = await uploadAudio(audioBuffer, fileName);
  //
  // // 4. Build the TwiML webhook URL — Twilio fetches this when the call connects
  // const twimlUrl = `${process.env.PUBLIC_URL}/api/twiml?audio=${encodeURIComponent(audioUrl)}`;
  //
  // // 5. Place the outbound call via Twilio
  // const callSid = await placeCall(twimlUrl);
  //
  // return res.json({ success: true, callSid });
  // ---

  res.status(503).json({ error: "Not yet integrated" });
});

export default router;
