import { parseDiversionHeader } from '../sip-diversion';

describe('parseDiversionHeader', () => {
  it('parses a quoted name-addr with reason', () => {
    expect(
      parseDiversionHeader('"Alice" <sip:1001@wazo.example>;reason=unconditional'),
    ).toEqual({
      number: '1001',
      name: 'Alice',
      reason: 'unconditional',
    });
  });

  it('parses an unquoted display name', () => {
    expect(
      parseDiversionHeader('Alice Smith <sip:1001@wazo.example>;reason=user-busy'),
    ).toEqual({
      number: '1001',
      name: 'Alice Smith',
      reason: 'user-busy',
    });
  });

  it('parses a bare addr-spec without display name', () => {
    expect(
      parseDiversionHeader('<sip:1001@wazo.example>;reason=no-answer'),
    ).toEqual({
      number: '1001',
      reason: 'no-answer',
    });
  });

  it('parses multiple parameters including a quoted value', () => {
    expect(
      parseDiversionHeader('"Bob" <sip:1002@wazo.example>;reason="time-of-day";privacy=off;counter=2'),
    ).toEqual({
      number: '1002',
      name: 'Bob',
      reason: 'time-of-day',
      privacy: 'off',
    });
  });

  it('preserves privacy=full', () => {
    expect(
      parseDiversionHeader('"Bob" <sip:1002@wazo.example>;privacy=full;reason=unconditional'),
    ).toEqual({
      number: '1002',
      name: 'Bob',
      reason: 'unconditional',
      privacy: 'full',
    });
  });

  it('parses an anonymous URI', () => {
    expect(
      parseDiversionHeader('<sip:anonymous@anonymous.invalid>;privacy=full;reason=unconditional'),
    ).toEqual({
      number: 'anonymous',
      reason: 'unconditional',
      privacy: 'full',
    });
  });

  it('handles parameter names case-insensitively', () => {
    expect(
      parseDiversionHeader('"Alice" <sip:1001@wazo.example>;Reason=UNCONDITIONAL;PRIVACY=Off'),
    ).toEqual({
      number: '1001',
      name: 'Alice',
      reason: 'UNCONDITIONAL',
      privacy: 'Off',
    });
  });

  it('returns null for malformed input', () => {
    expect(parseDiversionHeader('not a sip uri')).toBeNull();
    expect(parseDiversionHeader('')).toBeNull();
  });

  it('handles addr-spec without angle brackets', () => {
    expect(parseDiversionHeader('sip:1001@wazo.example;reason=unconditional')).toEqual({
      number: '1001',
      reason: 'unconditional',
    });
  });
});
