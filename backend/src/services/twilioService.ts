// TODO: Place an outbound 911 call via Twilio Voice API
//
// Flow:
//   1. Create a Twilio call from TWILIO_FROM_NUMBER to TWILIO_TO_NUMBER (911 or test)
//   2. Set the call's url to our /api/twiml endpoint (Twilio fetches this on connect)
//   3. Return the callSid for tracking
//
// Notes:
//   - Store { callSid -> script } in memory or Redis so /api/twiml can look it up
//   - For testing, use a Twilio test number instead of 911
//   - The backend must be publicly reachable by Twilio (use ngrok in dev)

export async function placeCall(callSid: string, twimlUrl: string): Promise<string> {
  // TODO: implement using twilio npm package
  throw new Error("Not implemented");
}
