const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const fallbackQuotes = {
  calma: [
    'Respira. Todo va a estar bien.',
    'La paz también se entrena, un momento a la vez.',
    'Baja el ruido. Tu alma sabe el camino.',
  ],
  ansiedad: [
    'No tienes que resolverlo todo hoy.',
    'Tu mente está cansada, no rota.',
    'Un pensamiento no decide tu destino.',
  ],
  amor: [
    'Hablarte bonito también es una forma de sanar.',
    'Mereces el amor que das con tanta facilidad.',
    'Tu valor no cambia cuando dudas.',
  ],
  energia: [
    'Hoy no necesitas perfección, necesitas movimiento.',
    'Empieza pequeño. La fuerza llega en marcha.',
    'Tu energía regresa cuando recuerdas por qué empezaste.',
  ],
  exito: [
    'La disciplina te lleva donde la emoción no alcanza.',
    'Tu proceso también cuenta como victoria.',
    'Cada paso invisible está construyendo algo grande.',
  ],
};

function getRandomFallback(categoryId = 'calma') {
  const list = fallbackQuotes[categoryId] ?? fallbackQuotes.calma;
  return list[Math.floor(Math.random() * list.length)];
}

function sanitizeQuote(content, categoryId) {
  if (!content || typeof content !== 'string') {
    return getRandomFallback(categoryId);
  }

  return content.replace(/^["'“”]+|["'“”]+$/g, '').trim();
}

export async function generateQuote(categoryId = 'calma') {
  if (!API_KEY) {
    return getRandomFallback(categoryId);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        temperature: 1,
        max_tokens: 60,
        messages: [
          {
            role: 'system',
            content:
              'Eres un escritor de frases motivacionales breves, profundas y humanas. Responde solo con una frase corta en español.',
          },
          {
            role: 'user',
            content: `Dame una frase motivacional corta, emocional y profunda sobre ${categoryId}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq request failed with status ${response.status}`);
    }

    const data = await response.json();
    return sanitizeQuote(data?.choices?.[0]?.message?.content, categoryId);
  } catch (_error) {
    return getRandomFallback(categoryId);
  }
}
