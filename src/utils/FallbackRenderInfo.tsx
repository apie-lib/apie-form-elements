import { h } from '@stencil/core';
import { InputState, RenderInfo } from "./RenderInfo";
import { toEmptyFileList, toFileList, toString } from './utils';

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
          
            return <select disabled={state.disabled} onChange={(ev: any) => state.valueChanged(ev.target.value)}>
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
    };
}