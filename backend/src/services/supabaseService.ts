import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }

  return createClient(url, key);
}

// Uploads an MP3 buffer to Supabase Storage and returns its public URL.
// The bucket must exist and be set to public in the Supabase dashboard.
export async function uploadAudio(buffer: Buffer, fileName: string): Promise<string> {
  const supabase = getClient();
  const bucket = process.env.SUPABASE_BUCKET ?? "emergency-audio";

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return data.publicUrl;
}
