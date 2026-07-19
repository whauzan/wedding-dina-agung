import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !verifyPassword(password)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  await setSessionCookie();
  return Response.json({ ok: true });
}
