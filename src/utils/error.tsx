import React from 'react';

import { IntlShape } from 'react-intl';

import { Message, EnumMessageLevel } from 'model/message';
import { SimpleResponse } from 'model/response';

export type FieldMapperFunc = (field: string) => string | null;

const mapErrorCodeToText = (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => {
  switch (message.code) {
    case 'BasicMessageCode.Unauthorized':
    case 'BasicMessageCode.NotFound':
    case 'BasicMessageCode.RecordNotFound':
    case 'BasicMessageCode.ForeignKeyConstraint':
    case 'AdminMessageCode.CannotDeleteSelf':
      return intl.formatMessage({ id: `error.${message.code}` });

    case 'AdminMessageCode.IdpAccountAlreadyExists':
      return intl.formatMessage({ id: `error.${message.code}` });

    case 'AdminMessageCode.IdpAccountCreateFailed':
      return intl.formatMessage({ id: `error.${message.code}` }, { email: (<b>{message.value}</b>) });

    case 'AdminMessageCode.IdpAccountDeleteFailed':
      return intl.formatMessage({ id: `error.${message.code}` });

    case 'BasicMessageCode.Validation': {
      switch (message.description) {
        case 'AdminMessageCode.CannotRevokeLastAdmin':
          return intl.formatMessage({ id: `error.${message.description}` });

        case 'AdminMessageCode.CannotUpdatePassword':
          return intl.formatMessage({ id: `error.${message.description}` });

        case 'AdminMessageCode.MarketplaceAccountExists':
          return intl.formatMessage({ id: `error.${message.description}` }, { email: (<b>{message.value}</b>) });

        case 'BasicMessageCode.ValidationRequired':
          if (message.field && fieldMapper) {
            const key = fieldMapper(message.field);
            if (key) {
              const field = intl.formatMessage({ id: key });

              return intl.formatMessage({ id: `error.${message.code}.Required` }, { field });
            }
          }
          return intl.formatMessage({ id: `error.${message.code}.Required` });

        case 'BasicMessageCode.ReferenceNotFound':
          // TODO: Handle multiple instances of the same error type
          if (message.field && fieldMapper) {
            const key = fieldMapper(message.field);
            if (key) {
              const field = intl.formatMessage({ id: key });
              return intl.formatMessage({ id: `error.${message.code}.ReferenceNotFound` }, { field });
            }
          }
          return intl.formatMessage({ id: `error.${message.code}.ReferenceNotFound` });

        case 'BasicMessageCode.ValidationNotUnique':
          // TODO: Handle multiple instances of the same error type
          if (message.field && fieldMapper) {
            const key = fieldMapper(message.field);
            if (key) {
              const field = intl.formatMessage({ id: key });
              return intl.formatMessage({ id: `error.${message.code}.UniqueNameConstraint` }, { field: (<b>{field}</b>), value: message.value });
            }
          }
          return intl.formatMessage({ id: `error.${message.code}.UniqueNameConstraint` });

        case 'BasicMessageCode.ValidationValueMismatch':
          if (message.field && fieldMapper) {
            const key = fieldMapper(message.field);
            if (key) {
              const field = intl.formatMessage({ id: key });
              return intl.formatMessage({ id: `error.${message.code}.PasswordMismatch` }, { field });
            }
          }
          return intl.formatMessage({ id: `error.${message.code}.PasswordMismatch` });
      }
      break;
    }

    case 'BpmnMessageCode.ProcessInstanceAlreadyExists':
      return intl.formatMessage({ id: `error.${message.code}` });

  }

  return null;
};

export const localizeErrorCodes = (
  intl: IntlShape, response?: SimpleResponse, header: boolean = true, fieldMapper?: FieldMapperFunc,
  customerErrorMapper?: (intl: IntlShape, message: Message, fieldMapper?: FieldMapperFunc) => React.ReactNode | null,
) => {
  const messages: React.ReactNode[] = [];

  if (!response) {
    response = {
      success: false,
      messages: [{ code: 'BasicMessageCode.InternalServerError', level: EnumMessageLevel.ERROR, description: 'Unknown Error' }],
    }
  }

  if (!header && response.messages.length === 1) {
    let text = customerErrorMapper ? customerErrorMapper(intl, response.messages[0], fieldMapper) : null;
    text = text ? text : mapErrorCodeToText(intl, response.messages[0], fieldMapper);

    messages.push(
      <span key={`error-0`}> {text} </span>
    );
  } else {
    response.messages.forEach((m, index) => {
      let text = customerErrorMapper ? customerErrorMapper(intl, m, fieldMapper) : null;
      text = text ? text : mapErrorCodeToText(intl, m, fieldMapper);
      if (text) {
        messages.push(
          <p key={`error-${index}`}> {text} </p>
        );
      }
    });
  }

  return (
    <div>
      {header && intl.formatMessage({ id: 'error.update-failure' })}
      {messages.length !== 0 &&
        <>
          {header && <br />}
          {messages}
        </>
      }
    </div>
  );
};
