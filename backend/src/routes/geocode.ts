import { Router, Request, Response } from "express";

// FRONTEND INTEGRATION POINT
// Called by the frontend with raw GPS coords immediately on page load.
// Returns a human-readable street address via Google Maps Reverse Geocoding.
//
// Expected request body:
//   { lat: number, lng: number }
//
// Response:
//   { address: string }

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // --- Uncomment when frontend is ready to integrate ---
  //
  // const { lat, lng } = req.body;
  //
  // if (typeof lat !== "number" || typeof lng !== "number") {
  //   return res.status(400).json({ error: "lat and lng are required numbers" });
  // }
  //
  // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  //
  // const response = await fetch(url);
  // const data = await response.json() as { status: string; results: { formatted_address: string }[] };
  //
  // if (data.status !== "OK" || !data.results[0]) {
  //   return res.status(502).json({ error: "Could not resolve address" });
  // }
  //
  // return res.json({ address: data.results[0].formatted_address });
  // ---

  res.status(503).json({ error: "Not yet integrated" });
});

export default router;
