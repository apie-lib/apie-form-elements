import { h, VNode } from '@stencil/core';
import { Constraint, NestedRecord, ValidationResult } from './FormDefinition';
import { createErrorMessage } from './utils';

export interface Option {
    name: string;
    value: string|Record<string, any>|File;
  }

export interface FieldWrapperOptions {
    canEnterEmptyString?: boolean;
    canShowClientsideValidationErrors?: boolean;
    canShowServersideValidationErrors?: boolean;
}

export type FieldWrapperFn = (content: VNode|VNode[], input: InputState, fieldWrapOptions?: FieldWrapperOptions) => VNode|VNode[];

export interface InputState {
    name: string;
    label?: string;
    disabled?: boolean;
    value?: string|number|File;
    valueChanged: (newValue?: string) => void|any;
    internalState?: any;
    internalStateChanged?: (newValue?: any) => void|any;
    additionalSettings?: {
      streamType?: 'readAsArrayBuffer'|'readAsBinaryString'|'readAsDataURL'|'readAsText'
      options?: Option[],
      dateFormat?: string,
      autocompleteUrl?: string,
      imageUrl?: string
      forcedValue?: any
    };
    allowsNull?: boolean;
    emptyStringAllowed?: boolean;
    required?: boolean;
    optional?: boolean;
    validationResult: ValidationResult;
    serverValidationError: NestedRecord<string>;
    renderInfo: RenderInfo;
    currentFieldWrapper: FieldWrapperFn
    touched?: boolean;
    onTouched: () => void;
}

export interface FormGroupState {
    name: string;
    label?: string;
    value?: string|number|Record<string, any>|File;
}

export interface FormListRowState {
    mappingKey: string|number;
    isMap: boolean;
    onRowRemove?: () => void;
}

export interface FormListRowAddState {
    mappingKey: string|number;
    isMap: boolean;
    disabled: boolean;
    label: string;
    onRowAdd: () => void;
}

export interface SubmitButtonState {
    disabled: boolean;
    label: string;
}

export type SingleInputRender = (input: InputState) => VNode|VNode[];

export function toSingleError(
    error: NestedRecord<string>|string|undefined|null,
    value: any,
    initialValue: any
): NestedRecord<string> {
    if (error === null || error === undefined) {
        return {};
    }
    if (typeof value === 'object') {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
            return {};
        }
    } else if (value !== initialValue) {
        return {};
    }
    if (typeof error === 'string') {
        return { '': error }
    }
    return error;
}

export class RenderInfo {
    protected singleInputRenderers: Record<string, SingleInputRender> = {}

    constructor(protected parent: RenderInfo|null = null)
    {
    }

    public getAvailabeInputTypes(): Set<string>
    {
        const list = Object.keys(this.singleInputRenderers);
        if (this.parent) {
            list.push(...this.parent.getAvailabeInputTypes());
        }
        return new Set(list);
    }

    public createFieldWrapper(): FieldWrapperFn
    {
        return (content: VNode|VNode[]) => content;
    }

    private getSingleInputRenderer(types: Array<string>): SingleInputRender
    {
        for (let type of types) {
            if (this.singleInputRenderers[type]) {
                return this.singleInputRenderers[type];
            }
        }
        if (!this.parent) {
            throw new Error('No input renderer found for type: ' + types.join(', '));
        }
        return this.parent.getSingleInputRenderer(types);
    }

    public renderSingleInput(types: Array<string>, input: InputState): VNode|VNode[] {
        return this.getSingleInputRenderer(types)(input);
    }

    public renderSubmitButton(state: SubmitButtonState): VNode|VNode[] {
        return <input type="submit" disabled={state.disabled} value={state.label}/>
    }

    public renderFormGroup(state: FormGroupState, subElements: VNode[], key: number | string | null = null): VNode|VNode[] {
        return <div style={ { width : '100%' } } key={key ?? state.name}>{subElements}</div>
    }

    public renderValidationError(state: Constraint, value: any): VNode|VNode[]
    {
        const errorMessage: string | null = createErrorMessage(state, value);
        
        if (errorMessage) {
            return <div style={ { color: state.serverSide ? 'red' : 'black' }}>❌ {errorMessage}</div>
        }
        return state.serverSide ? [] : <div style={ { color: 'green' }}>✅ {errorMessage}</div>;
    }

    public renderUnmappedErrors(unmapped: Set<string>, validationErrors: NestedRecord<string>|string): VNode|VNode[]
    {
        if (typeof validationErrors === 'string') {
            return this.renderValidationError(
                {
                    fieldType: 'constraint',
                    inverseCheck: false,
                    exactMatch: undefined,
                    message: validationErrors,
                    serverSide: true,
                },
                undefined
            );
        }
        const errors = []
        for (let error of unmapped) {
            const res = this.renderValidationError(
                {
                    fieldType: 'constraint',
                    inverseCheck: false,
                    exactMatch: undefined,
                    message: validationErrors[error] as string,
                    serverSide: true,
                },
                undefined
            );
            if (Array.isArray(res)) {
                errors.push(...res);
            } else {
                errors.push(res);
            }
        }
        return errors;
    }

    public renderListOrMapRow(state: FormListRowState, subElement: VNode): VNode|VNode[]
    {
        return <div style={ { width : '100%' } } key={state.mappingKey}>
            { subElement }
            { state.onRowRemove && <button type="button" onClick={() => state.onRowRemove()}>X</button> }
        </div>
    }

    public renderAddItemToList(state: FormListRowAddState): VNode|VNode[]
    {
        return <button type="button" disabled={state.disabled} onClick={() => state.onRowAdd() }>Add</button>
    }

    public renderAddItemToMap(keyField: VNode|VNode[], button: VNode|VNode[]): VNode|VNode[]
    {
        return [
            ...(Array.isArray(keyField) ? keyField : [keyField]),
            ...(Array.isArray(button) ? button : [button])
        ];
    }
}