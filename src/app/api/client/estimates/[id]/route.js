import { NextResponse } from "next/server";
import { ensureDatabaseSchema } from "../../../../lib/db/schema.js";
import { getSql } from "../../../../lib/db/client";
import { getRequestUser } from "../../../../lib/auth/server";
import { findEstimateById } from "../../../../lib/db/estimates.js";
export async function GET(req, { params }) {
  try {
    const user = getRequestUser(req);
    if (!user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await ensureDatabaseSchema();
    const sql = await getSql(); // Remove await if not needed

    // Authorization check
    const rows = await sql`
      SELECT e.id, c.email AS client_email
      FROM estimates e
      JOIN clients c ON c.id = e.client_id
      WHERE e.id = ${id}
      LIMIT 1
    `;

    const ownedEstimate = rows[0];
    if (!ownedEstimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    if (ownedEstimate.client_email !== user.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // NEW: Fetch FULL estimate with ALL fields needed for PDF
    const estimateRes = await sql`
      SELECT 
        e.id, e.title, e.service, e.price, e.status, e.notes,
        e.recipient_name, e.recipient_address, e.recipient_email, e.recipient_phone,
        e.pdf_url, e.pdf_name, e.created_at as "createdAt",
        e.quote_requested_at as "quoteRequestedAt",
        e.quote_converted_at as "quoteConvertedAt",
        e.converted_project_id as "convertedProjectId",
        e.client_id as clientId,
        -- ADD THESE for calculations:
        e.services_included, 
        e.quote_data as "quoteData"
      FROM estimates e
      WHERE e.id = ${id}
    `;

    const estimate = estimateRes[0];
    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      estimate: {
        id: estimate.id,
        title: estimate.title,
        service: estimate.service,
        price: Number(estimate.price).toFixed(2),
        status: estimate.status,
        notes: estimate.notes,
        recipientName: estimate.recipient_name,
        recipientAddress: estimate.recipient_address,
        recipientEmail: estimate.recipient_email,
        recipientPhone: estimate.recipient_phone,
        pdfUrl: estimate.pdf_url,
        pdfName: estimate.pdf_name,
        createdAt: estimate.createdAt,
        quoteRequestedAt: estimate.quoteRequestedAt,
        quoteConvertedAt: estimate.quoteConvertedAt,
        convertedProjectId: estimate.convertedProjectId,
        clientId: estimate.clientId,
      }
    });
  } catch (error) {
    console.error("CLIENT ESTIMATE GET ERROR:", error);
    return NextResponse.json({ error: "Failed to load estimate" }, { status: 500 });
  }
}
