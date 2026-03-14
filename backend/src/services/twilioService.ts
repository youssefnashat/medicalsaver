import twilio from "twilio";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    throw new Error("Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN");
  }

  return twilio(sid, token);
}

// Places an outbound call via Twilio.
// twimlUrl must be a publicly reachable URL that returns TwiML XML.
// Twilio fetches it when the call connects and follows its instructions.
// Returns the Twilio call SID.
export async function placeCall(twimlUrl: string): Promise<string> {
  const client = getClient();
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.TWILIO_TO_NUMBER;

  if (!from || !to) {
    throw new Error("Missing TWILIO_FROM_NUMBER or TWILIO_TO_NUMBER");
  }

  const call = await client.calls.create({ from, to, url: twimlUrl });
  return call.sid;
}
