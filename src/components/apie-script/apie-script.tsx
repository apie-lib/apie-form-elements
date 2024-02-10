import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'apie-script',
  shadow: true,
})
export class ApieScript {
  @Element() el: HTMLElement;

  private script!: HTMLElement;

  componentWillLoad() {
    const script = document.createElement("script");
    console.log(this.el.innerHTML);
    script.innerHTML = this.el.innerHTML;
    this.script = script;
    document.head.appendChild(script);
    this.el.style.display = 'none';
  }

  disconnectedCallback() {
    this.script?.parentElement?.removeChild(this.script);
  }

  render() {
    return (
      <Host><slot></slot></Host>
    );
  }

}
