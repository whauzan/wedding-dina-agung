import { assertAdminApi } from "@/lib/auth";
import { getWaTemplate, setWaTemplate } from "@/lib/settings";

export async function GET() {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const template = await getWaTemplate();
  return Response.json({ template });
}

export async function PUT(request: Request) {
  const unauthorized = await assertAdminApi();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const template = typeof body?.template === "string" ? body.template.trim() : "";

  if (!template) {
    return Response.json({ error: "Template is required" }, { status: 400 });
  }

  await setWaTemplate(template);
  return Response.json({ template });
}
