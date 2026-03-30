import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "admin@mistryandshah.com";
const HR_EMAIL = "hr@mistryandshah.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, contact_no, application_type, area_of_interest, is_qualified_ca, is_transfer_case } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, skipping email");
      return new Response(
        JSON.stringify({ message: "Email skipped - no API key configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const typeSpecificRows = application_type === "Job"
      ? `<tr><td style="padding:6px 12px;font-weight:bold;">Area of Interest</td><td style="padding:6px 12px;">${area_of_interest || "—"}</td></tr>
         <tr><td style="padding:6px 12px;font-weight:bold;">Qualified CA</td><td style="padding:6px 12px;">${is_qualified_ca || "—"}</td></tr>`
      : `<tr><td style="padding:6px 12px;font-weight:bold;">Transfer Case</td><td style="padding:6px 12px;">${is_transfer_case || "—"}</td></tr>`;

    // Admin email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Mistry & Shah <noreply@mistryandshah.com>",
        to: [ADMIN_EMAIL],
        subject: `New Application Received – ${application_type}`,
        html: `
          <h2>New ${application_type} Application</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${name}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Contact</td><td style="padding:6px 12px;">${contact_no || "—"}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Type</td><td style="padding:6px 12px;">${application_type}</td></tr>
            ${typeSpecificRows}
          </table>
        `,
      }),
    });

    // HR static email (application received)
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Mistry & Shah <noreply@mistryandshah.com>",
        to: [HR_EMAIL],
        subject: `Application Received – ${application_type} (Check Admin Portal)`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
            <h2 style="margin-top:0;">Application Received</h2>
            <p style="line-height:1.6;">
              Hi HR Team,<br/>
              We have received a new <b>${application_type}</b> application from
              <b>${name}</b> (${email}).<br/>
              Please log in to the <b>Admin Portal</b> to review the application details.
            </p>
            <p style="margin-bottom:0;color:#6B7280;font-size:13px;">
              Contact: ${contact_no || "—"}
            </p>
          </div>
        `,
      }),
    });

    // Candidate email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Mistry & Shah <noreply@mistryandshah.com>",
        to: [email],
        subject: "Application Received – Mistry & Shah LLP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;">
            <h2 style="color:#0B3C5D;">Thank You, ${name}</h2>
            <p style="color:#333;line-height:1.6;">
              Thank you for submitting your application. Our team will review your details and get back to you if your profile matches our requirements.
            </p>
            <p style="color:#6B7280;font-size:13px;margin-top:30px;">— Team Mistry & Shah LLP</p>
          </div>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send emails" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
