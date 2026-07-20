export const CHATBOT_SUGGESTED_QUESTIONS = [
  '¿Tienen resina Lewatit S-1567 para suavización de agua?',
  '¿Qué bomba dosificadora Blue-White me recomiendan?',
  '¿Tienen membranas de ósmosis inversa de 8 pulgadas?',
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

const cleanSectionText = (value) =>
  sanitizeText(value).replace(/\n{3,}/g, '\n\n');

const tryParseJson = (value) => {
  const text = sanitizeText(value);

  if (!text || (!text.startsWith('{') && !text.startsWith('['))) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const normalizeStringList = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => sanitizeText(item)).filter(Boolean);
};

const getSafeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : null;

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

const normalizeRequestedItem = (item, itemIndex, groupName = '') => {
  if (typeof item === 'string') {
    return {
      id: `${groupName || 'requested-item'}-${itemIndex}`,
      name: item,
      description: '',
      href: '',
      technicalSheet: '',
    };
  }

  return normalizeRelatedProduct(item, itemIndex);
};

const normalizeRequestedGroup = (group, groupIndex) => {
  if (!group) {
    return null;
  }

  if (Array.isArray(group)) {
    const items = group
      .map((item, itemIndex) =>
        normalizeRequestedItem(item, itemIndex, `grupo-${groupIndex}`),
      )
      .filter(Boolean);

    if (items.length === 0) {
      return null;
    }

    return {
      id: `grupo-${groupIndex}`,
      label: `Grupo ${groupIndex + 1}`,
      items,
    };
  }

  if (typeof group !== 'object') {
    return null;
  }

  const rawItems =
    group.items ||
    group.products ||
    group.relatedProducts ||
    group.requestedItems ||
    [];

  const items = (Array.isArray(rawItems) ? rawItems : [])
    .map((item, itemIndex) =>
      normalizeRequestedItem(item, itemIndex, group.slug || group.type || group.name),
    )
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return {
    id:
      group.id ||
      sanitizeText(group.slug || group.type || group.name || group.title) ||
      `grupo-${groupIndex}`,
    label:
      sanitizeText(group.label || group.name || group.title || group.type) ||
      `Grupo ${groupIndex + 1}`,
    items,
  };
};

const normalizeRequestedItems = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((group, groupIndex) => normalizeRequestedGroup(group, groupIndex))
    .filter(Boolean);
};

const extractReplySections = (replyText) => {
  const text = cleanSectionText(replyText);

  if (!text) {
    return {
      recommendation: '',
      reason: '',
      nextQuestion: '',
      technicalSheet: '',
    };
  }

  const labels = [
    {
      key: 'reason',
      regex: /por\s+qu[eé]\s+aplica\s*:/i,
    },
    {
      key: 'technicalSheet',
      regex: /ficha\s+t[eé]cnica\s*:/i,
    },
    {
      key: 'nextQuestion',
      regex: /siguiente\s+(?:paso|pregunta)\s*:/i,
    },
  ];

  const matches = labels
    .map((label) => {
      const match = label.regex.exec(text);
      return match
        ? {
            key: label.key,
            index: match.index,
            length: match[0].length,
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.index - b.index);

  if (matches.length === 0) {
    return {
      recommendation: text,
      reason: '',
      nextQuestion: '',
      technicalSheet: '',
    };
  }

  const recommendation = cleanSectionText(text.slice(0, matches[0].index));
  const sections = {
    recommendation,
    reason: '',
    nextQuestion: '',
    technicalSheet: '',
  };

  matches.forEach((match, index) => {
    const nextIndex = matches[index + 1]?.index ?? text.length;
    const value = cleanSectionText(
      text.slice(match.index + match.length, nextIndex),
    );

    sections[match.key] = value;
  });

  return sections;
};

export const buildStructuredReply = (payload) => {
  const parsedStructuredReply =
    typeof payload?.structuredReply === 'string'
      ? tryParseJson(payload.structuredReply)
      : null;
  const parsedReply = tryParseJson(payload?.reply);
  const structuredReply =
    (payload?.structuredReply && typeof payload.structuredReply === 'object'
      ? payload.structuredReply
      : null) ||
    parsedStructuredReply ||
    (parsedReply && typeof parsedReply === 'object' && !Array.isArray(parsedReply)
      ? parsedReply
      : null) ||
    payload ||
    {};
  const rawReplyText = sanitizeText(payload?.reply);
  const replyText =
    rawReplyText && !tryParseJson(rawReplyText) ? rawReplyText : '';
  const replySections = extractReplySections(replyText);
  const matchInfo = getSafeObject(structuredReply.matchInfo);

  return {
    replyText: replySections.recommendation || replyText,
    intent: sanitizeText(structuredReply.intent),
    summary: sanitizeText(structuredReply.summary),
    recommendation:
      sanitizeText(structuredReply.recommendation) || replySections.recommendation,
    reason: sanitizeText(structuredReply.reason) || replySections.reason,
    technicalSheet: sanitizeText(structuredReply.technicalSheet) || null,
    nextQuestion:
      sanitizeText(structuredReply.nextQuestion) || replySections.nextQuestion,
    matchStatus: sanitizeText(structuredReply.matchStatus),
    matchInfo,
    needsMoreInfo: Boolean(structuredReply.needsMoreInfo),
    missingFields: normalizeStringList(structuredReply.missingFields),
    requestedItems: normalizeRequestedItems(structuredReply.requestedItems),
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
