import LibPhoneNumber from "google-libphonenumber";
const PhoneNumberUtil = LibPhoneNumber.PhoneNumberUtil.getInstance();
const {
  PhoneNumberFormat,
  AsYouTypeFormatter
} = LibPhoneNumber;
// eslint-disable-next-line
const EXTRA_CHAR_REGEXP = /[^+*\d]/g;

const shouldBeFormatted = (number: string | null | undefined) => {
  if (!number || number.length <= 5) {
    return false;
  }

  return !number.includes('#') && !number.includes('*') && !number.match(/[aA-zZ]/);
};

const isSameCountry = (country1, country2) => {
  if (country1 === 'US' && country2 === 'CA' || country2 === 'US' && country1 === 'CA') {
    return true;
  }

  return country1 === country2;
};

const getDisplayableNumber = (rawNumber: string, country: string, asYouType = false): string => {
  if (!rawNumber) {
    return rawNumber;
  }

  const number = String(rawNumber);

  if (!shouldBeFormatted(number)) {
    return number;
  }

  let displayValue = '';

  if (asYouType) {
    const formatter = new AsYouTypeFormatter(country);
    number.split('').forEach(char => {
      displayValue = formatter.inputDigit(char);
    });
  } else {
    try {
      const parsedNumber = PhoneNumberUtil.parseAndKeepRawInput(number, country);
      const numberCountry = PhoneNumberUtil.getRegionCodeForNumber(parsedNumber);
      const format = isSameCountry(numberCountry, country) ? PhoneNumberFormat.NATIONAL : PhoneNumberFormat.INTERNATIONAL;
      displayValue = PhoneNumberUtil.format(parsedNumber, format);
    } catch (_) {
      // Avoid to crash when phone number like `0080510` can't be parsed
      displayValue = rawNumber;
    }
  }

  return displayValue;
};

const parsePhoneNumber = (phoneNumber: string): string => phoneNumber.replace(EXTRA_CHAR_REGEXP, '');

const getCallableNumber = (number: string, country: string | null | undefined): string | null | undefined => {
  try {
    if (country) {
      return getDisplayableNumber(number, country).replace(EXTRA_CHAR_REGEXP, '');
    }

    return parsePhoneNumber(number);
  } catch (_) {
    return number;
  }
};

export { PhoneNumberUtil, PhoneNumberFormat, parsePhoneNumber, AsYouTypeFormatter, getDisplayableNumber, getCallableNumber };