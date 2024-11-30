import { h, VNode } from '@stencil/core';
import { FieldWrapperFn, InputState, RenderInfo } from "./RenderInfo";
import { toEmptyFileList, toFileList, toString, toArray } from './utils';
import { hasInputOptionValue, IndividualConstraintResult, NestedRecord, ValidationResult } from './FormDefinition';

function renderFieldRow(content: VNode|VNode[], input: InputState, canEnterEmptyString: boolean = true): VNode|VNode[]{
  return <div style={{width: '100%', display: 'flex', flexWrap: 'nowrap', alignItems: 'left', justifyContent: 'left'}}>
    <div style={{maxWidth: '10%'}}>
      { input.allowsNull && (!canEnterEmptyString || input.emptyStringAllowed) && <input type="checkbox" checked={input.value !== null} onClick={(ev) => { input.onTouched(); if (!(ev.target as any).checked) { input.valueChanged(null); } else { input.valueChanged(''); }}} /> }
    </div>
    <div style={{width: '100%'}}>
      { content }
    </div>
  </div>
}

function renderValidationResult(validationResult: ValidationResult, serverSideError: NestedRecord<string>): VNode[] {
  return [
    ((validationResult.valid && undefined === serverSideError['']) ? <div style={{color: 'green'}}>✅</div> : <div style={{color: 'red'}}>❌</div>),
    (Object.keys(serverSideError).length > 0 && <div style={{ color: 'red', fontWeight: 'bold', padding: '10px', backgroundColor: '#fdd' }}>
      {Object.entries(serverSideError).map((v) => toString(v[1] as any)) }
    </div>),
    (validationResult.messages.filter((r: IndividualConstraintResult) => !r.valid || !r.serverSide)
      .map((r: IndividualConstraintResult) => {
      return <div>
        <span>{ r.message}</span>
        { r.valid ? <span style={{color: 'green'}}>✅</span> : <span style={{color: 'red'}}>❌</span>}
      </div>;
    }))
  ]
}

export class FallbackRenderInfo extends RenderInfo
{
    constructor() {
        super(null);
        this.singleInputRenderers = {
          text(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);
            return state.currentFieldWrapper(
              [
                <input type="text" disabled={disabled} onBlur={() => state.onTouched()} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state
            );
          },
          number(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);
            
            return state.currentFieldWrapper(
              [
                <input type="number" disabled={disabled} onBlur={() => state.onTouched()} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state
            );
          },
          integer(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);
            
            return state.currentFieldWrapper(
              [
                <input type="number" step="1" onBlur={() => state.onTouched()} disabled={disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state
            );
          },
          datetime(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);
            
            return state.currentFieldWrapper(
              [
                <apie-php-date-input renderInfo={state.renderInfo} onBlur={() => state.onTouched()} disabled={disabled} onChange={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)} dateFormat={state.additionalSettings.dateFormat ?? 'Y-m-d\\TH:i'}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state,
              false
            );
          },
          password(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);

            return state.currentFieldWrapper(
              [
                <input type="password" disabled={disabled} onBlur={() => state.onTouched()} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state
            );
          },
          textarea(state: InputState) {
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);
            const rows = Math.max(2, String(state.value).split("\n").length + 1);

            return state.currentFieldWrapper(
              [
                <textarea disabled={disabled} onBlur={() => state.onTouched()} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} rows={rows}>{toString(state.value)}</textarea>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>),
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state
            );
          },
          hidden(state: InputState) {
            if (state.additionalSettings.forcedValue !== undefined && state.value !== state.additionalSettings.forcedValue) {
              Promise.resolve().then(() => state.valueChanged(state.additionalSettings.forcedValue))
            }
            if (!state.validationResult.valid) {
              return renderValidationResult(state.validationResult, state.serverValidationError) 
            }
            return []
          },
          file(state: InputState) {
            return (
              <div>
                <input type="file" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.files[0])} name={state.name} files={state.value ? toFileList(state.value) : toEmptyFileList()}/>
                {state.value && <input type="button" onClick={() => { state.valueChanged(null); state.onTouched() } } value="remove"/>}
                {state.label && <label htmlFor={state.name}>{state.label}</label>},
                {renderValidationResult(state.validationResult, state.serverValidationError)}
              </div>
            );
          },
          html(state: InputState) {
            const style = `
            .html-field {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              min-height: 200px;
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
          }
            
          .html-field:empty:before {
              content: attr(placeholder);
              color: #999;
          }
            
          .html-field:focus {
              border-color: #007bff;
              outline: none;
              box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
          }
            
          .html-field::selection {
              background-color: #007bff;
              color: #fff;
          }
            
          .html-field::-webkit-scrollbar {
              width: 8px;
          }
            
          .html-field::-webkit-scrollbar-thumb {
              background-color: #ccc;
              border-radius: 4px;
          }
            
          .html-field::-webkit-scrollbar-thumb:hover {
              background-color: #aaa;
          }
          .html-field.disabled {
            background-color: #f8f9fa; /* Light gray to indicate disabled */
            color: #6c757d; /* Muted text color */
            border-color: #e0e0e0;
            pointer-events: none; /* Prevent interaction */
        }
`;          
            const disabled = state.disabled || (state.allowsNull && state.emptyStringAllowed && state.value === null);

            return state.currentFieldWrapper(
              <div style={ { margin: "5px", padding: "5px" }}>
                <style>{style}</style>
                <article contenteditable={!disabled} class={`html-field unhandled${disabled ? ' disabled' : ''}`} onBlur={() => state.onTouched()} onInput={(ev: any) => state.valueChanged(ev.target?.innerHTML)} innerHTML={ toString(state.value) }></article>
                <textarea style={ { display: 'none' } } name={ state.name } class="unhandled-editor">{ state.value }</textarea>
                <label htmlFor={state.label}>{ state.label }</label>
                {renderValidationResult(state.validationResult, state.serverValidationError)}
              </div>,
              state
            );
          },
          select(state: InputState) {
            if (!Array.isArray(state.additionalSettings?.options)) {
              return [
                <select disabled><option selected>{state.value}</option></select>,
                renderValidationResult(state.validationResult, state.serverValidationError)
              ]
            }
            const nullIsOption = hasInputOptionValue(state, null);
            const disabled = state.disabled || (!nullIsOption && state.value === null);
            
            return state.currentFieldWrapper(
              [
                <select disabled={disabled}  onBlur={() => state.onTouched()} onChange={(ev: any) => state.valueChanged(ev.target.value)}>
                  { !hasInputOptionValue(state, state.value) && <option key={toString(state.value)} value={toString(state.value)} selected>{ state.value }</option> }
                  { state.additionalSettings.options.map((opt) => <option key={toString(opt.value as any)} value={toString(opt.value as any)} selected={state.value === opt.value}>{opt.name}</option>)}
                </select>,
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state,
              !nullIsOption
            );
          },
          multi(state: InputState) {
            const value = new Set(toArray(state.value));
            
            if (!Array.isArray(state.additionalSettings?.options)) {
              return state.currentFieldWrapper(
                [
                  <select multiple disabled><option selected>{toString(value)}</option></select>,
                  renderValidationResult(state.validationResult, state.serverValidationError)
                ],
                state,
                false
              )
            }
            const disabled = state.disabled || (state.allowsNull && state.value === null);
            
            return state.currentFieldWrapper(
              [
                <select multiple disabled={disabled} onBlur={() => state.onTouched()} onChange={(ev: any) => state.valueChanged(Array.from(ev.target.selectedOptions).map((option: any) => option.value) as any)}>
                  { state.additionalSettings.options.map((opt) => <option value={toString(opt.value as any)} selected={value.has(opt.value)}>{opt.name}</option>)}
                </select>,
                renderValidationResult(state.validationResult, state.serverValidationError)
              ],
              state,
              false
            )
          },
          "null"(state: InputState) {
            const showValidationError = !state.validationResult.valid && state.validationResult.messages.length > 0;
            if (state.value !== null && !state.disabled) {
              Promise.resolve().then(() => {
                state.valueChanged(null);
              });
            }
            return showValidationError
              ? renderValidationResult(state.validationResult, state.serverValidationError)
              : <div style={ {display: 'none' }}></div>;
          }
        }
    };

    public createFieldWrapper(): FieldWrapperFn
    {
        return renderFieldRow;
    }
}