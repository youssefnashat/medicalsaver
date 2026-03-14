import { Router, Request, Response } from "express";

// TODO: GET /api/twiml?callSid=xxx
// Twilio fetches this URL when the call connects.
// This route returns TwiML XML that instructs Twilio to:
//   1. Fetch the pre-generated ElevenLabs audio URL for this callSid, OR
//   2. Use <Say> with the generated script as a fallback
//
// Example TwiML:
//   <Response>
//     <Play>https://...elevenlabs-audio.mp3</Play>
//   </Response>

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // TODO: implement
  res.set("Content-Type", "text/xml");
  res.status(501).send("<Response><Say>Not implemented</Say></Response>");
});

export default router;
