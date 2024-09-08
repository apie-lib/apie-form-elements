import { Component, Host, State, Prop, h, Element, Event, EventEmitter, Listen } from '@stencil/core';
import {
  APIE_FORM_CONTROLLER,
  ChangeEvent,
  isApieConstraint,
  isApieFormElement,
  loadTemplate,
} from '../../utils/utils';

@Component({
  tag: 'apie-render-template',
  styleUrl: 'apie-render-template.css',
  shadow: false,
})
export class ApieRenderTemplate {
  @Element() el: HTMLElement;

  @Prop() templateId: string;

  @Prop() replaceString: string;

  @Prop({reflect: true}) name: string;

  @Prop({reflect: true, mutable: true}) value: any;

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @State() previousInnerHTML: string;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  @Listen('triggerChange') onTriggerChange(event: CustomEvent<ChangeEvent>) {
    const child: any = event.target;
    if (isApieFormElement(child) && child.name === this.name && child !== this.el) {
      this.value = event.detail.value;
      this.triggerChange.emit({ name: this.name, value: this.value });
    }
  }
  private renderTemplate(): string {
    let tmpl = loadTemplate(this.templateId);
    if (this.replaceString) {
      tmpl = tmpl.replace(new RegExp(this.replaceString, 'g'), this.name);
    }
    return tmpl;
  }

  public componentDidRender() {
    const currentInnerHTML = this.renderTemplate();
    if (currentInnerHTML !== this.previousInnerHTML) {
      this.el.innerHTML = currentInnerHTML;
      try {
        this.handleInnerHTMLChange();
      } finally {
        Promise.resolve().then(() => {
          this.previousInnerHTML = currentInnerHTML;
        })
      }
    }
    this.el.childNodes.forEach((child: any) => {
      if (isApieFormElement(child)) {
        child.name = this.name;
        child.value = this.value;
      } else if (isApieConstraint(child)) {
        child.value = this.value;
      }
    });
  }

  async handleInnerHTMLChange(){
    await Promise.resolve();
    this.el.childNodes.forEach((child: any) => {
      if (isApieFormElement(child)) {
        this.value = child.value;
      }
    });
  }

  render() {
    return (
      <Host>
      </Host>
    );
  }

}
