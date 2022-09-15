import moment from 'moment';

export function convertMomentToString(obj: any): void {
  // Check null
  if (!obj) {
    return obj;
  }
  // Check only objects
  if (typeof obj !== 'object') {
    return obj;
  }
  // Check every object property
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (Array.isArray(value)) {
      // Handle arrays
      for (const item of value) {
        convertMomentToString(item);
      }
    } else if (moment.isMoment(value)) {
      // Check for Moment instance before type object since Moment is an object too
      obj[key] = moment(value).toISOString();
    } else if (typeof value === 'object') {
      // Handle objects recursively
      convertMomentToString(value);
    }
  }
}
