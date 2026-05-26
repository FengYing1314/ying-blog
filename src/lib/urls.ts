const allowedProtocols = new Set(["http:", "https:", "mailto:"]);

export function sanitizeHref(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  const compact = compactForSchemeCheck(trimmed);
  if (!compact || compact.startsWith("//")) {
    return undefined;
  }

  const protocolMatch = /^([a-z][a-z0-9+.-]*):/i.exec(compact);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    return allowedProtocols.has(`${protocol}:`) ? trimmed : undefined;
  }

  return trimmed;
}

function compactForSchemeCheck(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x20 && code !== 0x7f && char.trim() !== "";
    })
    .join("");
}

export function assertSafeHref(value: string, context: string) {
  if (!sanitizeHref(value)) {
    throw new Error(`${context} uses an unsafe URL: ${value}`);
  }
}
