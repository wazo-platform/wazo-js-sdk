export type DivertedBy = {
  number: string;
  name?: string;
  reason?: string;
  privacy?: string;
};

const splitOutsideQuotesAndAngles = (input: string): string[] => {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  let angleDepth = 0;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const prev = i > 0 ? input[i - 1] : '';
    if (ch === '"' && prev !== '\\') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (!inQuotes && ch === '<') {
      angleDepth += 1;
      current += ch;
    } else if (!inQuotes && ch === '>') {
      angleDepth = Math.max(0, angleDepth - 1);
      current += ch;
    } else if (ch === ';' && !inQuotes && angleDepth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.length) parts.push(current);
  return parts;
};

const stripQuotes = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  return trimmed;
};

const extractUserFromUri = (uri: string): string | null => {
  const match = uri.match(/^\s*sips?:([^@>;?\s]+)@/i);
  return match ? match[1] : null;
};

/**
 * Parse a single SIP `Diversion` header value (RFC 5806 / draft-levy-sip-diversion).
 *
 * Returns the forwarder identity and selected parameters, or `null` if the
 * input does not contain a parseable SIP URI. A `Diversion` field can hold
 * multiple values (a forwarding chain, most-recent-first); call this once per
 * value if the chain is needed.
 */
export const parseDiversionHeader = (raw: string): DivertedBy | null => {
  if (!raw) return null;

  const segments = splitOutsideQuotesAndAngles(raw);
  if (segments.length === 0) return null;

  const [addrPart, ...paramParts] = segments;
  const addr = addrPart.trim();
  if (!addr) return null;

  let displayName: string | undefined;
  let uri: string;

  const angleStart = addr.indexOf('<');
  if (angleStart !== -1) {
    const angleEnd = addr.indexOf('>', angleStart);
    if (angleEnd === -1) return null;
    const namePart = addr.slice(0, angleStart).trim();
    if (namePart) displayName = stripQuotes(namePart);
    uri = addr.slice(angleStart + 1, angleEnd).trim();
  } else {
    uri = addr;
  }

  const number = extractUserFromUri(uri);
  if (!number) return null;

  const result: DivertedBy = { number };
  if (displayName) result.name = displayName;

  paramParts.forEach((part) => {
    const eq = part.indexOf('=');
    if (eq === -1) return;
    const key = part.slice(0, eq).trim().toLowerCase();
    const value = stripQuotes(part.slice(eq + 1).trim());
    if (key === 'reason') result.reason = value;
    else if (key === 'privacy') result.privacy = value;
  });

  return result;
};
