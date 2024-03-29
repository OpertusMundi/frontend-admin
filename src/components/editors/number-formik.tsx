import React from 'react';

import TextField from '@material-ui/core/TextField';
import {NumericFormat, NumericFormatProps } from 'react-number-format';

import { FieldProps } from 'formik';

interface NumberFormatCustomProps {
  inputRef: (instance: typeof NumericFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  max?: number;
  min?: number;
}

class NumberFormatCustom extends React.Component<NumberFormatCustomProps> {

  render() {
    const { inputRef, onChange, ...other } = this.props;

    return (
      <NumericFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: this.props.name,
              value: values.value,
            },
          });
        }}
        valueIsNumericString
      />
    );
  }
}

interface InputProps {
  id?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  maxLength?: number;
  max?: number;
  min?: number;
}

interface NumberFormikProps extends FieldProps, Omit<NumericFormatProps<any>, 'name' | 'value' | 'error'> {
  inputProps: InputProps;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

class NumberFormik extends React.Component<NumberFormikProps> {

  render() {
    const {
      field,
      form,
      inputProps,
      readOnly,
      onChange,
      ...other
    } = this.props;

    const currentError = form.errors[field.name];

    return (
      <TextField
        {...other}
        name={field.name}
        value={field.value}
        error={Boolean(currentError)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          form.setFieldValue(field.name, event.target.value, true);

          if (onChange) {
            onChange(event.target.value);
          }
        }}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
          readOnly,
        }}
        inputProps={{ ...inputProps }}
      />
    );
  }
}

export default NumberFormik
