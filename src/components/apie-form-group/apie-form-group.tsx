import { Component, Host, h, Element, Prop, State, Listen, Event, Watch, EventEmitter, VNode } from '@stencil/core';
import {
  APIE_FORM_CONTROLLER,
  ChangeEvent,
  FormNameSplit,
  isApieConstraint,
  isApieFormElement,
} from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';

@Component({
  tag: 'apie-form-group',
  styleUrl: 'apie-form-group.css',
  shadow: true,
})
export class ApieFormGroup {
  @Element() el: HTMLElement;

  @Prop() name: string;

  @Prop() label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: Record<string, any> = {}

  @Prop({reflect: true, mutable: true}) internalState: Record<string, any> = {}

  @Prop({reflect: true, mutable: true}) validationError: Record<string, any> = {}

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @State() foundInputs: string[] = [];

  @State() valueState!: string;

  @State() internalStateState!: string;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  @Event() triggerInternalState: EventEmitter<ChangeEvent>

  @Listen('triggerChange') onTriggerChange(event: CustomEvent<ChangeEvent>) {
    const child: any = event.target;
    if (isApieFormElement(child) && child.name.indexOf(this.name) === 0) {
      const childName = child.name.substring(this.name.length).split(new FormNameSplit());
      if (childName.length === 1) {
        this.value[childName[0]] = event.detail.value;
        this.updateValuesIfNeeded(event.detail.force);
      }
    }
  }
  @Listen('triggerInternalState') onTriggerInternalState(event: CustomEvent<ChangeEvent>) {
    const child: any = event.target;
    if (isApieFormElement(child) && child.name.indexOf(this.name) === 0) {
      const childName = child.name.substring(this.name.length).split(new FormNameSplit());
      if (childName.length === 1) {
        this.internalState[childName[0]] = event.detail.value;
        this.updateValuesIfNeeded();
      }
    }
  }

  private updateValuesIfNeeded(forced: boolean = false): void {
    const valueState = JSON.stringify(this.value);
    const internalStateState: string = JSON.stringify(this.internalState);
    if (forced || valueState !== this.valueState) {
      Promise.resolve().then(() => {
        this.valueState = valueState;
        this.value = { ...this.value };
        this.triggerChange.emit({ name: this.name, value: this.value, force: forced });
      })
    }
    if (forced || internalStateState !== this.internalStateState) {
      Promise.resolve().then(() => {
        this.internalStateState = internalStateState;
        this.internalState = { ...this.internalState };
        this.triggerInternalState.emit({ name: this.name, value: this.internalState, force: forced });
      })
    }
  }

  private renderGroup(content: VNode): VNode
  {
    return renderTemplates.renderFormGroup({
      content,
      label: this.label,
    })
  }

  public componentDidRender()
  {
    const foundInputs: Set<string> = new Set();
    this.el.childNodes.forEach((child: any) => {
      if (!child.name || child.name.indexOf(this.name) !== 0) {
        return;
      }
      const childName = child.name.substring(this.name.length).split(new FormNameSplit());
      if (isApieFormElement(child)) {
        if (childName.length >= 1) {
          foundInputs.add(childName[0]);
        }
        if (childName.length === 1) {
          this.value[childName[0]] = child.value;
          this.internalState[childName[0]] = child.internalState;
        }
      } else if (isApieConstraint(child)) {
        if (childName.length >= 1) {
          foundInputs.add(childName[0]);
        }
        if (childName.length === 1) {
          child.value = this.value[childName[0]];
        }
      }
    });
    this.updateValuesIfNeeded();
    Promise.resolve().then(() => {
      const set = Array.from(foundInputs);
      if (JSON.stringify(this.foundInputs) !== JSON.stringify(set)) {
        this.foundInputs = set;
      }
    })
  }

  render() {
    return (
      <Host>
        {this.renderGroup(<slot></slot>)}
      </Host>
    );
  }

}
