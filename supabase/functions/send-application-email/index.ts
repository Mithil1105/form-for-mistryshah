import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "admin@mistryandshah.com";
const HR_EMAIL = "info@unimisk.com";
// Resend requires the "from" domain to be verified in Resend.
// Your verified domain is form.unimisk.com, so we use a from-address on that domain.
const RESEND_FROM = "Mistry & Shah <noreply@form.unimisk.com>";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const middle_name = String(body.middle_name ?? "").trim();
    const surname = String(body.surname ?? "").trim();
    const email = String(body.email ?? "").trim();
    const contact_no = String(body.contact_no ?? "").trim();
    const gender = String(body.gender ?? "").trim();
    const date_of_birth = String(body.date_of_birth ?? "").trim();
    const reference = String(body.reference ?? "").trim();
    const application_type = String(body.application_type ?? "").trim();
    const area_of_interest = String(body.area_of_interest ?? "").trim();
    const is_qualified_ca = String(body.is_qualified_ca ?? "").trim();
    const is_transfer_case = String(body.is_transfer_case ?? "").trim();
    const permanent_address = String(body.permanent_address ?? "").trim();
    const current_address = String(body.current_address ?? "").trim();
    const resume_url = typeof body.resume_url === "string" ? body.resume_url : null;

    const fullName = [name, middle_name, surname].filter(Boolean).join(" ");

    const fmt = (v: unknown) => {
      if (v === null || v === undefined) return "—";
      const s = String(v).trim();
      return s === "" ? "—" : s;
    };

    // Lightweight debug so we can confirm what the Edge Function is receiving.
    console.log("send-application-email payload debug", {
      hasResume: typeof resume_url === "string" && resume_url.trim().length > 0,
      resumeLen: typeof resume_url === "string" ? resume_url.length : 0,
      gender,
      dob: date_of_birth,
      hasPermanentAddress: permanent_address.length > 0,
      hasCurrentAddress: current_address.length > 0,
    });

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
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [ADMIN_EMAIL],
        subject: `New Application Received – ${application_type}`,
        html: `
          <h2>New ${application_type} Application</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${fullName}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Contact</td><td style="padding:6px 12px;">${contact_no || "—"}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Type</td><td style="padding:6px 12px;">${application_type}</td></tr>
            ${typeSpecificRows}
          </table>
        `,
      }),
    });
    if (!adminRes.ok) {
      const errBody = await adminRes.text();
      console.error("Resend admin email failed:", adminRes.status, errBody);
      throw new Error(`Resend admin email failed (${adminRes.status})`);
    }

    // HR static email (application received) - includes all details + resume link
    const hrRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [HR_EMAIL],
        subject: `New ${application_type} Application Received – HR Review`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
            <h2 style="margin-top:0;">Application Received</h2>
            <p style="line-height:1.6;margin-bottom:18px;">
              Hi HR Team,<br/>
              We have received a new <b>${application_type}</b> application.<br/>
              <b>${fullName}</b> (${email})<br/>
              Contact: <b>${contact_no || "—"}</b>
            </p>

            <h3 style="margin:18px 0 8px;font-size:14px;">Candidate Details</h3>
            <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;width:100%;">
              <tr><td style="padding:6px 12px;font-weight:bold;width:34%;">Name</td><td style="padding:6px 12px;">${fmt(fullName)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${fmt(email)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Contact No</td><td style="padding:6px 12px;">${fmt(contact_no)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Gender</td><td style="padding:6px 12px;">${fmt(gender)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">DOB</td><td style="padding:6px 12px;">${fmt(date_of_birth)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Reference</td><td style="padding:6px 12px;">${fmt(reference)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Permanent Address</td><td style="padding:6px 12px;">${fmt(permanent_address)}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Current Address</td><td style="padding:6px 12px;">${fmt(current_address)}</td></tr>
            </table>

            <h3 style="margin:18px 0 8px;font-size:14px;">Resume</h3>
            <p style="margin:0 0 12px;line-height:1.6;font-size:13px;color:#111;">
              ${resume_url ? `Resume link: <a href="${resume_url}" target="_blank" rel="noopener noreferrer">View / Download Resume</a>` : "Resume not provided"}
            </p>

            ${application_type === "Job" ? `
              <h3 style="margin:18px 0 8px;font-size:14px;">Job Details</h3>
              <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;width:100%;">
                <tr><td style="padding:6px 12px;font-weight:bold;width:34%;">Marital Status</td><td style="padding:6px 12px;">${fmt(body.marital_status)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Qualified CA</td><td style="padding:6px 12px;">${fmt(body.is_qualified_ca)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Membership No.</td><td style="padding:6px 12px;">${fmt(body.membership_no)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">ICAI Certified Courses</td><td style="padding:6px 12px;">${fmt(body.icai_certified_courses)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">School Institute</td><td style="padding:6px 12px;">${fmt(body.school_institute)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">School Year</td><td style="padding:6px 12px;">${fmt(body.school_year)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">School Specialization</td><td style="padding:6px 12px;">${fmt(body.school_specialization)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">School Percentage</td><td style="padding:6px 12px;">${fmt(body.school_percentage)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Graduation Institute</td><td style="padding:6px 12px;">${fmt(body.graduation_institute)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Graduation Year</td><td style="padding:6px 12px;">${fmt(body.graduation_year)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Graduation Specialization</td><td style="padding:6px 12px;">${fmt(body.graduation_specialization)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Graduation Percentage</td><td style="padding:6px 12px;">${fmt(body.graduation_percentage)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Post Graduation Institute</td><td style="padding:6px 12px;">${fmt(body.post_graduation_institute)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Post Graduation Year</td><td style="padding:6px 12px;">${fmt(body.post_graduation_year)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Post Graduation Specialization</td><td style="padding:6px 12px;">${fmt(body.post_graduation_specialization)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Post Graduation Percentage</td><td style="padding:6px 12px;">${fmt(body.post_graduation_percentage)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Other Qualification Institute</td><td style="padding:6px 12px;">${fmt(body.other_qualification_institute)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Other Qualification Year</td><td style="padding:6px 12px;">${fmt(body.other_qualification_year)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Other Qualification Specialization</td><td style="padding:6px 12px;">${fmt(body.other_qualification_specialization)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Other Qualification Percentage</td><td style="padding:6px 12px;">${fmt(body.other_qualification_percentage)}</td></tr>

                <tr><td style="padding:6px 12px;font-weight:bold;">Employer Name</td><td style="padding:6px 12px;">${fmt(body.employer_name)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Employment From</td><td style="padding:6px 12px;">${fmt(body.employment_from)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Employment To</td><td style="padding:6px 12px;">${fmt(body.employment_to)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Last Designation</td><td style="padding:6px 12px;">${fmt(body.last_designation)}</td></tr>

                <tr><td style="padding:6px 12px;font-weight:bold;">Area of Interest</td><td style="padding:6px 12px;">${fmt(body.area_of_interest)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Post Qualification Experience</td><td style="padding:6px 12px;">${fmt(body.post_qualification_years)}y ${fmt(body.post_qualification_months)}m</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Current CTC</td><td style="padding:6px 12px;">${fmt(body.current_ctc)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Expected CTC</td><td style="padding:6px 12px;">${fmt(body.expected_ctc)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Notice Period</td><td style="padding:6px 12px;">${fmt(body.notice_period)}</td></tr>
              </table>
            ` : `
              <h3 style="margin:18px 0 8px;font-size:14px;">Articleship Details</h3>
              <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;width:100%;">
                <tr><td style="padding:6px 12px;font-weight:bold;width:34%;">Transfer Case</td><td style="padding:6px 12px;">${fmt(body.is_transfer_case)}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;">Transfer Details</td><td style="padding:6px 12px;">${fmt(body.transfer_case_details)}</td></tr>
              </table>
            `}

            <p style="margin-top:18px;font-size:12px;color:#6B7280;line-height:1.6;">
              No need to check the admin portal for basic details. Use the resume link above for quick review.
            </p>
          </div>
        `,
      }),
    });
    if (!hrRes.ok) {
      const errBody = await hrRes.text();
      console.error("Resend HR email failed:", hrRes.status, errBody);
      throw new Error(`Resend HR email failed (${hrRes.status})`);
    }

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
