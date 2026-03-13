async function test() {
  const res = await fetch("http://localhost:3000/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: ["youssefsaidk123@gmail.com"],
    }),
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
}
test();
