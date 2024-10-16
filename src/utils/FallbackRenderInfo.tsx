import { h } from '@stencil/core';
import { InputState, RenderInfo } from "./RenderInfo";
import { toEmptyFileList, toFileList, toString, toArray } from './utils';
import { hasInputOptionValue } from './FormDefinition';

export class FallbackRenderInfo extends RenderInfo
{
    constructor() {
        super(null);
        this.singleInputRenderers = {
          text(state: InputState) {
            return [
                <input type="text" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>)
            ];
          },
          number(state: InputState) {
            return [
                <input type="number" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>)
            ];
          },
          integer(state: InputState) {
            return [
                <input type="number" step="1" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
                (state.label && <label htmlFor={state.name}>{state.label}</label>)
            ];
          },
          datetime(state: InputState) {
            return [
              <apie-php-date-input renderInfo={state.renderInfo} disabled={state.disabled} onChange={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)} dateFormat={state.additionalSettings.dateFormat ?? 'Y-m-d\\TH:i'}/>,
              (state.label && <label htmlFor={state.name}>{state.label}</label>)
            ];
          },
          password(state: InputState) {
            return [
                <input type="password" disabled={state.disabled} onInput={(ev: any) => state.valueChanged(ev.target?.value)} name={state.name} value={toString(state.value)}/>,
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
            if (state.additionalSettings.forcedValue !== undefined && state.value !== state.additionalSettings.forcedValue) {
              Promise.resolve().then(() => state.valueChanged(state.additionalSettings.forcedValue))
            }
            return []
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
`;

            return <div style={ { margin: "5px", padding: "5px" }}>
              <style>{style}</style>
              <label htmlFor={state.label}>{ state.label }</label>
              <article contenteditable="true" class="html-field unhandled"  onInput={(ev: any) => state.valueChanged(ev.target?.innerHTML)} innerHTML={ toString(state.value) }></article>
              <textarea style={ { display: 'none' } } name={ state.name } class="unhandled-editor">{ state.value }</textarea>
            </div>
          },
          select(state: InputState) {
            if (!Array.isArray(state.additionalSettings?.options)) {
              return <select disabled><option selected>{state.value}</option></select>
            }
            
            return <select disabled={state.disabled} onChange={(ev: any) => state.valueChanged(ev.target.value)}>
              { !hasInputOptionValue(state, state.value) && <option value={toString(state.value)} selected>{ state.value }</option> }
              { state.additionalSettings.options.map((opt) => <option value={toString(opt.value as any)} selected={state.value === opt.value}>{opt.name}</option>)}
              </select>
          },
          multi(state: InputState) {
            const value = new Set(toArray(state.value));
            
            if (!Array.isArray(state.additionalSettings?.options)) {
              return <select multiple disabled><option selected>{toString(value)}</option></select>
            }
            
            return <select multiple disabled={state.disabled} onChange={(ev: any) => state.valueChanged(Array.from(ev.target.selectedOptions).map((option: any) => option.value) as any)}>
              { state.additionalSettings.options.map((opt) => <option value={toString(opt.value as any)} selected={value.has(opt.value)}>{opt.name}</option>)}
              </select>
          },
          "null"(state: InputState) {
            if (state.value === null || state.disabled) {
              return <div style={ {display: 'none' }}></div>
            }
            return <div style={ {display: 'none' }} onLoad={() => state.valueChanged(null)}></div>
          },
        }
    };
}