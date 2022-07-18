import _ from 'lodash';
import React from 'react';

import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ClientContact } from 'model/chat';

interface AsyncCustomerAutoCompleteState {
  loading: boolean;
}

interface AsyncCustomerAutoCompleteProps {
  error?: boolean;
  label?: string;
  loadingText?: string;
  noOptionsText: string;
  options: ClientContact[],
  promptText?: string;
  value: string | null;
  getOptionKey: (option: ClientContact) => string;
  getOptionLabel: (option: ClientContact) => string;
  loadOptions: (value: string) => Promise<ClientContact[]>;
  onChange?: (value: ClientContact | null) => void;
}

class AsyncCustomerAutoComplete extends React.Component<AsyncCustomerAutoCompleteProps, AsyncCustomerAutoCompleteState> {

  state: AsyncCustomerAutoCompleteState = {
    loading: false,
  }

  render() {
    const {
      loading,
    } = this.state;

    const {
      getOptionKey,
      getOptionLabel,
      loadOptions,
      onChange,
      error,
      label,
      loadingText,
      noOptionsText,
      options,
      promptText,
      value,
    } = this.props;

    const loadOptionsDelayed = _.debounce((value: string): void => {
      this.setState({
        loading: true,
      });

      loadOptions(value).then((options: ClientContact[]) => {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 0);
      });
    }, 500);

    return (
      <Autocomplete
        options={options}
        loading={loading}
        loadingText={loadingText}
        getOptionLabel={getOptionLabel}
        value={options.find(c => value === getOptionKey(c)) || null}
        noOptionsText={!value && promptText ? promptText : noOptionsText}
        onChange={(event: React.ChangeEvent<{}>, value: ClientContact | null,) => {
          if (onChange) {
            onChange(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label || ''}
            error={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              loadOptionsDelayed(event.target.value);
            }}
          />
        )}
      />
    );
  }
}

export default AsyncCustomerAutoComplete
