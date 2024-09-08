import { h, VNode } from '@stencil/core';
import { ChangeEvent, Option, toEmptyFileList, toFileList, toString } from './utils';
export interface SubmitButtonState {
  disabled: boolean;
  label: string;
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

export interface FileInputState {
  name: string;
  value: File|null;
  valueChanged: (newValue?: File) => void|any;
}

export interface MultiInputState extends InputState {
  rows: number;
}

export interface SelectInputState extends InputState {
  options: Option[];
}

export interface FormGroupState {
  content: VNode
  label: string | null
}

export interface Constraint {
  text: string;
  valid: boolean;
}

export interface AddButtonState {
  addButtonClicked: () => void|any;
  disabled: boolean;
}

export const renderSingleTemplates = {
  text(state: InputState) {
    return [
      <input type="text" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
      (state.label && <label htmlFor={state.name}>{state.label}</label>)
    ];
  },
  datetime_internal(state: InputState) {
    return [
      <input type="text" readonly={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
      (state.label && <label htmlFor={state.name}>{state.label}</label>)
    ];
  },
  textarea(state: InputState) {
    const rows = Math.max(2, String(state.value).split("\n").length + 1);
    return [
      <textarea disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} rows={rows}>{toString(state.value)}</textarea>,
      (state.label && <label htmlFor={state.name}>{state.label}</label>)
    ];
  },
  hidden(state: InputState) {
    return <input type="hidden" onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>
  },
  file(state: InputState) {
    return (
      <div>
        <input type="file" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.files[0])} name={state.name} files={state.value ? toFileList(state.value) : toEmptyFileList()}/>
        {state.value && <input type="button" onClick={() => { state.valueChanged(null) } } value="remove"/>}
        {state.label && <label htmlFor={state.name}>{state.label}</label>}
      </div>
    );
  },
  html(state: InputState) {
    const id = 'a' + state.name.replace(/\[\]/g, '--');
    return [
      <div contenteditable={state.disabled} id={id} onInput={(ev: any) => state.valueChanged(ev.target?.innerHTML)} innerHTML={toString(state.value)}></div>,
      (state.label && <label htmlFor={id}>{state.label}</label>)
    ]
  },
  select(state: InputState) {
    if (!Array.isArray(state.additionalSettings?.options)) {
      return <select disabled><option selected>{state.value}</option></select>
    }

    return <select disabled={state.disabled}>
      {state.additionalSettings.options.map((opt) => <option value={toString(opt.value as any)} selected={state.value === opt.value}>{opt.name}</option>)}
    </select>
  },
  "null"(state: InputState) {
    if (state.value === null || state.disabled) {
      return <div style={ {display: 'none' }}></div>
    }
    return <div style={ {display: 'none' }} onLoad={() => state.valueChanged(null)}></div>
  },
}

export type SingleInputState = InputState & { types: string[] };

export const renderTemplates = {
  renderConstraint(state: Constraint) {
    return <div style={{ color: state.valid ? '#0F0' : '#F00'}}>{ state.valid ? '✓' : '✗' }&nbsp;{ state.text }</div>
  },
  renderAddButton(state: AddButtonState) {
    return <input type="button" disabled={state.disabled} value="Add" onClick={() => state.addButtonClicked()}/>
  },
  renderRemoveButton(state: AddButtonState) {
    return <input type="button" disabled={state.disabled} value="X" onClick={() => state.addButtonClicked()}/>
  },
  renderEmptyList() {
    return <div>This list is empty, click on add to add one.</div>
  },
  renderSubmitButton(state: SubmitButtonState) {
    return <input type="submit" disabled={state.disabled} value={state.label}/>
  },
  renderSingleInput(state: SingleInputState) {
    for (let type of state.types) {
      if (Object.hasOwnProperty.call(renderSingleTemplates, type)) {
        return renderSingleTemplates[type](state);
      }
    }
    return renderSingleTemplates.text(state);
  },
  renderInput(state: InputState) {
    return renderSingleTemplates.text(state);
  },
  renderFileInput(state: FileInputState) {
    return (
      <div>
        <input type="file" onInput={(ev: any) => state.valueChanged(ev.target?.files[0])} name={state.name} files={state.value ? toFileList(state.value) : toEmptyFileList()}/>
        {state.value && <input type="button" onClick={() => { state.valueChanged(null) } } value="remove"/>}
      </div>
    );
  },
  renderFormGroup(state: FormGroupState) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', marginRight: '20px', marginBottom: '20px', width: '100%' }}>
        {state.label && <label style={{ display: 'block', marginBottom: '5px' }}>{state.label}</label>}
        <div>{state.content}</div>
      </div>
    );
  },
  renderSelect(state: SelectInputState) {
    const missingValue = !state.options.some((o: Option) => o.value === state.value);

    return <select name={state.name} onChange={(ev: any) => state.valueChanged(ev.target?.value)}>
      {state.options.map((option: Option) => {
        return <option value={String(option.value)} selected={state.value === option.value}>{option.name}</option>
      })}
      { missingValue && <option value={toString(state.value)} selected>{state.value}</option>}
    </select>
  },
  renderMultilineInput(state: MultiInputState) {
    return <textarea onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} rows={state.rows}>
      {state.value ?? ''}
    </textarea>
  },
  renderMissingValidationErrors(state: ChangeEvent[]) {
    if (state.length === 0) {
      return <div></div>
    }
    return <ul>
      {state.map((value: ChangeEvent) => <li key={value.name}><strong>{value.name}:</strong> {value.value}</li>)}
    </ul>
  }
}
