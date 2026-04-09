import { CountryCode } from 'libphonenumber-js';
declare const guessParsePhoneNumber: (number: string, defaultCountry?: CountryCode, guessingCountries?: CountryCode[]) => import("libphonenumber-js").PhoneNumber | undefined;
declare const getDisplayableNumber: (rawNumber: string, country: CountryCode, asYouType?: boolean, guessingCountries?: CountryCode[] | undefined) => string;
declare const parsePhoneNumber: (phoneNumber: string) => string;
declare const getCallableNumber: (number: string, country?: CountryCode) => string;
export { parsePhoneNumber, getDisplayableNumber, guessParsePhoneNumber, getCallableNumber, type CountryCode };
//# sourceMappingURL=PhoneNumberUtil.d.ts.map