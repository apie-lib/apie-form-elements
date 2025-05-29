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

  @State() allowsNull: boolean = false;

  @State() emptyStringAllowed: boolean = false;

  @State() required: boolean = false;

  @State() optional: boolean = false;

  @State() touched: boolean = false;

  @State() withWrapper: boolean = true;

  private renderField(): VNode|VNode[] {
    const input: InputState = {
      valueChanged: (newValue?: string): void => { this.value = newValue; },
      name: 'test',
      value: this.value,
      label: 'Test field label',
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
      currentFieldWrapper: this.withWrapper ? this.renderInfo.createFieldWrapper() : (content) => content,
      additionalSettings: {
        autocompleteUrl: this.type === 'combobox' ? '/pages/dummy.json' : null,
        streamType: 'readAsDataURL',
        options: [{name: 'Option A', value: 'A'},{name: 'Option B', value: "B"}],
        dateFormat: 'c',
        imageUrl: 'https://picsum.photos/200/300'
      },
      allowsNull: this.allowsNull,
      emptyStringAllowed: this.emptyStringAllowed,
      required: this.required,
      optional: this.optional,
      touched: this.touched,
      onTouched: () => this.touched = true,
    };
    return this.renderInfo.renderSingleInput([this.type], input);
  }

  private renderTestField(field: VNode, name: string, label: string): VNode|VNode[]
  {
    return (
      <div style={{display: 'flex', width: "30%"}}>
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

  private renderCheckbox(name: string, label: string): VNode|VNode[]
  {
    return this.renderTestField(
      <input
        name={name}
        type="checkbox"
        checked={this[name]}
        onInput={(ev) => this[name] = (ev.target as any).checked} />,
      name,
      label
    )
  }

  public render() {
    return (
      <Host>
        <div style={{display:'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
            { this.renderTestField(
              this.renderTypesField(),
              'type',
              'Field type'
            )}
            { this.renderCheckbox('disabled', 'Field disabled')}
            { this.renderCheckbox('hasServersideError', 'Has server-side validation error')}
            { this.renderCheckbox('hasClientValidationError', 'Has client-side validation error')}
            { this.renderCheckbox('clientValidationError', 'Has friendly validation error check')}
            { this.renderCheckbox('touched', 'Field is touched') }
            { this.renderCheckbox('allowsNull', 'Allows null') }
            { this.renderCheckbox('emptyStringAllowed', 'Empty string allowed')}
            { this.renderCheckbox('required', 'Field is required') }
            { this.renderCheckbox('optional', 'Field can be discarded') }
            { this.renderCheckbox('withWrapper', 'Row rendering') }
            { this.renderTestField(
              <textarea name="data" onInput={(ev) => {
                try {
                  this.value = JSON.parse((ev.target as any).value);
                } catch (err) {
                  this.value = undefined;
                }
              }}>
                {JSON.stringify(this.value)}
              </textarea>,
              'data',
              'Current value'
            )}
            { this.renderTestField(
              <textarea name="initial_data" onInput={(ev) => {
                try {
                  this.value = JSON.parse((ev.target as any).value);
                } catch (err) {
                  this.value = undefined;
                }
              }}>
                {JSON.stringify(this.initialValue)}
              </textarea>,
              'initial_data',
              'Initial data'
            )}
          </div>
          <div>{this.renderField()}</div>
        </div>
      </Host>
    );
  }
}
