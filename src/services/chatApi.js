const PRODUCTION_CHAT_API_URL = 'https://aquapartesapi.vercel.app/api/chat';

export const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL || PRODUCTION_CHAT_API_URL;

export const sendChatMessage = async ({ message, history }) => {
  const payload = { message };

  if (Array.isArray(history) && history.length > 0) {
    payload.history = history;
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};
