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
        structuredReply.replyText ||
        structuredReply.summary ||
        structuredReply.recommendation ||
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
    <div className="fixed bottom-6 right-4 z-50 sm:right-6">
      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar panel del chatbot"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-[1px] sm:hidden"
          />

          <div className="chatbot-panel-enter absolute bottom-0 right-full mr-4 w-[25rem] max-w-[calc(100vw-5.5rem)] overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-xl max-sm:fixed max-sm:inset-x-3 max-sm:bottom-24 max-sm:mr-0 max-sm:w-auto max-sm:max-w-none">
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-700 px-4 py-4 text-white sm:px-4 sm:py-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/18 shadow-inner backdrop-blur sm:h-11 sm:w-11">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold sm:text-sm">Asistente IA Aquapartes</p>
                    <div className="mt-1 flex items-start gap-2 text-[13px] leading-5 text-cyan-50/90 sm:items-center sm:text-xs">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
                      <span className="max-w-[14rem] sm:max-w-none">
                        En línea para ayudarte a encontrar el producto ideal
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="relative rounded-full p-2 transition hover:bg-white/10"
                  aria-label="Cerrar chatbot"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="max-h-[52vh] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f8fbff_0%,#f3f7fb_100%)] px-3 py-3 sm:max-h-[29rem] sm:space-y-4 sm:px-4 sm:py-4"
            >
              {!hasConversation && (
                <div className="chatbot-message-enter rounded-2xl border border-cyan-100 bg-white/90 p-3 text-sm leading-6 text-slate-700 shadow-sm">
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
                <div className="chatbot-message-enter flex justify-start">
                  <div className="rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader size={15} className="animate-spin text-cyan-600" />
                      <span>Consultando asistente...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200/80 bg-white/95 p-3 sm:p-4">
              {!hasConversation && (
                <div className="chatbot-mobile-scroll mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                  {CHATBOT_SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => submitMessage(question)}
                      className="shrink-0 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-2 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 sm:py-1.5"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {requestError && (
                <p className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {requestError}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    rows={1}
                    placeholder="Escribe tu consulta..."
                    className="min-h-[52px] w-full resize-none rounded-[1.4rem] border border-slate-200 bg-slate-50/70 px-4 py-3 pr-4 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:min-h-[56px] sm:rounded-[1.6rem]"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(event);
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !sanitizeText(draftMessage)}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 sm:h-[56px] sm:w-[56px] sm:rounded-[1.4rem]"
                  aria-label="Enviar mensaje"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      <div className="relative">
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md" />
            <span
              aria-hidden="true"
              className="chatbot-pulse-ring absolute inset-0 rounded-full border border-cyan-300/60"
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((currentOpen) => !currentOpen)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-blue-700 text-white shadow-[0_16px_30px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          aria-label="Abrir chatbot de Aquapartes"
        >
          <span className="absolute inset-[3px] rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-slate-900 shadow">
            IA
          </span>
          {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </button>
      </div>
    </div>
  );
}
