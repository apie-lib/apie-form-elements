/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ComboboxResult, Constraint, FieldList, FieldMap, FieldSplit, FormDefinition, FormField, FormGroupField, FormSelectOption, NestedRecord, Primitive, SingleField, SingleFieldSettings, SubmitField, ValidationResult } from "./utils/FormDefinition";
import { VNode } from "@stencil/core";
import { Option, RenderInfo } from "./utils/RenderInfo";
import { ChangeEvent } from "./utils/utils";
import { NestedRecord as NestedRecord1, SingleFieldSettings as SingleFieldSettings1 } from "./components";
import { PhpDate } from "./utils/dates/PhpDate";
import { DateFormatString } from "./utils/dates/DateFormatString";
import { RenderInputFn } from "./components/apie-php-date-input/apie-php-date-input";
export { ComboboxResult, Constraint, FieldList, FieldMap, FieldSplit, FormDefinition, FormField, FormGroupField, FormSelectOption, NestedRecord, Primitive, SingleField, SingleFieldSettings, SubmitField, ValidationResult } from "./utils/FormDefinition";
export { VNode } from "@stencil/core";
export { Option, RenderInfo } from "./utils/RenderInfo";
export { ChangeEvent } from "./utils/utils";
export { NestedRecord as NestedRecord1, SingleFieldSettings as SingleFieldSettings1 } from "./components";
export { PhpDate } from "./utils/dates/PhpDate";
export { DateFormatString } from "./utils/dates/DateFormatString";
export { RenderInputFn } from "./components/apie-php-date-input/apie-php-date-input";
export namespace Components {
    interface ApieComboboxInput {
        "autocompleteUrl": string | null;
        "disabled": boolean;
        "label": string|null;
        "name": string;
        "optionRender": (options: Array<ComboboxResult>, optionClicked: (result: ComboboxResult) => void) => VNode|VNode[];
        "options": Array<ComboboxResult>;
        "refetch": () => Promise<Array<ComboboxResult>>;
        "removeDisabled": boolean;
        "renderInfo": RenderInfo;
        "selectedValues": Array<string>;
        "touched": boolean;
        "value": string;
    }
    interface ApieConstraintCheckDefinition {
        "exactMatch": string|number|null|undefined;
        "getDefinition": () => Promise<Constraint>;
        "inverseCheck": boolean;
        "maxLength": number;
        "message": string;
        "minLength": number;
        "pattern": string;
        "status": string;
        "value": string;
    }
    interface ApieForm {
        "action": string;
        "csrfToken": string|null;
        "debugMode": boolean;
        "definitionId": string;
        "formDefinition": FormDefinition;
        "initialValue": NestedRecord<SubmitField>;
        "internalState": NestedRecord<Primitive>;
        "method": string;
        "polymorphicColumnName"?: string;
        "polymorphicFormDefinition"?: Record<string, string>;
        "renderInfo": RenderInfo;
        "submitLabel": string;
        "supportsMultipart": boolean;
        "validationErrors": NestedRecord<string>;
        "value": NestedRecord<SubmitField>;
    }
    interface ApieFormDefinition {
        "getDefinition": () => Promise<FormDefinition>;
        "prototyped": boolean;
        "status": string;
    }
    interface ApieFormFieldDefinition {
        "additionalSettings"?: SingleFieldSettings;
        "allowsNull": boolean;
        "emptyStringAllowed": boolean;
        "getDefinition": () => Promise<SingleField>;
        "label": string;
        "name": string;
        "prototyped": boolean;
        "required": boolean;
        "status": string;
        "types": string;
        "valueWhenMissing": any;
    }
    interface ApieFormGroupDefinition {
        "getDefinition": () => Promise<FormGroupField>;
        "label": string|null;
        "name": string;
        "prototyped": boolean;
        "status": string;
        "valueWhenMissing": any;
    }
    interface ApieFormListDefinition {
        "definitionId": string;
        "getDefinition": () => Promise<FieldList>;
        "label": string|null;
        "name": string;
        "prototyped": boolean;
        "status": string;
        "valueWhenMissing": any;
    }
    interface ApieFormMap {
        "label": string | null;
        "name": string;
        "renderInfo": RenderInfo;
        "subElements": VNode[];
        "types": string;
        "value": Record<string, any>;
    }
    interface ApieFormMapDefinition {
        "definitionId": string;
        "getDefinition": () => Promise<FieldMap>;
        "label": string|null;
        "name": string;
        "prototyped": boolean;
        "status": string;
        "valueWhenMissing": any;
    }
    interface ApieFormSelect {
        "internalState": Record<string, any>;
        "label": string | null;
        "name": string;
        "options": Array<Option>;
        "renderInfo": RenderInfo;
        "serverValidationError": NestedRecord1<string>;
        "subElements": VNode[];
        "value": Record<string, any>;
    }
    interface ApieFormSelectDefinition {
        "definitionIdList": Array<FormSelectOption>;
        "getDefinition": () => Promise<FieldSplit>;
        "label": string|null;
        "name": string;
        "prototyped": boolean;
        "status": string;
    }
    interface ApiePhpDateInput {
        "compiledDateformat": DateFormatString;
        "dateFormat": string;
        "disabled": boolean;
        "internalDate": PhpDate;
        "name": string;
        "renderInfo": RenderInfo;
        "renderInputFn": RenderInputFn;
        "updateToCurrentTime": () => Promise<void>;
        "value": string;
    }
    interface ApieRenderTypes {
        "csrfToken": string|null;
        "internalState": Record<string, any>;
        "supportsMultipart": boolean;
        "value": Record<string, any>;
    }
    interface ApieSingleInput {
        "additionalSettings"?: SingleFieldSettings1;
        "allowsNull": boolean;
        "emptyStringAllowed": boolean;
        "internalState": any;
        "label": string | null;
        "name": string;
        "renderInfo": RenderInfo;
        "required": boolean;
        "serverValidationError": NestedRecord<string>;
        "types": string;
        "validationResult": ValidationResult;
        "value": string | null;
    }
    interface ApieTestInput {
        "renderInfo": RenderInfo;
    }
}
export interface ApieComboboxInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLApieComboboxInputElement;
}
export interface ApieFormMapCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLApieFormMapElement;
}
export interface ApieFormSelectCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLApieFormSelectElement;
}
export interface ApiePhpDateInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLApiePhpDateInputElement;
}
export interface ApieSingleInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLApieSingleInputElement;
}
declare global {
    interface HTMLApieComboboxInputElementEventMap {
        "valueChanged": string;
        "selectedValueChanged": string[];
        "fieldTouched": boolean;
        "optionClicked": ComboboxResult;
    }
    interface HTMLApieComboboxInputElement extends Components.ApieComboboxInput, HTMLStencilElement {
        addEventListener<K extends keyof HTMLApieComboboxInputElementEventMap>(type: K, listener: (this: HTMLApieComboboxInputElement, ev: ApieComboboxInputCustomEvent<HTMLApieComboboxInputElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLApieComboboxInputElementEventMap>(type: K, listener: (this: HTMLApieComboboxInputElement, ev: ApieComboboxInputCustomEvent<HTMLApieComboboxInputElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLApieComboboxInputElement: {
        prototype: HTMLApieComboboxInputElement;
        new (): HTMLApieComboboxInputElement;
    };
    interface HTMLApieConstraintCheckDefinitionElement extends Components.ApieConstraintCheckDefinition, HTMLStencilElement {
    }
    var HTMLApieConstraintCheckDefinitionElement: {
        prototype: HTMLApieConstraintCheckDefinitionElement;
        new (): HTMLApieConstraintCheckDefinitionElement;
    };
    interface HTMLApieFormElement extends Components.ApieForm, HTMLStencilElement {
    }
    var HTMLApieFormElement: {
        prototype: HTMLApieFormElement;
        new (): HTMLApieFormElement;
    };
    interface HTMLApieFormDefinitionElement extends Components.ApieFormDefinition, HTMLStencilElement {
    }
    var HTMLApieFormDefinitionElement: {
        prototype: HTMLApieFormDefinitionElement;
        new (): HTMLApieFormDefinitionElement;
    };
    interface HTMLApieFormFieldDefinitionElement extends Components.ApieFormFieldDefinition, HTMLStencilElement {
    }
    var HTMLApieFormFieldDefinitionElement: {
        prototype: HTMLApieFormFieldDefinitionElement;
        new (): HTMLApieFormFieldDefinitionElement;
    };
    interface HTMLApieFormGroupDefinitionElement extends Components.ApieFormGroupDefinition, HTMLStencilElement {
    }
    var HTMLApieFormGroupDefinitionElement: {
        prototype: HTMLApieFormGroupDefinitionElement;
        new (): HTMLApieFormGroupDefinitionElement;
    };
    interface HTMLApieFormListDefinitionElement extends Components.ApieFormListDefinition, HTMLStencilElement {
    }
    var HTMLApieFormListDefinitionElement: {
        prototype: HTMLApieFormListDefinitionElement;
        new (): HTMLApieFormListDefinitionElement;
    };
    interface HTMLApieFormMapElementEventMap {
        "triggerChange": ChangeEvent;
    }
    interface HTMLApieFormMapElement extends Components.ApieFormMap, HTMLStencilElement {
        addEventListener<K extends keyof HTMLApieFormMapElementEventMap>(type: K, listener: (this: HTMLApieFormMapElement, ev: ApieFormMapCustomEvent<HTMLApieFormMapElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLApieFormMapElementEventMap>(type: K, listener: (this: HTMLApieFormMapElement, ev: ApieFormMapCustomEvent<HTMLApieFormMapElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLApieFormMapElement: {
        prototype: HTMLApieFormMapElement;
        new (): HTMLApieFormMapElement;
    };
    interface HTMLApieFormMapDefinitionElement extends Components.ApieFormMapDefinition, HTMLStencilElement {
    }
    var HTMLApieFormMapDefinitionElement: {
        prototype: HTMLApieFormMapDefinitionElement;
        new (): HTMLApieFormMapDefinitionElement;
    };
    interface HTMLApieFormSelectElementEventMap {
        "triggerChange": ChangeEvent;
        "triggerInternalState": ChangeEvent;
    }
    interface HTMLApieFormSelectElement extends Components.ApieFormSelect, HTMLStencilElement {
        addEventListener<K extends keyof HTMLApieFormSelectElementEventMap>(type: K, listener: (this: HTMLApieFormSelectElement, ev: ApieFormSelectCustomEvent<HTMLApieFormSelectElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLApieFormSelectElementEventMap>(type: K, listener: (this: HTMLApieFormSelectElement, ev: ApieFormSelectCustomEvent<HTMLApieFormSelectElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLApieFormSelectElement: {
        prototype: HTMLApieFormSelectElement;
        new (): HTMLApieFormSelectElement;
    };
    interface HTMLApieFormSelectDefinitionElement extends Components.ApieFormSelectDefinition, HTMLStencilElement {
    }
    var HTMLApieFormSelectDefinitionElement: {
        prototype: HTMLApieFormSelectDefinitionElement;
        new (): HTMLApieFormSelectDefinitionElement;
    };
    interface HTMLApiePhpDateInputElementEventMap {
        "change": string;
        "touched": void;
    }
    interface HTMLApiePhpDateInputElement extends Components.ApiePhpDateInput, HTMLStencilElement {
        addEventListener<K extends keyof HTMLApiePhpDateInputElementEventMap>(type: K, listener: (this: HTMLApiePhpDateInputElement, ev: ApiePhpDateInputCustomEvent<HTMLApiePhpDateInputElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLApiePhpDateInputElementEventMap>(type: K, listener: (this: HTMLApiePhpDateInputElement, ev: ApiePhpDateInputCustomEvent<HTMLApiePhpDateInputElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLApiePhpDateInputElement: {
        prototype: HTMLApiePhpDateInputElement;
        new (): HTMLApiePhpDateInputElement;
    };
    interface HTMLApieRenderTypesElement extends Components.ApieRenderTypes, HTMLStencilElement {
    }
    var HTMLApieRenderTypesElement: {
        prototype: HTMLApieRenderTypesElement;
        new (): HTMLApieRenderTypesElement;
    };
    interface HTMLApieSingleInputElementEventMap {
        "internalStateChanged": any;
        "touched": ChangeEvent;
        "triggerChange": ChangeEvent;
    }
    interface HTMLApieSingleInputElement extends Components.ApieSingleInput, HTMLStencilElement {
        addEventListener<K extends keyof HTMLApieSingleInputElementEventMap>(type: K, listener: (this: HTMLApieSingleInputElement, ev: ApieSingleInputCustomEvent<HTMLApieSingleInputElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLApieSingleInputElementEventMap>(type: K, listener: (this: HTMLApieSingleInputElement, ev: ApieSingleInputCustomEvent<HTMLApieSingleInputElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLApieSingleInputElement: {
        prototype: HTMLApieSingleInputElement;
        new (): HTMLApieSingleInputElement;
    };
    interface HTMLApieTestInputElement extends Components.ApieTestInput, HTMLStencilElement {
    }
    var HTMLApieTestInputElement: {
        prototype: HTMLApieTestInputElement;
        new (): HTMLApieTestInputElement;
    };
    interface HTMLElementTagNameMap {
        "apie-combobox-input": HTMLApieComboboxInputElement;
        "apie-constraint-check-definition": HTMLApieConstraintCheckDefinitionElement;
        "apie-form": HTMLApieFormElement;
        "apie-form-definition": HTMLApieFormDefinitionElement;
        "apie-form-field-definition": HTMLApieFormFieldDefinitionElement;
        "apie-form-group-definition": HTMLApieFormGroupDefinitionElement;
        "apie-form-list-definition": HTMLApieFormListDefinitionElement;
        "apie-form-map": HTMLApieFormMapElement;
        "apie-form-map-definition": HTMLApieFormMapDefinitionElement;
        "apie-form-select": HTMLApieFormSelectElement;
        "apie-form-select-definition": HTMLApieFormSelectDefinitionElement;
        "apie-php-date-input": HTMLApiePhpDateInputElement;
        "apie-render-types": HTMLApieRenderTypesElement;
        "apie-single-input": HTMLApieSingleInputElement;
        "apie-test-input": HTMLApieTestInputElement;
    }
}
declare namespace LocalJSX {
    interface ApieComboboxInput {
        "autocompleteUrl"?: string | null;
        "disabled"?: boolean;
        "label"?: string|null;
        "name"?: string;
        "onFieldTouched"?: (event: ApieComboboxInputCustomEvent<boolean>) => void;
        "onOptionClicked"?: (event: ApieComboboxInputCustomEvent<ComboboxResult>) => void;
        "onSelectedValueChanged"?: (event: ApieComboboxInputCustomEvent<string[]>) => void;
        "onValueChanged"?: (event: ApieComboboxInputCustomEvent<string>) => void;
        "optionRender"?: (options: Array<ComboboxResult>, optionClicked: (result: ComboboxResult) => void) => VNode|VNode[];
        "options"?: Array<ComboboxResult>;
        "removeDisabled"?: boolean;
        "renderInfo"?: RenderInfo;
        "selectedValues"?: Array<string>;
        "touched"?: boolean;
        "value"?: string;
    }
    interface ApieConstraintCheckDefinition {
        "exactMatch"?: string|number|null|undefined;
        "inverseCheck"?: boolean;
        "maxLength": number;
        "message": string;
        "minLength": number;
        "pattern": string;
        "status"?: string;
        "value"?: string;
    }
    interface ApieForm {
        "action"?: string;
        "csrfToken"?: string|null;
        "debugMode"?: boolean;
        "definitionId"?: string;
        "formDefinition"?: FormDefinition;
        "initialValue": NestedRecord<SubmitField>;
        "internalState"?: NestedRecord<Primitive>;
        "method"?: string;
        "polymorphicColumnName"?: string;
        "polymorphicFormDefinition"?: Record<string, string>;
        "renderInfo"?: RenderInfo;
        "submitLabel"?: string;
        "supportsMultipart"?: boolean;
        "validationErrors"?: NestedRecord<string>;
        "value"?: NestedRecord<SubmitField>;
    }
    interface ApieFormDefinition {
        "prototyped"?: boolean;
        "status"?: string;
    }
    interface ApieFormFieldDefinition {
        "additionalSettings"?: SingleFieldSettings;
        "allowsNull"?: boolean;
        "emptyStringAllowed"?: boolean;
        "label"?: string;
        "name"?: string;
        "prototyped"?: boolean;
        "required"?: boolean;
        "status"?: string;
        "types"?: string;
        "valueWhenMissing"?: any;
    }
    interface ApieFormGroupDefinition {
        "label"?: string|null;
        "name"?: string;
        "prototyped"?: boolean;
        "status"?: string;
        "valueWhenMissing"?: any;
    }
    interface ApieFormListDefinition {
        "definitionId"?: string;
        "label"?: string|null;
        "name"?: string;
        "prototyped"?: boolean;
        "status"?: string;
        "valueWhenMissing"?: any;
    }
    interface ApieFormMap {
        "label"?: string | null;
        "name"?: string;
        "onTriggerChange"?: (event: ApieFormMapCustomEvent<ChangeEvent>) => void;
        "renderInfo"?: RenderInfo;
        "subElements"?: VNode[];
        "types"?: string;
        "value"?: Record<string, any>;
    }
    interface ApieFormMapDefinition {
        "definitionId"?: string;
        "label"?: string|null;
        "name"?: string;
        "prototyped"?: boolean;
        "status"?: string;
        "valueWhenMissing"?: any;
    }
    interface ApieFormSelect {
        "internalState"?: Record<string, any>;
        "label"?: string | null;
        "name"?: string;
        "onTriggerChange"?: (event: ApieFormSelectCustomEvent<ChangeEvent>) => void;
        "onTriggerInternalState"?: (event: ApieFormSelectCustomEvent<ChangeEvent>) => void;
        "options"?: Array<Option>;
        "renderInfo"?: RenderInfo;
        "serverValidationError"?: NestedRecord1<string>;
        "subElements"?: VNode[];
        "value"?: Record<string, any>;
    }
    interface ApieFormSelectDefinition {
        "definitionIdList"?: Array<FormSelectOption>;
        "label"?: string|null;
        "name"?: string;
        "prototyped"?: boolean;
        "status"?: string;
    }
    interface ApiePhpDateInput {
        "compiledDateformat"?: DateFormatString;
        "dateFormat"?: string;
        "disabled"?: boolean;
        "internalDate"?: PhpDate;
        "name"?: string;
        "onChange"?: (event: ApiePhpDateInputCustomEvent<string>) => void;
        "onTouched"?: (event: ApiePhpDateInputCustomEvent<void>) => void;
        "renderInfo"?: RenderInfo;
        "renderInputFn"?: RenderInputFn;
        "value"?: string;
    }
    interface ApieRenderTypes {
        "csrfToken"?: string|null;
        "internalState"?: Record<string, any>;
        "supportsMultipart"?: boolean;
        "value"?: Record<string, any>;
    }
    interface ApieSingleInput {
        "additionalSettings"?: SingleFieldSettings1;
        "allowsNull"?: boolean;
        "emptyStringAllowed"?: boolean;
        "internalState"?: any;
        "label"?: string | null;
        "name"?: string;
        "onInternalStateChanged"?: (event: ApieSingleInputCustomEvent<any>) => void;
        "onTouched"?: (event: ApieSingleInputCustomEvent<ChangeEvent>) => void;
        "onTriggerChange"?: (event: ApieSingleInputCustomEvent<ChangeEvent>) => void;
        "renderInfo"?: RenderInfo;
        "required"?: boolean;
        "serverValidationError"?: NestedRecord<string>;
        "types"?: string;
        "validationResult"?: ValidationResult;
        "value"?: string | null;
    }
    interface ApieTestInput {
        "renderInfo"?: RenderInfo;
    }
    interface IntrinsicElements {
        "apie-combobox-input": ApieComboboxInput;
        "apie-constraint-check-definition": ApieConstraintCheckDefinition;
        "apie-form": ApieForm;
        "apie-form-definition": ApieFormDefinition;
        "apie-form-field-definition": ApieFormFieldDefinition;
        "apie-form-group-definition": ApieFormGroupDefinition;
        "apie-form-list-definition": ApieFormListDefinition;
        "apie-form-map": ApieFormMap;
        "apie-form-map-definition": ApieFormMapDefinition;
        "apie-form-select": ApieFormSelect;
        "apie-form-select-definition": ApieFormSelectDefinition;
        "apie-php-date-input": ApiePhpDateInput;
        "apie-render-types": ApieRenderTypes;
        "apie-single-input": ApieSingleInput;
        "apie-test-input": ApieTestInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "apie-combobox-input": LocalJSX.ApieComboboxInput & JSXBase.HTMLAttributes<HTMLApieComboboxInputElement>;
            "apie-constraint-check-definition": LocalJSX.ApieConstraintCheckDefinition & JSXBase.HTMLAttributes<HTMLApieConstraintCheckDefinitionElement>;
            "apie-form": LocalJSX.ApieForm & JSXBase.HTMLAttributes<HTMLApieFormElement>;
            "apie-form-definition": LocalJSX.ApieFormDefinition & JSXBase.HTMLAttributes<HTMLApieFormDefinitionElement>;
            "apie-form-field-definition": LocalJSX.ApieFormFieldDefinition & JSXBase.HTMLAttributes<HTMLApieFormFieldDefinitionElement>;
            "apie-form-group-definition": LocalJSX.ApieFormGroupDefinition & JSXBase.HTMLAttributes<HTMLApieFormGroupDefinitionElement>;
            "apie-form-list-definition": LocalJSX.ApieFormListDefinition & JSXBase.HTMLAttributes<HTMLApieFormListDefinitionElement>;
            "apie-form-map": LocalJSX.ApieFormMap & JSXBase.HTMLAttributes<HTMLApieFormMapElement>;
            "apie-form-map-definition": LocalJSX.ApieFormMapDefinition & JSXBase.HTMLAttributes<HTMLApieFormMapDefinitionElement>;
            "apie-form-select": LocalJSX.ApieFormSelect & JSXBase.HTMLAttributes<HTMLApieFormSelectElement>;
            "apie-form-select-definition": LocalJSX.ApieFormSelectDefinition & JSXBase.HTMLAttributes<HTMLApieFormSelectDefinitionElement>;
            "apie-php-date-input": LocalJSX.ApiePhpDateInput & JSXBase.HTMLAttributes<HTMLApiePhpDateInputElement>;
            "apie-render-types": LocalJSX.ApieRenderTypes & JSXBase.HTMLAttributes<HTMLApieRenderTypesElement>;
            "apie-single-input": LocalJSX.ApieSingleInput & JSXBase.HTMLAttributes<HTMLApieSingleInputElement>;
            "apie-test-input": LocalJSX.ApieTestInput & JSXBase.HTMLAttributes<HTMLApieTestInputElement>;
        }
    }
}
