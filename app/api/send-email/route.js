// app/api/send-email/route.js
import { EmailTemplate } from "../../_components/email-template.jsx";

export const dynamic = "force-dynamic"; // اجعل الـ route ديناميكيًا (لا يُبنى static)

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    // 1. تحقق من وجود المفتاح أولاً
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing in environment");
      return Response.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 2. استورد المكتبة ديناميكيًا (لا يُستورد أثناء الـ build إذا لم يُنفّذ الـ route)
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // 3. إرسال الإيميل
    const result = await resend.emails.send({
      from: "onboarding@yourdomain.com", // غيّر إلى دومينك المعتمد في Resend
      to: to ?? ["youssefsaidk123@gmail.com"],
      subject: subject ?? "Hello world",
      react: EmailTemplate({ firstName: "John" }),
      html,
      text,
    });

    return Response.json({ ok: true, data: result });
  } catch (err) {
    console.error("Send-email error:", err);
    return Response.json(
      { ok: false, error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
