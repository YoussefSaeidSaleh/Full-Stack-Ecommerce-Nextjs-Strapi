import { Resend } from "resend";
import React from "react";
// I will not really use EmailTemplate, just a div
const apiKey = "re_DE9Fiwbe_5Q4P7Bg7KwCHCYRQnxeV3WME";
const resend = new Resend(apiKey);

async function main() {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "youssefsaidk123@gmail.com",
      subject: "Hello world",
      react: React.createElement("div", null, "Hello world"),
      html: undefined,
      text: undefined,
    });
    console.log("Result node:", result);
  } catch (err) {
    console.error("Error node:", err);
  }
}

main();
