export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { message, history = [] } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres el asistente de ByOlisJo. Responde en español, tono profesional, estratégico y empático. Prioriza branding con IA, plantillas premium en Canva y automatización ManyChat/WhatsApp. Sé breve (1–4 frases) y sugiere un siguiente paso." },
        ...history,
        { role: "user", content: message }
      ]
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });

    if (!r.ok) return res.status(500).json({ error: "OpenAI error", detail: await r.text() });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || "No pude responder. Intenta de nuevo.";
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
