import { clone, ConstraintCheck, toString } from './utils';
import { InputState, Option } from './RenderInfo';

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
    constraints: Array<Constraint>;
}

export interface FormGroupField {
    fieldType: 'group',
    name: string;
    label: string|null;
    types: string[];
    valueWhenMissing: any;
    fields: Array<FormField>;
    constraints: Array<Constraint>;
}

export interface FieldList {
    fieldType: 'list',
    name: string;
    label: string|null;
    types: string[];
    unique: boolean;
    valueWhenMissing: any;
    subField: FormField;
    constraints: Array<Constraint>;
}

export interface FieldMap {
    fieldType: 'map',
    name: string;
    label: string|null;
    types: string[];
    valueWhenMissing: any;
    subField: FormField;
    constraints: Array<Constraint>;
}

export interface FieldSplit {
  fieldType: 'split';
  name: string;
  label: string|null;
  subFields: Array<FormSelectOption>;
  constraints: Array<Constraint>;
}

export interface Constraint extends ConstraintCheck {
  fieldType: 'constraint',
  serverSide: boolean;
}

export type FormField = FormGroupField | SingleField | FieldMap | FieldList | FieldSplit;

export function handlesValidationForField(input: FormField): input is FormGroupField | FieldMap | FieldList | SingleField {
  return ['group', 'map', 'list', 'single'].includes(input.fieldType);
}

export interface FormDefinition {
    fields: Array<FormField>
}

export interface FormStateDefinition {
    form: FormDefinition;
    csrfToken: string|null;
    value: NestedRecord<SubmitField>;
    initialValue: NestedRecord<SubmitField>;
    internalState: NestedRecord<Primitive>;
    validationErrors: NestedRecord<string>;
}

export interface FormFieldState {
  form: FormField;
  value: NestedRecord<SubmitField>|SubmitField|null;
  initialValue: NestedRecord<SubmitField>|SubmitField|null;
  internalState: NestedRecord<Primitive>|Primitive|null;
  validationErrors: NestedRecord<string>|string|null;
}

export function createFormFieldState(formField: FormField, definition: FormStateDefinition): FormFieldState
{
  const key = formField.name;
  if (definition.value[key] === undefined && formField.fieldType !== 'split') {
    definition.value[key] = formField.valueWhenMissing;
  }
  const initialValue = (definition.initialValue[key] === undefined && formField.fieldType !== 'split')
    ? formField.valueWhenMissing
    : definition.initialValue[key];
  return {
    form: formField,
    value: definition.value[key],
    initialValue,
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
    if (formField.fieldType !== 'split') {
      value = formField.valueWhenMissing;
    }
  }
  let initialValue: any = state?.initialValue ? state?.initialValue[key] : undefined;
  if (initialValue === undefined) {
    initialValue = null;
    if (formField.fieldType !== 'split') {
      initialValue = formField.valueWhenMissing;
    }
  }
  return {
    form: formField,
    value,
    initialValue,
    internalState: state.internalState ? state.internalState[key] as any : null,
    validationErrors: state.validationErrors ? state.validationErrors[key] : null,
  }
}

export function hasInputOptionValue(state: InputState, value: any): boolean
{
  if (Array.isArray(state.additionalSettings.options)) {
    for (let option of state.additionalSettings.options) {
      if (option.value === value) {
        return true;
      }
    }
  }
  return false;
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

export async function getFormConstraints(el: HTMLElement): Promise<Array<Constraint>> {
  const promises = [];
  for (let childNode of el.childNodes as any) {
    if (String(childNode.nodeName).toLowerCase() === 'apie-constraint-check-definition') {
      promises.push(childNode.getDefinition());
    }
  }
  return Promise.all(promises);
}

export interface IndividualConstraintResult {
  message: string;
  valid: boolean;
  serverSide: boolean;
}

export interface ValidationResult {
  valid: boolean;
  messages: Array<IndividualConstraintResult>;
}

export function isValid(value: any, constraint: Constraint): boolean {
  const result = constraint.inverseCheck ? (r: boolean) => !r : (r: boolean) => r;
  let exactMatch = constraint.exactMatch === value
    || (constraint.exactMatch === '' && value === null)
    || (constraint.exactMatch === null && value === '');
  if (constraint.exactMatch !== undefined && result(exactMatch)) {
    return false;
  } 
  value = toString(value);
  if (constraint.maxLength !== undefined && result(value.length > constraint.maxLength)) {
    return false;
  }
  if (constraint.minLength !== undefined && result(value.length < constraint.minLength)) {
    return false;
  }
  if (constraint.pattern !== undefined && !result((new RegExp(constraint.pattern)).test(value))) {
    return false;
  }
  return true;
}

export function validate(value: any, constraints: Array<Constraint>): ValidationResult {
  const result = {
    valid: true,
    messages: []
  }
  for (let constraint of constraints) {
    let constraintIsValid = isValid(value, constraint);
    if (!constraintIsValid) {
      result.valid = false;
    }
    if (constraint.message !== undefined) {
      result.messages.push({
        valid: constraintIsValid,
        message: constraint.message,
        serverSide: constraint.serverSide,
      });
    }
  }
  return result;
}