export const CHATBOT_SUGGESTED_QUESTIONS = [
  '¿Qué filtro me recomiendan para piscina?',
  '¿Tienen repuestos para bombas de agua?',
  '¿Qué medio filtrante necesito para suavizar agua?',
];

export const CHATBOT_INITIAL_MESSAGES = [
  {
    id: 'chatbot-welcome',
    role: 'model',
    content:
      'Hola, soy el asistente IA de Aquapartes. Puedo ayudarte con filtros, bombas, medios filtrantes, repuestos y recomendaciones técnicas.',
    persistInHistory: false,
  },
];

export const sanitizeText = (value) =>
  typeof value === 'string' ? value.trim() : '';

const normalizeUrl = (value) => {
  const sanitizedValue = sanitizeText(value);

  if (!sanitizedValue) {
    return '';
  }

  return sanitizedValue.replace(/^[`'"\s]+|[`'"\s]+$/g, '');
};

const buildProductHref = (product) => {
  const page = product?.page && typeof product.page === 'object' ? product.page : {};
  const explicitHref = normalizeUrl(
    product?.href || product?.url || product?.link || page.href,
  );

  if (explicitHref) {
    return explicitHref;
  }

  const slug = sanitizeText(page.slug || product?.slug);
  const productId = page.id || product?.id;

  if (slug) {
    return `/productos/${slug}`;
  }

  if (productId) {
    return `/productos/${productId}`;
  }

  return '';
};

const normalizeRelatedProduct = (product, index) => {
  if (typeof product === 'string') {
    return {
      id: `related-product-${index}`,
      name: product,
      description: '',
      href: '',
      technicalSheet: '',
    };
  }

  if (!product || typeof product !== 'object') {
    return null;
  }

  const name = sanitizeText(
    product.nombre ||
      product.name ||
      product.title ||
      product.producto ||
      product.recommendation,
  );

  if (!name) {
    return null;
  }

  return {
    id: product.id || `related-product-${index}-${name}`,
    name,
    description: sanitizeText(
      product.descripcion ||
        product.description ||
        product.reason ||
        product.summary,
    ),
    href: buildProductHref(product),
    technicalSheet: normalizeUrl(
      product.technicalSheet ||
        product.fichaTecnica ||
        product.technical_sheet ||
        product.datasheet,
    ),
  };
};

export const normalizeRelatedProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map((product, index) => normalizeRelatedProduct(product, index))
    .filter(Boolean);
};

export const buildStructuredReply = (payload) => {
  const structuredReply =
    payload?.structuredReply && typeof payload.structuredReply === 'object'
      ? payload.structuredReply
      : payload || {};

  return {
    recommendation: sanitizeText(structuredReply.recommendation),
    reason: sanitizeText(structuredReply.reason),
    technicalSheet: sanitizeText(structuredReply.technicalSheet) || null,
    nextQuestion: sanitizeText(structuredReply.nextQuestion),
    relatedProducts: normalizeRelatedProducts(
      structuredReply.relatedProducts || payload?.relatedProducts || [],
    ),
  };
};

export const buildHistoryPayload = (messages) =>
  messages
    .filter((message) => message.persistInHistory !== false)
    .slice(-8)
    .map(({ role, content }) => ({
      role,
      content,
    }));

export const getFriendlyErrorMessage = (status, apiMessage) => {
  const fallbackMessage = sanitizeText(apiMessage);

  if (status === 400) {
    return fallbackMessage || 'La consulta no tiene el formato esperado.';
  }

  if (status === 429 || status === 503) {
    return (
      fallbackMessage ||
      'El asistente está ocupado en este momento. Intenta nuevamente en unos segundos.'
    );
  }

  if (status === 500) {
    return fallbackMessage || 'Hubo un error interno al consultar el asistente.';
  }

  return fallbackMessage || 'No fue posible obtener una respuesta del asistente.';
};
