// @flow
import LibPhoneNumber from 'google-libphonenumber';

const PhoneNumberUtil = LibPhoneNumber.PhoneNumberUtil.getInstance();
const { PhoneNumberFormat, AsYouTypeFormatter } = LibPhoneNumber;

// eslint-disable-next-line
const EXTRA_CHAR_REGEXP = /[^+*\d]/g;

const shouldBeFormatted = (number: ?string) => {
  if (!number || number.length <= 5) {
    return false;
  }

  return !number.includes('#') && !number.includes('*') && !number.match(/[aA-zZ]/);
};

const isSameCountry = (country1, country2) => {
  if ((country1 === 'US' && country2 === 'CA') || (country2 === 'US' && country1 === 'CA')) {
    return true;
  }

  return country1 === country2;
};

const getDisplayableNumber = (number: string, country: string, asYouType: boolean = false): string => {
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
    const parsedNumber = PhoneNumberUtil.parseAndKeepRawInput(number, country);
    const numberCountry = PhoneNumberUtil.getRegionCodeForNumber(parsedNumber);
    const format = isSameCountry(numberCountry, country) ? PhoneNumberFormat.NATIONAL : PhoneNumberFormat.INTERNATIONAL;

    displayValue = PhoneNumberUtil.format(parsedNumber, format);
  }

  return displayValue;
};

const parsePhoneNumber = (phoneNumber: string): string => phoneNumber.replace(EXTRA_CHAR_REGEXP, '');

const getCallableNumber = (number: string, country: ?string): ?string => {
  try {
    if (country) {
      return getDisplayableNumber(number, country).replace(EXTRA_CHAR_REGEXP, '');
    }
    return parsePhoneNumber(number);
  } catch (_) {
    return null;
  }
};

export {
  PhoneNumberUtil,
  PhoneNumberFormat,
  parsePhoneNumber,
  AsYouTypeFormatter,
  getDisplayableNumber,
  getCallableNumber,
};
