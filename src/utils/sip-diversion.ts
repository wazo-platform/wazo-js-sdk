import { Grammar } from 'sip.js/lib/grammar/grammar';

export type DivertedBy = {
  number: string;
  name?: string;
  reason?: string;
  privacy?: string;
};

/**
 * Parse a single SIP `Diversion` header value (RFC 5806 / draft-levy-sip-diversion).
 *
 * Returns the forwarder identity and selected parameters, or `null` if the
 * input does not contain a parseable SIP URI. A `Diversion` field can hold
 * multiple values (a forwarding chain, most-recent-first); call this once per
 * value if the chain is needed.
 */
const unquote = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  return value;
};

export const parseDiversionHeader = (raw: string): DivertedBy | null => {
  if (!raw) return null;
  const header = Grammar.nameAddrHeaderParse(raw);
  if (!header) return null;

  const reason = unquote(header.getParam('reason'));
  const privacy = unquote(header.getParam('privacy'));

  return {
    number: header.uri.user ?? '',
    ...(header.displayName ? { name: header.displayName } : {}),
    ...(reason ? { reason } : {}),
    ...(privacy ? { privacy } : {}),
  };
};
