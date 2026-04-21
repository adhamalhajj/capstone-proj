import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/auth/server";
import { ensureDatabaseSchema } from "../../../../../lib/db/schema.js";
import { getSql } from "../../../../../lib/db/client";

export async function GET(req, { params }) {
  const auth = requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await ensureDatabaseSchema();
    const sql = await getSql();

    const rows = await sql`
      SELECT 
        e.id,
        e.status,
        e.pdf_url as "pdfUrl",
        e.pdf_name as "pdfName"
      FROM estimates e
      WHERE e.converted_project_id = ${id}
      ORDER BY e.updated_at DESC
      LIMIT 1
    `;

    const estimate = rows[0];
    return NextResponse.json({ 
      estimate: estimate ? {
        id: estimate.id,
        status: estimate.status,
        pdfUrl: estimate.pdfUrl,
        pdfName: estimate.pdfName
      } : null 
    });
  } catch (error) {
    console.error("LINKED ESTIMATE ERROR:", error);
    return NextResponse.json({ error: "Failed to load linked estimate" }, { status: 500 });
  }
}