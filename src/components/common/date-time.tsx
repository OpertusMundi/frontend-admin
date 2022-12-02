import React from 'react';
import { FormattedTimeParts, FormatDateOptions } from 'react-intl';

type DateTimeProps = FormatDateOptions & {
  value?: Date;
}

type Parts = {
  day?: string;
  month?: string;
  year?: string;
  minute?: string;
  hour?: string;
  dayPeriod?: string;
}

class DateTimeComponent extends React.Component<DateTimeProps> {

  render() {
    const { value, ...options } = this.props;

    return (
      <FormattedTimeParts value={value} {...options} >
        {parts => {
          const l: Parts = parts.reduce((result, current) => ({
            ...result,
            [current.type]: current.value,
          }), {});
          const text =
            (l.day ? `${l.day}/${l.month}/${l.year}` : '') +
            (l.day && l.minute ? ', ' : '') +
            (l.minute ? `${l.hour}:${l.minute} ${l.dayPeriod}` : '');
          return (
            <>
              {text}
            </>
          );
        }
        }
      </FormattedTimeParts >
    );
  }
}

export default DateTimeComponent;
