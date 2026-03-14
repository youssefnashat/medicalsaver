# EmergiBridge — Backend

REST API backend for EmergiBridge, a 911 emergency bridge app for non-English speakers.

The backend handles script generation, text-to-speech, and placing the actual outbound call to 911.

## What it does

1. Accepts an emergency call request from the frontend (type, address, body zones)
2. Generates a professional 911 script via Groq LLaMA
3. Converts the script to audio via ElevenLabs
4. Places an outbound call to 911 via Twilio
5. Serves a TwiML webhook so Twilio plays the audio when the call connects

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/call` | Trigger the full call flow |
| POST | `/api/geocode` | Reverse geocode GPS coords to a street address |
| GET | `/api/twiml` | Twilio webhook — returns TwiML to play audio on call connect |

### `POST /api/call`

```json
{
  "type": "police" | "fire" | "ems",
  "address": "312 King Street North, Waterloo",
  "coords": { "lat": 43.47, "lng": -80.52 },
  "zones": ["chest", "left_arm"],
  "age": 45
}
```

Response:
```json
{ "success": true, "callSid": "CA..." }
```

### `POST /api/geocode`

```json
{ "lat": 43.47, "lng": -80.52 }
```

Response:
```json
{ "address": "312 King Street North, Waterloo, ON" }
```

## Tech Stack

| Purpose | Service |
|---------|---------|
| Script generation | Groq LLaMA |
| Text-to-speech | ElevenLabs |
| Outbound call | Twilio Voice API |
| Reverse geocoding | Google Maps Geocoding API |
| Runtime | Node.js + Express + TypeScript |

## Setup

```bash
npm install
cp .env.example .env
# fill in API keys
npm run dev
```

## Environment Variables

```
PORT=4000
FRONTEND_URL=http://localhost:3000

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=+1xxxxxxxxxx
TWILIO_TO_NUMBER=+1xxxxxxxxxx     # 911 in prod, test number in dev

GROQ_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
GOOGLE_MAPS_API_KEY=

# Must be publicly reachable by Twilio — use ngrok in dev
PUBLIC_URL=https://your-ngrok-url.ngrok.io
```

> In development, run `ngrok http 4000` and set `PUBLIC_URL` to your ngrok URL so Twilio can reach the `/api/twiml` webhook.

## Project Structure

```
backend/
├── src/
│   ├── index.ts                   # Express app entry
│   ├── routes/
│   │   ├── call.ts                # POST /api/call
│   │   ├── geocode.ts             # POST /api/geocode
│   │   └── twiml.ts               # GET /api/twiml (Twilio webhook)
│   └── services/
│       ├── groqService.ts         # Groq LLaMA script generation
│       ├── twilioService.ts       # Twilio outbound call
│       └── elevenLabsService.ts   # ElevenLabs TTS → audio file
├── tmp/                           # Generated audio files (gitignored)
├── .env.example
├── package.json
└── tsconfig.json
```
