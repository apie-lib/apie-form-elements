import { Component, Host, Prop, State, VNode, h } from '@stencil/core';
import { InputState, RenderInfo } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';

@Component({
  tag: 'apie-test-input',
  styleUrl: 'apie-test-input.css',
  shadow: true,
})
export class ApieTestInput {
  @Prop() renderInfo: RenderInfo = new FallbackRenderInfo();

  @State() value: any = 'value';

  @State() initialValue: any = 'value';

  @State() type: any = 'text';

  @State() disabled: boolean = false;

  @State() hasClientValidationError: boolean = false;

  @State() clientValidationError: boolean = false;

  @State() hasServersideError: boolean = false;

  @State() touched: boolean = false;

  private renderField(): VNode|VNode[] {
    const input: InputState = {
      valueChanged: (newValue?: string): void => { this.value = newValue; },
      name: 'test',
      value: this.value,
      label: 'Label',
      disabled: this.disabled,
      validationResult: {
        valid: !this.hasClientValidationError,
        messages: this.clientValidationError ? [
          {
            message: 'Client side validation error',
            valid: !this.hasClientValidationError,
            serverSide: false
          }
        ] : []
      },
      serverValidationError: this.hasServersideError ? {'': 'Server side validation error' } : {},
      renderInfo: this.renderInfo,
      additionalSettings: {
        streamType: 'readAsDataURL',
        options: [{name: 'Option A', value: 'A'},{name: 'Option B', value: "B"}],
        dateFormat: 'c',
        imageUrl: 'https://picsum.photos/200/300'
      },
      touched: this.touched,
      onTouched: () => this.touched = true,
    };
    return this.renderInfo.renderSingleInput([this.type], input);
  }

  private renderTestField(field: VNode, name: string, label: string): VNode|VNode[]
  {
    return (
      <div style={{display: 'flex'}}>
        <div>{field}</div><div><label htmlFor={name}>{ label }</label></div>
      </div>
    );
  }

  private renderTypesField(): VNode
  {
    const options = Array.from(this.renderInfo.getAvailabeInputTypes());
    if (options.length === 0) {
      return <input name="type" value={this.type} onInput={(ev) => this.type = (ev.target as any).value} />;
    }
    return <select name="type" onChange={(ev) => this.type = (ev.target as any).value}>
      {options.map((type: string) => {
        return <option selected={type === this.type} onClick={() => this.type = type}>{ type }</option>
      })}
    </select>;
  }

  public render() {
    return (
      <Host>
        <div style={{display:'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex'}}>
            { this.renderTestField(
              this.renderTypesField(),
              'type',
              'Field type'
            )}
            { this.renderTestField(
              <input name="disabled" type="checkbox" checked={this.disabled} onInput={(ev) => this.disabled = (ev.target as any).checked} />,
              'disabled',
              'Field disabled'
            )}
            { this.renderTestField(
              <input name="server_error" type="checkbox" checked={this.hasServersideError} onInput={(ev) => this.hasServersideError = (ev.target as any).checked} />,
              'server_error',
              'Has server-side validation error'
            )}
            { this.renderTestField(
              <input name="client_error" type="checkbox" checked={this.hasClientValidationError} onInput={(ev) => this.hasClientValidationError = (ev.target as any).checked} />,
              'client_error',
              'Has client-side validation error'
            )}
            { this.renderTestField(
              <input name="client_validation_error" type="checkbox" checked={this.clientValidationError} onInput={(ev) => this.clientValidationError = (ev.target as any).checked} />,
              'client_validation_error',
              'Has friendly validation error check'
            )}
            { this.renderTestField(
              <textarea name="initial_data" onInput={(ev) => this.initialValue = JSON.parse((ev.target as any).value)}>
                {JSON.stringify(this.initialValue)}
              </textarea>,
              'initial_data',
              'Initial data'
            )}
            { this.renderTestField(
              <input name="touched" type="checkbox" checked={this.touched} onInput={(ev) => this.touched = (ev.target as any).checked} />,
              'touched',
              'Field touched'
            )}
          </div>

          <div>{this.renderField()}</div>
        </div>
      </Host>
    );
  }
}
