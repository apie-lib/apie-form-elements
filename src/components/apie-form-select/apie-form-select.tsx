import { Component, Event, EventEmitter, Host, State, Prop, VNode, Watch, h } from '@stencil/core';
import { ChangeEvent } from '../../utils/utils';
import { RenderInfo, Option } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';
import { NestedRecord } from '../../components';

@Component({
  tag: 'apie-form-select',
  styleUrl: 'apie-form-select.css',
  shadow: true,
})
export class ApieFormSelect {
  @Prop() subElements: VNode[]

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: Record<string, any>;

  @Prop({reflect: true, mutable: true}) internalState: Record<string, any> = {};

  @Prop({reflect: true, mutable: true}) options: Array<Option> = []

  @Prop({reflect: true}) renderInfo: RenderInfo = new FallbackRenderInfo();

  @Prop({reflect: true}) serverValidationError: NestedRecord<string> = {};

  @State() touched: boolean = false;

  @Event() triggerChange: EventEmitter<ChangeEvent>;

  @Event() triggerInternalState: EventEmitter<ChangeEvent>;

  private renderSelect()
  {
    return this.renderInfo.renderSingleInput(['select'], {
      name: this.name,
      label: this.label ?? undefined,
      value: this.internalState?._split ?? null,
      disabled: this.options.length === 0,
      valueChanged: (newValue?: string): void => {
        const internalState = this.internalState ? { ...this.internalState } : {}
        const prevSplit = internalState._split ?? null;
        internalState._split = newValue;
        if (prevSplit) {
          internalState[prevSplit] = this.value
        }
        this.value = newValue ? (internalState[newValue] ?? null) : null;
        this.internalState = internalState;
        this.triggerInternalState.emit({
          name: this.name,
          value: this.internalState,
          force: true
        })
        this.triggerChange.emit({
          name: this.name,
          value: this.value,
          force: true
        })
      },
      touched: this.touched,
      onTouched: () => this.touched = true,
      additionalSettings: {
        options: this.options,
      },
      validationResult: {
        valid: true,
        messages: []
      },
      serverValidationError: this.serverValidationError,
      renderInfo: this.renderInfo,
      currentFieldWrapper: this.renderInfo.createFieldWrapper(),
    })
  }

  componentWillLoad()
  {
    this.sanitizeInternalState();
  }

  @Watch('internalState')
  @Watch('value')
  private sanitizeInternalState()
  {
    const curValue = this.internalState._split;
    for (let option of this.options) {
      if (option.value === curValue) {
        return;
      }
    }
    this.internalState._split = this.options[0]?.value as any;
    this.internalState = { ...this.internalState };
    this.triggerInternalState.emit({
      name: this.name,
      value: this.internalState,
      force: true
    });
  }

  render() {
    return (
      <Host>
        <div>
          {this.renderSelect()}
          <slot></slot>
        </div>
      </Host>
    );
  }

}
