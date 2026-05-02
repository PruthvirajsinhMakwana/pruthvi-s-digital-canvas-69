import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_SENDER_EMAIL = Deno.env.get("BREVO_SENDER_EMAIL");
const BREVO_SENDER_NAME = Deno.env.get("BREVO_SENDER_NAME") || "Pruthvirajsinh Makwana";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://pruthvirajsinh.in";
const PRIMARY_COLOR = "#6366f1";
const ACCENT_COLOR = "#8b5cf6";
const LOGO_URL = "https://pruthvirajsinh.in/favicon.jpg";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  message: z.string().min(10).max(2000),
  adminEmail: z.string().email().optional().nullable(),
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function thankYouTemplate(name: string) {
  const services = [
    { icon: '💻', title: 'Web Development', desc: 'Modern, responsive websites & web apps' },
    { icon: '📱', title: 'Social Media Marketing', desc: 'Grow your brand across all platforms' },
    { icon: '🎬', title: 'Video Editing', desc: 'Professional editing for reels, ads & films' },
    { icon: '🎨', title: 'Graphic Design', desc: 'Logos, posters, branding & creatives' },
    { icon: '📹', title: 'Video Shooting', desc: 'On-location shoots with pro equipment' },
    { icon: '🎙️', title: 'Esports Hosting', desc: 'Live tournament hosting & commentary' },
  ];

  const serviceRows = services.map(s => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="48" style="vertical-align:top;font-size:24px;line-height:1;padding-right:12px;">${s.icon}</td>
        <td style="vertical-align:top;">
          <div style="font-size:14px;font-weight:600;color:#1f2937;margin-bottom:2px;">${s.title}</div>
          <div style="font-size:13px;color:#6b7280;line-height:1.4;">${s.desc}</div>
        </td>
      </tr></table>
    </td></tr>`).join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,${PRIMARY_COLOR},${ACCENT_COLOR});padding:36px 24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Logo" width="72" height="72" style="border-radius:50%;display:block;margin:0 auto 14px;border:3px solid rgba(255,255,255,0.25);">
          <h1 style="color:#ffffff;font-size:26px;margin:0 0 6px;font-weight:700;">Thanks for reaching out! 🎉</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">Your message is in good hands</p>
        </td></tr>

        <tr><td style="padding:32px 28px 8px;">
          <p style="font-size:16px;margin:0 0 14px;">Hi <strong>${escapeHtml(name)}</strong>,</p>
          <p style="font-size:15px;line-height:1.65;color:#374151;margin:0 0 14px;">Thank you for getting in touch! I've received your message and will personally review it shortly. Expect a reply within <strong style="color:${PRIMARY_COLOR};">24 hours</strong>.</p>
          <p style="font-size:15px;line-height:1.65;color:#374151;margin:0 0 24px;">While you wait, here's a quick look at the services I offer — feel free to mention if any of these align with what you need.</p>
        </td></tr>

        <tr><td style="padding:0 28px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 18px;">
            <h2 style="font-size:13px;font-weight:700;color:${PRIMARY_COLOR};margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.8px;">✨ What I Offer</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              ${serviceRows}
            </table>
          </div>
        </td></tr>

        <tr><td style="padding:28px 28px 8px;text-align:center;">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:linear-gradient(135deg,${PRIMARY_COLOR},${ACCENT_COLOR});border-radius:8px;">
            <a href="${SITE_URL}" style="display:inline-block;padding:13px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Explore My Portfolio →</a>
          </td></tr></table>
        </td></tr>

        <tr><td style="padding:24px 28px 8px;">
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;">
          <p style="font-size:13px;color:#374151;margin:0 0 10px;font-weight:600;">📞 Need to reach me directly?</p>
          <p style="font-size:13px;color:#6b7280;margin:0 0 5px;">✉️ <a href="mailto:${BREVO_SENDER_EMAIL}" style="color:${PRIMARY_COLOR};text-decoration:none;">${BREVO_SENDER_EMAIL}</a></p>
          <p style="font-size:13px;color:#6b7280;margin:0 0 5px;">📱 <a href="tel:+917016592727" style="color:${PRIMARY_COLOR};text-decoration:none;">+91 70165 92727</a></p>
          <p style="font-size:13px;color:#6b7280;margin:0;">📍 Gujarat, India</p>
        </td></tr>

        <tr><td style="background:#0f172a;padding:24px;text-align:center;">
          <p style="font-size:14px;color:#ffffff;margin:0 0 4px;font-weight:600;">Pruthvirajsinh Makwana</p>
          <p style="font-size:12px;color:#94a3b8;margin:0 0 12px;">Web Developer • Designer • Esports Host</p>
          <p style="font-size:12px;color:#64748b;margin:0;">
            <a href="${SITE_URL}" style="color:${PRIMARY_COLOR};text-decoration:none;">pruthvirajsinh.in</a>
            &nbsp;•&nbsp; © ${new Date().getFullYear()} All rights reserved
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function leadNotificationTemplate(d: { name: string; email: string; phone?: string | null; message: string }) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <tr><td style="background:linear-gradient(135deg,${PRIMARY_COLOR},${ACCENT_COLOR});padding:24px;text-align:center;">
          <h1 style="color:#ffffff;font-size:22px;margin:0;">🔔 New Lead from Website</h1>
        </td></tr>
        <tr><td style="padding:28px 24px;">
          <table width="100%" cellpadding="8" cellspacing="0" style="background:#f9fafb;border-radius:8px;font-size:14px;">
            <tr><td style="color:#6b7280;width:90px;"><strong>Name</strong></td><td>${escapeHtml(d.name)}</td></tr>
            <tr><td style="color:#6b7280;"><strong>Email</strong></td><td><a href="mailto:${escapeHtml(d.email)}" style="color:${PRIMARY_COLOR};">${escapeHtml(d.email)}</a></td></tr>
            <tr><td style="color:#6b7280;"><strong>Phone</strong></td><td>${d.phone ? escapeHtml(d.phone) : '<em style="color:#9ca3af;">Not provided</em>'}</td></tr>
          </table>
          <h3 style="font-size:14px;color:#374151;margin:24px 0 8px;">Message</h3>
          <div style="background:#f9fafb;border-left:4px solid ${PRIMARY_COLOR};padding:16px;border-radius:4px;font-size:14px;line-height:1.6;color:#374151;white-space:pre-wrap;">${escapeHtml(d.message)}</div>
          <table cellpadding="0" cellspacing="0" style="margin:24px auto 0;"><tr><td style="background:${PRIMARY_COLOR};border-radius:8px;">
            <a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${escapeHtml(d.name)}</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#9ca3af;margin:0;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

async function sendBrevo(payload: any) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY!,
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Brevo error:", res.status, text);
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
  return text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
      throw new Error("Brevo credentials not configured");
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input", details: parsed.error.errors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, phone, message, adminEmail } = parsed.data;
    const sender = { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME };

    // 1. Thank-you email to user
    await sendBrevo({
      sender,
      to: [{ email, name }],
      subject: "Thanks for reaching out! — Pruthvirajsinh Makwana",
      htmlContent: thankYouTemplate(name),
      replyTo: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
    });

    // 2. Lead notification to admin
    if (adminEmail) {
      await sendBrevo({
        sender,
        to: [{ email: adminEmail, name: BREVO_SENDER_NAME }],
        subject: `🔔 New lead from ${name}`,
        htmlContent: leadNotificationTemplate({ name, email, phone, message }),
        replyTo: { email, name },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-brevo-emails error:", e);
    return new Response(JSON.stringify({ error: e.message || "Failed to send" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
