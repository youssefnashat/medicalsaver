# Lifesaver

A 911 emergency bridge app for non-English speakers. The user taps their emergency type, answers a short visual quiz, marks injured body parts on an interactive body map, and the app places a real outbound call to 911 — speaking on their behalf using an AI-generated script and holding a live conversation with the dispatcher.

Built for Rohingya refugees and other non-English speaking communities.

---

## How it works

1. User selects Police, Medical, or Fire on the home screen
2. For medical: selects symptoms (unconscious, serious illness) and breathing status, then taps injured body zones and severities (bleeding, broken bone, burn, pain) on an interactive body map
3. For police/fire: answers two quick visual questions
4. The app places a real outbound call to 911 via Twilio
5. An AI voice (Groq LLaMA) speaks an opening script to the dispatcher describing the emergency, location, and body injuries
6. The dispatcher's speech is transcribed by Twilio and Groq generates appropriate responses — the conversation loop continues for the duration of the call

---

## Call flow

```
User taps emergency → answers quiz → body map (medical) → POST /api/call
  → store context in Supabase (keyed by UUID)
  → Twilio places outbound call → GET /api/twiml?ctx=<uuid>
      → Groq generates opening script
      → <Say> speaks it to dispatcher
      → <Gather> listens for dispatcher speech
          → POST /api/respond?ctx=<uuid>
              → Groq generates response
              → <Say> speaks it
              → <Gather> listens again  →  loop...
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| AI voice script | Groq (LLaMA 3.1 8B) |
| Outbound calling + TTS + STT | Twilio Voice (`<Say>` + `<Gather>`) |
| Call context storage | Supabase |
| Reverse geocoding | Nominatim (OpenStreetMap) |
| Local tunnel (dev) | ngrok |

---

## Running locally

### Frontend

```bash
npm install
npm run dev        # starts on http://localhost:5173
```

Set `VITE_BACKEND_URL` in a `.env` file at the root if the backend runs on a different port.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in TWILIO_*, GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, PUBLIC_URL
npm run dev        # starts on http://localhost:4000
```

Twilio needs a public URL to reach `/api/twiml` and `/api/respond`. In development, expose the backend with ngrok:

```bash
# from project root
.\start-ngrok.bat
# copy the https URL into backend/.env as PUBLIC_URL
```

---

## Supabase setup

Run once in the Supabase SQL editor:

```sql
CREATE TABLE emergency_calls (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  situation TEXT,
  zones TEXT[],
  age INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Uses the `service_role` key — bypasses RLS entirely.

---

## API routes

| Method | Route | Called by | Description |
|--------|-------|-----------|-------------|
| POST | `/api/call` | Frontend | Start the full call flow |
| POST | `/api/geocode` | Frontend | Reverse geocode GPS coords to address |
| GET/POST | `/api/twiml` | Twilio | Opening script + start of conversation loop |
| POST | `/api/respond` | Twilio | Each turn of the live dispatcher conversation |

---

## Project structure

```
lifesaver/
├── src/                          # React frontend
│   ├── components/
│   │   ├── HomeScreen.jsx        # Emergency type selection
│   │   ├── QuizScreen.jsx        # Symptom + situation questions
│   │   ├── BodySelector.jsx      # Interactive body map (medical)
│   │   ├── CallingScreen.jsx     # Live call UI + dispatch phrase
│   │   └── ConfirmScreen.jsx     # Post-call confirmation
│   ├── emergencyQuizLogic.js     # Question config + dispatch phrase generation
│   └── App.jsx
├── backend/
│   └── src/
│       ├── routes/
│       │   ├── call.ts           # POST /api/call
│       │   ├── geocode.ts        # POST /api/geocode
│       │   ├── twiml.ts          # GET  /api/twiml  (Twilio webhook)
│       │   └── respond.ts        # POST /api/respond (Twilio webhook)
│       ├── services/
│       │   ├── groqService.ts    # Opening script + response generation
│       │   ├── twilioService.ts  # Outbound call placement
│       │   └── supabaseService.ts
│       └── utils/
│           └── xml.ts            # XML escaping for TwiML safety
└── start-ngrok.bat               # Dev tunnel helper
```
