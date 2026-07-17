import { ExternalLink } from 'react-feather';

export default function ChatbotMessage({ message, onSuggestedQuestion }) {
  const isUserMessage = message.role === 'user';
  const structuredReply = message.structuredReply;

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUserMessage
            ? 'bg-blue-700 text-white'
            : 'border border-slate-200 bg-white text-slate-800'
        }`}
      >
        <p className="whitespace-pre-line leading-6">{message.content}</p>

        {!isUserMessage && message.model && (
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {message.model}
          </p>
        )}

        {!isUserMessage && structuredReply && (
          <div className="mt-3 space-y-3">
            {structuredReply.recommendation &&
              structuredReply.recommendation !== message.content && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recomendación
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {structuredReply.recommendation}
                  </p>
                </div>
              )}

            {structuredReply.reason && (
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Por qué aplica
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {structuredReply.reason}
                </p>
              </div>
            )}

            {structuredReply.technicalSheet && (
              <a
                href={structuredReply.technicalSheet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Ver ficha técnica
                <ExternalLink size={14} />
              </a>
            )}

            {structuredReply.relatedProducts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Productos relacionados
                </p>

                {structuredReply.relatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
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
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
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
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
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
                className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-left text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
              >
                Siguiente sugerida: {structuredReply.nextQuestion}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
