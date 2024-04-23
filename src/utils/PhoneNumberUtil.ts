import { AsYouType, parsePhoneNumber as libParsePhoneNumber, CountryCode } from 'libphonenumber-js';

// eslint-disable-next-line
const EXTRA_CHAR_REGEXP = /[^+*\d]/g;
const DEFAULT_GUESSING_COUNTRIES: CountryCode[] = ['US', 'FR', 'GB', 'AU'];

const shouldBeFormatted = (number: string | null | undefined) => {
  if (!number || number.length <= 5) {
    return false;
  }

  return !number.includes('#') && !number.includes('*') && !number.match(/[aA-zZ]/);
};

const isSameCountry = (country1: string, country2: string) => {
  if ((country1 === 'US' && country2 === 'CA') || (country2 === 'US' && country1 === 'CA')) {
    return true;
  }

  return country1 === country2;
};

const guessParsePhoneNumber = (number: string, defaultCountry?: CountryCode, guessingCountries: CountryCode[] = DEFAULT_GUESSING_COUNTRIES) => {
  const mergedCountries = [...new Set([defaultCountry, ...guessingCountries])].filter(Boolean) as CountryCode[];

  let parsedNumber;
  for (let i = 0; i < mergedCountries.length; i++) {
    const country = mergedCountries[i];

    parsedNumber = libParsePhoneNumber(number, country);
    if (parsedNumber.isValid()) {
      break;
    }
  }

  return parsedNumber;
};

const getDisplayableNumber = (rawNumber: string, country: CountryCode, asYouType = false, guessingCountries: CountryCode[] | undefined = DEFAULT_GUESSING_COUNTRIES): string => {
  if (!rawNumber) {
    return rawNumber;
  }

  const number = String(rawNumber);

  if (!shouldBeFormatted(number)) {
    return number;
  }

  let displayValue = '';

  if (asYouType) {
    displayValue = new AsYouType(country).input(number);
  } else {
    try {
      const parsedNumber = guessParsePhoneNumber(number, country, guessingCountries);
      if (parsedNumber?.isValid()) {
        displayValue = isSameCountry(String(parsedNumber.country), country) ? parsedNumber.formatNational() : parsedNumber.formatInternational();
      } else {
        displayValue = rawNumber;
      }
    } catch (error) {
      displayValue = rawNumber;
    }
  }

  return displayValue;
};

const parsePhoneNumber = (phoneNumber: string): string => phoneNumber.replace(EXTRA_CHAR_REGEXP, '');

const getCallableNumber = (number: string, country?: CountryCode): string => {
  try {
    const callableNumber = country ? getDisplayableNumber(number, country) : number;
    return parsePhoneNumber(callableNumber);
  } catch (_) {
    return number;
  }
};

export { parsePhoneNumber, getDisplayableNumber, guessParsePhoneNumber, getCallableNumber, type CountryCode };
