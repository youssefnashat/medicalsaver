# EmergiBridge Backend — Implementation Plan

> Awaiting approval before implementation begins.

---

## Step 1 — Geocoding route (`POST /api/geocode`)

- Accept `{ lat, lng }`
- Call Google Maps Reverse Geocoding API
- Return `{ address: string }`
- No dependencies — build and test first in isolation

## Step 2 — Groq script generation (`src/services/groqService.ts`)

- Initialize `groq-sdk` with `GROQ_API_KEY`
- Build a system prompt instructing LLaMA to:
  - Stay under ~60 words
  - Open with: *"Hello, I am an AI assistant calling on behalf of a non-English speaking patient..."*
  - State full address, patient age (if provided), body zones (EMS only)
  - Close with the explicit service request: *"Please send EMS/Police/Fire immediately."*
- Handle all three emergency types with type-appropriate prompts

## Step 3 — ElevenLabs audio generation (`src/services/elevenLabsService.ts`)

- POST to `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- Write audio buffer to `backend/tmp/{callSid}.mp3`
- Serve `tmp/` as static: `app.use("/audio", express.static("tmp"))`
- Return `${PUBLIC_URL}/audio/{callSid}.mp3`

## Step 4 — TwiML webhook (`GET /api/twiml?callSid=xxx`)

- Look up the audio URL for the given `callSid`
- Return:
  ```xml
  <Response><Play>{audioUrl}</Play></Response>
  ```
- Fallback: `<Say>` the raw script text if audio is missing

## Step 5 — Twilio call placement (`src/services/twilioService.ts`)

- Initialize Twilio client with `ACCOUNT_SID` / `AUTH_TOKEN`
- `client.calls.create({ from, to, url: PUBLIC_URL/api/twiml?callSid=xxx })`
- Return `callSid`

## Step 6 — Full call route (`POST /api/call`)

Wire steps 2–5 together:

```
1. generateScript(type, address, zones, age)
2. generateAudio(script, callSid)         → writes tmp/{callSid}.mp3
3. storePendingCall(callSid, audioUrl)    → in-memory Map
4. placeCall(callSid, twimlUrl)           → Twilio dials out
5. return { success: true, callSid }
```

## Step 7 — Dev testing

- `ngrok http 4000` → set `PUBLIC_URL` in `.env`
- Set `TWILIO_TO_NUMBER` to a personal number (not 911)
- Fire a test request, verify call comes in with correct ElevenLabs voice
- Test all three emergency types

## Edge cases to handle

- Google Maps API failure → return `{ address: null }`, frontend falls back to raw coords
- Groq timeout → 503 with message
- ElevenLabs failure → fall back to Twilio `<Say>` (plain TTS)
- Twilio call failure → return error so frontend can display "call failed, dial 911 directly"
