import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader, MessageCircle, Send, X } from 'react-feather';
import { sendChatMessage } from '../../services/chatApi';
import ChatbotMessage from './ChatbotMessage';
import {
  buildHistoryPayload,
  buildStructuredReply,
  CHATBOT_INITIAL_MESSAGES,
  CHATBOT_SUGGESTED_QUESTIONS,
  getFriendlyErrorMessage,
  sanitizeText,
} from './chatbotUtils';

const createMessage = ({
  role,
  content,
  model = '',
  structuredReply = null,
  persistInHistory = true,
}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  model,
  structuredReply,
  persistInHistory,
});

export default function ChatbotFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(CHATBOT_INITIAL_MESSAGES);
  const [draftMessage, setDraftMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const scrollContainerRef = useRef(null);

  const hasConversation = useMemo(
    () => messages.some((message) => message.role === 'user'),
    [messages],
  );

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight;
  }, [messages, isLoading, isOpen]);

  const submitMessage = async (rawMessage) => {
    const message = sanitizeText(rawMessage);

    if (!message || isLoading) {
      return;
    }

    const userMessage = createMessage({
      role: 'user',
      content: message,
    });

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraftMessage('');
    setIsLoading(true);
    setRequestError('');

    try {
      const response = await sendChatMessage({
        message,
        history: buildHistoryPayload(nextMessages),
      });

      if (!response.ok) {
        throw new Error(
          getFriendlyErrorMessage(response.status, response.data?.error),
        );
      }

      const structuredReply = buildStructuredReply(response.data);
      const replyText =
        structuredReply.recommendation ||
        sanitizeText(response.data?.reply) ||
        'Tengo una sugerencia para ti, pero no llegó texto principal en la respuesta.';

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage({
          role: 'model',
          content: replyText,
          model: sanitizeText(response.data?.model) || 'Gemini',
          structuredReply,
        }),
      ]);
    } catch (error) {
      const friendlyMessage =
        error instanceof Error
          ? error.message
          : 'No fue posible completar la consulta.';

      setRequestError(friendlyMessage);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage({
          role: 'model',
          content: friendlyMessage,
          model: 'Sistema',
          structuredReply: null,
          persistInHistory: false,
        }),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitMessage(draftMessage);
  };

  return (
    <div className="fixed bottom-6 right-[6.5rem] z-50 sm:right-[7rem]">
      {isOpen && (
        <div
          className="absolute bottom-0 right-full mr-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          style={{ width: 'min(24rem, calc(100vw - 7rem))' }}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-700 to-blue-700 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Asistente IA Aquapartes</p>
              <p className="text-xs text-blue-100">
                Recomendaciones con Gemini y catálogo contextual
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label="Cerrar chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="max-h-[28rem] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4"
          >
            {!hasConversation && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-slate-700">
                Pregúntame por filtros, bombas, resinas, medios filtrantes o
                repuestos.
              </div>
            )}

            {messages.map((message) => (
              <ChatbotMessage
                key={message.id}
                message={message}
                onSuggestedQuestion={submitMessage}
              />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <Loader size={16} className="animate-spin" />
                  Consultando asistente...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            {!hasConversation && (
              <div className="mb-3 flex flex-wrap gap-2">
                {CHATBOT_SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submitMessage(question)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {requestError && (
              <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {requestError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                rows={2}
                placeholder="Escribe tu consulta..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !sanitizeText(draftMessage)}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Enviar mensaje"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
        className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 text-white shadow-2xl transition hover:scale-110"
        aria-label="Abrir chatbot de Aquapartes"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}
