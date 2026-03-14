import { Router, Request, Response } from "express";

// TODO: POST /api/geocode
// Body: { lat: number, lng: number }
//
// Uses Google Maps Geocoding API (reverse geocoding) to turn
// GPS coordinates into a human-readable street address
//
// Returns: { address: string }

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // TODO: implement
  res.status(501).json({ error: "Not implemented" });
});

export default router;
