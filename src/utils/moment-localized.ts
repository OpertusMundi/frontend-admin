/**
 * See:
 *
 * https://momentjs.com/docs/#/i18n/
 * https://momentjs.com/docs/#/customization/long-date-formats/
 */

import moment from 'moment';

import 'moment/locale/el';
import 'moment/locale/en-gb';

export const longDateFormat = {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
};

// Set default locale
moment.locale('en', {
  longDateFormat,
});

export default moment;
