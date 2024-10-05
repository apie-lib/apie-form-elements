import { clone, ConstraintCheck } from './utils';
import { Option } from './RenderInfo';

export type NestedRecord<T> = { [key: string]: NestedRecordField<T> }
export type NestedRecordField<T> = T | NestedRecord<T>
export type SubmitField = NestedRecord<string|boolean|number|null|File>;
export type Primitive = NestedRecord<string|boolean|number|null>;

export interface SingleFieldSettings {
    options?: Option[], // used by Select
    dateFormat?: string, // used by date time formats
}

export interface FormSelectOption extends Option
{
  name: string;
  value: string|Record<string, any>|File;
  definition?: FormField
}

export interface SingleField {
    fieldType: 'single',
    name: string;
    label: string;
    types: string[];
    valueWhenMissing: any;
    additionalSettings?: SingleFieldSettings
}

export interface FormGroupField {
    fieldType: 'group',
    name: string;
    label: string|null;
    types: string[];
    valueWhenMissing: any;
    fields: Array<FormField>;
}

export interface FieldList {
    fieldType: 'list',
    name: string;
    label: string|null;
    types: string[];
    unique: boolean;
    valueWhenMissing: any;
    subField: FormField;
}

export interface FieldMap {
    fieldType: 'map',
    name: string;
    label: string|null;
    types: string[];
    valueWhenMissing: any;
    subField: FormField;
}

export interface FieldSplit {
  fieldType: 'split';
  name: string;
  label: string|null;
  subFields: Array<FormSelectOption>;
}

export interface Constraint extends ConstraintCheck {
  fieldType: 'constraint',
  name: string;
  serverSide: boolean;
}

export type FormField = FormGroupField | SingleField | FieldMap | FieldList | FieldSplit | Constraint;

export function handlesValidationForField(input: FormField): input is FormGroupField | FieldMap | FieldList | Constraint {
  return ['group', 'map', 'list', 'constraint'].includes(input.fieldType);
}

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
  if (definition.value[key] === undefined && formField.fieldType !== 'constraint' && formField.fieldType !== 'split') {
    definition.value[key] = formField.valueWhenMissing;
  }
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
  let value: any = state?.value ? state?.value[key] : undefined;
  if (value === undefined) {
    value = null;
    if (formField.fieldType !== 'constraint' && formField.fieldType !== 'split') {
      value = formField.valueWhenMissing;
    }
  }
  return {
    form: formField,
    value,
    internalState: state.internalState ? state.internalState[key] as any : null,
    validationErrors: state.validationErrors ? state.validationErrors[key] : null,
  }
}

export function changeForm(formField: FormField, state: FormFieldState): FormFieldState
{
  state = clone(state);
  state.form = formField;
  return state;
}

const FORM_FIELDS = [
  'apie-form-field-definition',
  'apie-form-group-definition',
  'apie-form-list-definition',
  'apie-form-map-definition',
  'apie-form-select-definition',
  'apie-constraint-check-definition',
];

export async function toFormField(list: NodeListOf<ChildNode>): Promise<FormField[]>
{
    const fields: FormField[] = [];
    await Promise.all(
      Array.from(list).map(
        async (childNode) => {
          if (FORM_FIELDS.indexOf(String(childNode.nodeName).toLowerCase()) > -1 && !(childNode as any).prototyped) {
            fields.push(await (childNode as any).getDefinition());
            return childNode;
          }
          return null;
        }
      )
    );
    return fields;
}
