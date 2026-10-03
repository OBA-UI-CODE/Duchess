import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) { return updateSession(request); }

// Public catalogue pages do not need an authentication round-trip.
export const config = { matcher: ["/account/:path*"] };
