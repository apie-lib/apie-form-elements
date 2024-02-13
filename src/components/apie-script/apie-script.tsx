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
    var tmp = document.createElement('div');
    script.innerHTML = String(this.el.innerHTML).replace(/\&[#0-9a-z]+;/gi, function (enc) {
      tmp.innerHTML = enc;
      return tmp.innerText
    });
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
