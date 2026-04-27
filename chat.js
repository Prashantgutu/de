module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body || {};
  if (!messages) return res.status(400).json({ error: 'No messages provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key missing. Add ANTHROPIC_API_KEY in Vercel Environment Variables.' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: 'You are DeutschPath AI, a helpful assistant for an Indian consultancy specialising in Germany migration. Help Indian clients with Germany visas (work, student, job seeker, Blue Card, family reunion), required documents, German language requirements (A1, B1, B2), degree recognition, German job market, cost of living, healthcare, housing, banking, and Anmeldung (city registration). Respond in the same language the user writes in, Hindi or English. Keep responses under 120 words. Be warm, practical, and encouraging.',
        messages,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
