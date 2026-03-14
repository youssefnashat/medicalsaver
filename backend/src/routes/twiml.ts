import { Router, Request, Response } from "express";

// Twilio fetches this endpoint when the call connects.
// We pass the audio URL as a query param when creating the Twilio call,
// so no server-side state is needed.
//
// Example Twilio call creation:
//   url: `${PUBLIC_URL}/api/twiml?audio=<encoded-supabase-url>`

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const audioUrl = req.query.audio as string | undefined;

  res.set("Content-Type", "text/xml");

  if (audioUrl) {
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>` +
        `<Response><Play>${audioUrl}</Play></Response>`
    );
  } else {
    // Fallback if audio URL is missing — Twilio's built-in TTS
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>` +
        `<Response><Say voice="alice">Emergency assistance has been requested. Please send help immediately.</Say></Response>`
    );
  }
});

export default router;
