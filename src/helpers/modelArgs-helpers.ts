import { DMMF } from '@prisma/generator-helper';
import PRISMA_VERSION from '../utils/getPrismaVersion';
import { checkModelHasModelRelation } from './model-helpers';

export function addMissingInputObjectTypesForModelArgs(
  inputObjectTypes: DMMF.InputType[],
  models: DMMF.Model[],
  isGenerateSelect: boolean,
  isGenerateInclude: boolean,
) {
  const modelArgsInputObjectTypes = generateModelArgsInputObjectTypes(
    models,
    isGenerateSelect,
    isGenerateInclude,
  );

  for (const modelArgsInputObjectType of modelArgsInputObjectTypes) {
    inputObjectTypes.push(modelArgsInputObjectType);
  }
}
function getModelArgsTypeName(modelName: string) {
  const modelArgsPrepend =
    PRISMA_VERSION && PRISMA_VERSION >= 6 ? 'Default' : '';
  return `${modelName}${modelArgsPrepend}Args`;
}
function generateModelArgsInputObjectTypes(
  models: DMMF.Model[],
  isGenerateSelect: boolean,
  isGenerateInclude: boolean,
) {
  const modelArgsInputObjectTypes: DMMF.InputType[] = [];
  for (const model of models) {
    const { name: modelName } = model;
    const fields: DMMF.SchemaArg[] = [];

    if (isGenerateSelect) {
      const selectField: DMMF.SchemaArg = {
        name: 'select',
        isRequired: false,
        isNullable: false,
        inputTypes: [
          {
            isList: false,
            type: `${modelName}Select`,
            location: 'inputObjectTypes',
            namespace: 'prisma',
          },
        ],
      };
      fields.push(selectField);
    }

    const hasRelationToAnotherModel = checkModelHasModelRelation(model);

    if (isGenerateInclude && hasRelationToAnotherModel) {
      const includeField: DMMF.SchemaArg = {
        name: 'include',
        isRequired: false,
        isNullable: false,
        inputTypes: [
          {
            isList: false,
            type: `${modelName}Include`,
            location: 'inputObjectTypes',
            namespace: 'prisma',
          },
        ],
      };
      fields.push(includeField);
    }
    const modelArgsInputObjectType: DMMF.InputType = {
      name: getModelArgsTypeName(modelName),
      constraints: {
        maxNumFields: null,
        minNumFields: null,
      },
      fields,
    };
    modelArgsInputObjectTypes.push(modelArgsInputObjectType);
  }
  return modelArgsInputObjectTypes;
}
