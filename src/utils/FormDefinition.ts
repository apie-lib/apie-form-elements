import { Option } from './utils';

export type NestedRecord<T> = { [key: string]: NestedRecordField<T> }
export type NestedRecordField<T> = T | NestedRecord<T>
export type SubmitField = NestedRecord<string|boolean|number|null|File>;
export type Primitive = NestedRecord<string|boolean|number|null>;

export interface SingleFieldSettings {
    options?: Option[], // used by Select
    dateFormat?: string, // used by date time formats
}

export interface SingleField {
    fieldType: 'single',
    name: string;
    label: string;
    types: string[];
    additionalSettings?: SingleFieldSettings
}

export interface FormGroupField {
    fieldType: 'group',
    name: string;
    label: string|null;
    types: string[];
    fields: Array<FormField>;
}

export interface FieldList {
    fieldType: 'list',
    name: string;
    label: string|null;
    types: string[];
    unique: boolean;
    subField: FormField;
}

export interface FieldMap {
    fieldType: 'map',
    name: string;
    label: string|null;
    types: string[];
    subField: FormField;
}

export type FormField = FormGroupField | SingleField | FieldMap | FieldList;

export interface FormDefinition {
    fields: Array<FormField>
}

export interface FormStateDefinition {
    form: FormDefinition;
    csrfToken: string|null;
    value: NestedRecord<SubmitField>;
    internalState: NestedRecord<Primitive>;
    validationErrors: NestedRecord<string>;
}

export interface FormFieldState {
  form: FormField;
  value: NestedRecord<SubmitField>|SubmitField|null;
  internalState: NestedRecord<Primitive>|Primitive|null;
  validationErrors: NestedRecord<string>|string|null;
}

export function createFormFieldState(formField: FormField, definition: FormStateDefinition): FormFieldState
{
  const key = formField.name;
  return {
    form: formField,
    value: definition.value[key],
    internalState: definition.internalState[key],
    validationErrors: definition.validationErrors[key],
  }
}

export function toChildState(formField: FormField, state: FormFieldState): FormFieldState
{
  const key = formField.name;
  return {
    form: formField,
    value: state.value ? state.value[key] as any : null,
    internalState: state.internalState ? state.internalState[key] as any : null,
    validationErrors: state.validationErrors ? state.validationErrors[key] : null,
  }
}

const FORM_FIELDS = [
  'apie-form-field-definition',
  'apie-form-group-definition',
  'apie-form-list-definition',
  'apie-form-map-definition'
];

export async function toFormField(list: NodeListOf<ChildNode>): Promise<FormField[]>
{
    const fields: FormField[] = [];
    await Promise.all(
      Array.from(list).map(
        async (childNode) => {
          if (FORM_FIELDS.indexOf(String(childNode.nodeName).toLowerCase()) > -1) {
            fields.push(await (childNode as any).getDefinition());
            return childNode;
          }
          return null;
        }
      )
    );
    return fields;
}