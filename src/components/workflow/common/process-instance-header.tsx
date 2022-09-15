import { EnumWorkflow, ProcessInstance } from 'model/bpm-process-instance';


const getVariable = (instance: ProcessInstance, name: string): string => {
  const vIndex = instance.variableNames.indexOf(name);
  const value = vIndex === -1 ? '' : instance.variableValues[vIndex] || '';

  return value;
}

const ProcessInstanceHeader = (props: { instance: ProcessInstance }) => {
  const { instance } = props;

  switch (instance.processDefinitionKey) {
    case EnumWorkflow.ACCOUNT_REGISTRATION:
    case EnumWorkflow.CONSUMER_REGISTRATION:
    case EnumWorkflow.PROVIDER_REGISTRATION: {
      const userName = getVariable(instance, 'userName');
      const idpName = getVariable(instance, 'idpName');
      return (
        <span>{instance.processDefinitionName}<br /><b>{userName}</b>{idpName ? ` (${idpName})` : ''}</span>
      );
    }
    case EnumWorkflow.CATALOGUE_HARVEST:
      const catalogueUrl = getVariable(instance, 'catalogueUrl');
      return (
        <span>{instance.processDefinitionName}<br /><b>{catalogueUrl}</b></span>
      );

    case EnumWorkflow.PROVIDER_PUBLISH_ASSET: {
      const assetTitle = getVariable(instance, 'assetTitle');
      const assetVersion = getVariable(instance, 'assetVersion');
      const assetType = getVariable(instance, 'assetType');
      return (
        <span>{instance.processDefinitionName}<br /><b>{assetType}: {assetTitle} {assetVersion}</b></span>
      );
    }

    case EnumWorkflow.PROVIDER_REMOVE_ASSET: {
      const assetName = getVariable(instance, 'assetName');
      const assetVersion = getVariable(instance, 'assetVersion');
      return (
        <span>{instance.processDefinitionName}<br /><b>{assetName} {assetVersion}</b></span>
      );
    }

    case EnumWorkflow.SYSTEM_REMOVE_ALL_USER_DATA: {
      const userName = getVariable(instance, 'userName');
      return (
        <span>{instance.processDefinitionName}<br /><b>{userName}</b></span>
      );
    }

    case EnumWorkflow.PUBLISH_USER_SERVICE:
    case EnumWorkflow.REMOVE_USER_SERVICE:
      const serviceTitle = getVariable(instance, 'serviceTitle');
      return (
        <span>{instance.processDefinitionName}<br /><b>{serviceTitle}</b></span>
      );

  }
  return (
    <span>{instance.processDefinitionName}</span>
  );
}

export default ProcessInstanceHeader;