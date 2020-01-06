/* @flow */
/* global navigator */
const isMobile = () => typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
export default isMobile;
