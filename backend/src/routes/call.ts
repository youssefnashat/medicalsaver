import { Router, Request, Response } from "express";

// TODO: POST /api/call
// Body: { type: "police"|"fire"|"ems", address: string, coords: { lat, lng }, zones?: string[], age?: number }
//
// Flow:
//   1. generateScript() — Groq LLaMA builds the 911 message
//   2. placeCall()      — Twilio initiates outbound call to 911
//   3. On call connect, TwiML streams ElevenLabs TTS audio of the script
//
// Returns: { success: boolean, callSid: string }

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // TODO: implement
  res.status(501).json({ error: "Not implemented" });
});

export default router;
