import { ExternalLink } from 'react-feather';

export default function ChatbotMessage({ message, onSuggestedQuestion }) {
  const isUserMessage = message.role === 'user';
  const structuredReply = message.structuredReply;
  const primaryProductLink = structuredReply?.relatedProducts?.find(
    (product) => product.href,
  )?.href;
  const primaryActionLink = primaryProductLink || structuredReply?.technicalSheet;
  const primaryActionLabel = primaryProductLink
    ? 'Ver producto'
    : 'Ver ficha técnica';

  return (
    <div
      className={`chatbot-message-enter flex ${
        isUserMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[90%] rounded-[1.35rem] px-3.5 py-3 text-sm shadow-sm sm:max-w-[86%] sm:rounded-[1.6rem] sm:px-4 ${
          isUserMessage
            ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white shadow-blue-500/20'
            : 'border border-white/70 bg-white/92 text-slate-800 shadow-slate-200/80 backdrop-blur'
        }`}
      >
        <p className="whitespace-pre-line leading-6 sm:leading-6">{message.content}</p>

        {!isUserMessage && structuredReply && (
          <div className="mt-3 space-y-3">
            {structuredReply.reason && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3">
                <p className="text-sm leading-6 text-slate-700">
                  {structuredReply.reason}
                </p>
              </div>
            )}

            {primaryActionLink && (
              <a
                href={primaryActionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 transition hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                {primaryActionLabel}
                <ExternalLink size={14} />
              </a>
            )}

            {structuredReply.relatedProducts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-slate-500">
                  Productos relacionados
                </p>

                {structuredReply.relatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>

                    {product.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.href && (
                        <a
                          href={product.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 sm:py-1.5"
                        >
                          Ver producto
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {product.technicalSheet && (
                        <a
                          href={product.technicalSheet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 sm:py-1.5"
                        >
                          Ficha técnica
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {structuredReply.nextQuestion && (
              <button
                type="button"
                onClick={() => onSuggestedQuestion(structuredReply.nextQuestion)}
                className="w-full rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-2.5 text-left text-sm font-medium text-cyan-900 transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:w-auto sm:py-2"
              >
                Responder: {structuredReply.nextQuestion}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
