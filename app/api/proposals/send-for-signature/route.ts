import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/schema";
import { Resend } from "resend";

export const runtime = 'nodejs';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Strategic Value+ <noreply@strategicvalueplus.com>";

async function generateSigningToken(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await request.json();
    const {
      proposalName,
      proposalType,
      recipientEmail,
      recipientName,
      senderName,
      senderEmail,
      message,
      proposalHtml,
    } = body;

    if (!recipientEmail || !proposalName || !proposalHtml) {
      return NextResponse.json(
        { error: "Missing required fields: recipientEmail, proposalName, proposalHtml" },
        { status: 400 }
      );
    }

    // Generate unique signing token using Web Crypto API
    const signingToken = await generateSigningToken();
    const signingId = `sig_${Date.now()}_${(await generateSigningToken()).substring(0, 8)}`;

    // Build signing URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://strategicvalueplus.com";
    const signingUrl = `${baseUrl}/sign/${signingToken}`;

    // Store signing request in Firestore
    const sigRef = doc(db, COLLECTIONS.PROPOSAL_SIGNATURES, signingId);
    await setDoc(sigRef, {
      id: signingId,
      token: signingToken,
      proposalName,
      proposalType: proposalType || "agreement",
      recipientEmail,
      recipientName: recipientName || "",
      senderName: senderName || "Strategic Value+",
      senderEmail: senderEmail || "nel@strategicvalueplus.com",
      message: message || "",
      proposalHtml,
      status: "pending",
      createdAt: Timestamp.now(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: null,
      signatureData: null,
      signerName: null,
      signerTitle: null,
      signerCompany: null,
      signedPdfBase64: null,
      signedPdfGeneratedAt: null,
    });

    // Generate and send email
    const emailHtml = generateSigningEmail({
      recipientName: recipientName || "Valued Partner",
      proposalName,
      proposalType: proposalType || "Agreement",
      senderName: senderName || "Strategic Value+",
      senderEmail: senderEmail || "nel@strategicvalueplus.com",
      message: message || "",
      signingUrl,
    });

    if (resend) {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: recipientEmail,
        subject: `Action Required: Please Sign — ${proposalName}`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { error: "Failed to send email", details: error.message },
          { status: 500 }
        );
      }
    } else {
      console.warn("Resend not configured. Signing URL:", signingUrl);
    }

    return NextResponse.json({
      success: true,
      signingId,
      signingUrl,
      sentTo: recipientEmail,
      message: resend
        ? `Signing request sent to ${recipientEmail}`
        : "Email service not configured — signing URL generated (check server logs)",
    });
  } catch (error) {
    console.error("Send for signature error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to send for signature", details: message }, { status: 500 });
  }
}

function generateSigningEmail(params: {
  recipientName: string;
  proposalName: string;
  proposalType: string;
  senderName: string;
  senderEmail: string;
  message: string;
  signingUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signature Request — ${params.proposalName}</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="width:600px;max-width:100%;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px 40px;text-align:center;background:linear-gradient(135deg,#1e293b 0%,#334155 100%);border-radius:12px 12px 0 0;">
              <img src="https://strategicvalueplus.com/VPlus_logo.webp" alt="Strategic Value+" style="height:60px;width:auto;margin-bottom:16px;" />
              <h1 style="margin:0;color:#C8A951;font-size:22px;font-weight:600;">Document Signature Request</h1>
              <p style="margin:8px 0 0 0;color:#94a3b8;font-size:14px;">Strategic Value+ — Transforming U.S. Manufacturing</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#1e293b;">Dear ${params.recipientName},</p>

              <p style="margin:0 0 16px 0;font-size:14px;color:#475569;">
                <strong>${params.senderName}</strong> has sent you a <strong>${params.proposalType}</strong> for your review and electronic signature.
              </p>

              ${params.message ? `
              <div style="background:#f8fafc;border-left:4px solid #C8A951;padding:16px;border-radius:0 6px 6px 0;margin:0 0 20px 0;">
                <p style="margin:0;font-size:13px;color:#64748b;font-weight:600;">Message from ${params.senderName}:</p>
                <p style="margin:8px 0 0 0;font-size:14px;color:#334155;">${params.message}</p>
              </div>
              ` : ""}

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:0 0 24px 0;">
                <table style="width:100%;font-size:14px;">
                  <tr><td style="color:#64748b;padding:4px 0;width:140px;">Document:</td><td style="color:#1e293b;font-weight:600;padding:4px 0;">${params.proposalName}</td></tr>
                  <tr><td style="color:#64748b;padding:4px 0;">Type:</td><td style="color:#1e293b;padding:4px 0;">${params.proposalType}</td></tr>
                  <tr><td style="color:#64748b;padding:4px 0;">From:</td><td style="color:#1e293b;padding:4px 0;">${params.senderName}</td></tr>
                  <tr><td style="color:#64748b;padding:4px 0;">Expires:</td><td style="color:#e53e3e;font-weight:600;padding:4px 0;">7 days</td></tr>
                </table>
              </div>

              <div style="text-align:center;margin:0 0 24px 0;">
                <a href="${params.signingUrl}" style="display:inline-block;background:#C8A951;color:#000;padding:16px 40px;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;letter-spacing:0.5px;">
                  Review &amp; Sign Document
                </a>
              </div>

              <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;text-align:center;">
                Or copy and paste this link: <a href="${params.signingUrl}" style="color:#3b82f6;">${params.signingUrl}</a>
              </p>

              <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:24px 0 0 0;">
                <p style="margin:0;font-size:13px;color:#92400e;">
                  <strong>How it works:</strong>
                </p>
                <ol style="margin:8px 0 0 0;padding-left:20px;font-size:13px;color:#78350f;">
                  <li>Click the button above to open the secure signing page</li>
                  <li>Review the full document</li>
                  <li>Enter your name and title, then sign electronically</li>
                  <li>You'll receive a signed PDF copy via email immediately</li>
                </ol>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                This is an automated message from Strategic Value+.<br/>
                ${params.senderEmail} &bull; strategicvalueplus.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
