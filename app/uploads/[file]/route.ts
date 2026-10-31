import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR, UPLOAD_TYPES } from "@/lib/uploads";

// Uploaded images live in data/uploads (not public/) so files added after `next build` are still served.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  const type = UPLOAD_TYPES[path.extname(name).toLowerCase()];
  if (!type || name !== file) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(data), { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
