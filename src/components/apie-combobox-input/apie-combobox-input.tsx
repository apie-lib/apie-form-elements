import { Component, Event, EventEmitter, Host, Method, Prop, State, VNode, Watch, h } from '@stencil/core';
import { ComboboxResult } from '../../utils/FormDefinition';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';
import { RenderInfo } from '../../utils/RenderInfo';
import { toString } from '../../utils/utils';

function defaultOptionsRender(options: Array<ComboboxResult>, optionClicked: (ComboboxResult) => void): VNode|VNode[] {
  return <div style={{display: 'flex', flexDirection: "column"}}>
    { (options || []).map((option: ComboboxResult) => {
      return <div style={{width: "100%"}} onClick={() => optionClicked(option)}>{ option.displayValue }</div>
   })}
  </div>
}

function selectedValuesRender(selectedValues: Array<string|null>, remove: null|((value: string) => void)): VNode|VNode[] {
  return selectedValues.map((value, index) => {
    if (value === null) {
      // Render a loading indicator for null values
      return (
        <span key={index} class="loading-indicator">
          Loading...
        </span>
      );
    }
    // Render a pill for string values
    return (
      <div key={index} class="pill">
        {value}
        { remove && <button
          class="close-icon"
          onClick={() => remove(value)}
          aria-label={`Remove ${value}`}
        >
          ×
        </button> }
      </div>
    );
  });
}

@Component({
  tag: 'apie-combobox-input',
  styleUrl: 'apie-combobox-input.css',
  shadow: true,
})
export class ApieComboboxInput {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string|null = null;

  @Prop() disabled: boolean = false;

  @Prop() removeDisabled: boolean = false;

  @Prop({mutable: true, reflect: true}) value: string;

  @Prop({mutable: true, reflect: true}) selectedValues: Array<string> = []

  @Prop({mutable: true, reflect: true}) options: Array<ComboboxResult> = [];
  
  @Prop({mutable: true, reflect: true}) touched: boolean;

  @Prop() optionRender: (options: Array<ComboboxResult>, optionClicked: (result: ComboboxResult) => void) => VNode|VNode[] = defaultOptionsRender;

  @Prop() autocompleteUrl: string | null;

  @Prop() renderInfo: RenderInfo = new FallbackRenderInfo();

  @Event() valueChanged: EventEmitter<string>;

  @Event() selectedValueChanged: EventEmitter<string[]>;

  @Event() fieldTouched: EventEmitter<boolean>;

  @Event() optionClicked: EventEmitter<ComboboxResult>;

  @State() pending: Promise<Array<ComboboxResult>>|null = null;

  @State() pendingValue: string|null = null;

  @State() displayValues: Record<string, string> = {};

  @Method()
  public refetch(): Promise<Array<ComboboxResult>>
  {
    this.pendingValue = this.value;
    return this.pending = this.fetch(this.value);
  }

  public fetch(value: string): Promise<Array<ComboboxResult>>
  {
    return fetch(
      toString(this.autocompleteUrl),
      {
        method: 'POST',
        headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
        body: JSON.stringify({
          input: value
        })
      }).then((response) => {
        return response.json();
      }).then((value: Array<ComboboxResult>) => {
        return value;
      });
  }

  @Watch('autocompleteUrl')
  @Watch('value')
  onValueUpdate() {
    if (this.autocompleteUrl && this.value) {
      if (!this.pending || this.value !== this.pendingValue) {
        this.pendingValue = this.value;
        const value = this.value;
        const currentUrl = this.autocompleteUrl;
        this.refetch().then((data: Array<ComboboxResult>) => {
          if (this.pendingValue !== value || currentUrl !== this.autocompleteUrl) {
            return;
          }
          this.pending = null;
          this.pendingValue = null;
          this.options = data;
        });
      }
    } else {
      this.pending = null;
      this.pendingValue = null;
    }
  }

  private makeList(value: Array<string>): Array<string|null>
  {
    const todo: Array<string> = [];
    const result = value.map((v: string) => {
      if (Object.hasOwnProperty.call(this.displayValues, v)) {
        return this.displayValues[v];
      }
      todo.push(v);
      return null;
    });
    todo.forEach((unknownDisplay: string) => {
      this.fetch(unknownDisplay).then((found: Array<ComboboxResult>) => {
        for (let item of found) {
          if (toString(item.value) === toString(unknownDisplay)) {
            this.displayValues[unknownDisplay] = item.displayValue;
            this.displayValues = { ...this.displayValues };
            return;
          }
        }
        this.displayValues[unknownDisplay] = unknownDisplay;
        this.displayValues = { ...this.displayValues };
      })
    });
    return result;
  }

  render() {
    const clickOption = (value: ComboboxResult) => {
      this.displayValues[value.value] = value.displayValue;
      this.optionClicked.emit(value);
      this.value = '';
    };
    const remove = (value: string) => {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
      this.selectedValueChanged.emit(this.selectedValues);
    };
    return (
      <Host>
        { selectedValuesRender(this.makeList(this.selectedValues), this.removeDisabled ? null : remove) }
        { this.renderInfo.renderSingleInput(
          [
            'comboboxtext',
            'text'
          ],
          {
            name: this.name,
            label: this.label ?? this.name,
            disabled: this.disabled,
            value: this.value,
            valueChanged: (newValue?: string) => this.value = toString(newValue),
            validationResult: { valid: true, messages: [] },
            serverValidationError: {},
            renderInfo: this.renderInfo,
            currentFieldWrapper: (v) => v,
            touched: this.touched,
            onTouched: () => { this.touched = true; this.fieldTouched.emit(true); },
            additionalSettings: {
              options: (this.options || []).map((result: ComboboxResult) => {
                return { value: result.value, name: result.displayValue };
              })
            }
          }
        )}
        {(this.value || !this.autocompleteUrl) && this.optionRender(this.options, clickOption)}
        <slot></slot>
      </Host>
    );
  }
}
