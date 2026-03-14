// TODO: Convert the generated script to audio using ElevenLabs TTS
//
// Input:  script: string
// Output: audioUrl: string  (publicly accessible URL Twilio can stream)
//
// Options:
//   A) Call ElevenLabs API → get back audio buffer → upload to temp storage → return URL
//   B) Use ElevenLabs streaming and pipe directly into Twilio <Stream>
//
// Recommended approach for simplicity:
//   - POST to ElevenLabs /v1/text-to-speech/{voice_id}
//   - Write to a temp file or buffer
//   - Serve it from the backend as a static file (GET /audio/:callSid.mp3)
//   - Pass that URL to TwiML <Play>
//
// Voice should be calm, clear, and authoritative (English)

export async function generateAudio(script: string, callSid: string): Promise<string> {
  // TODO: implement — returns a URL to the generated audio
  throw new Error("Not implemented");
}
