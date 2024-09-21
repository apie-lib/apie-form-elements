import { h, VNode } from '@stencil/core';

export interface Option {
    name: string;
    value: string|Record<string, any>|File;
  }

export interface InputState {
    name: string;
    label?: string;
    value?: string|number|File;
    disabled?: boolean;
    valueChanged: (newValue?: string) => void|any;
    additionalSettings?: {
      options?: Option[],
      dateFormat?: string,
    }
}

export interface FormGroupState {
    name: string;
    label?: string;
    value?: string|number|Record<string, any>|File;
}

export interface FormListRowState {
    mappingKey: string|number;
    isMap: boolean;
    onRowRemove: () => void;
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

export class RenderInfo {
    protected singleInputRenderers: Record<string, SingleInputRender> = {}

    constructor(private parent: RenderInfo|null = null)
    {
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
        return <div key={key ?? state.name}>{subElements}</div>
    }

    public renderListOrMapRow(state: FormListRowState, subElement: VNode): VNode|VNode[]
    {
        return <div key={state.mappingKey}>
            { subElement }
            <button type="button" onClick={() => state.onRowRemove()}>X</button>
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