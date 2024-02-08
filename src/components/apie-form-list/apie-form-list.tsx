import { Component, Prop, Host, h, State, Listen, Event, EventEmitter } from '@stencil/core';
import { applyEventTarget } from '../../utils/utils';

function loadTemplate(templateId: string): string {
  const templateElm = document.querySelector('#' + templateId);
  const divElement = document.createElement('div');
  divElement.appendChild(templateElm.cloneNode(true));
  var el = document.createElement('div');
  return String(templateElm.innerHTML).replace(/\&[#0-9a-z]+;/gi, function (enc) {
    el.innerHTML = enc;
    return el.innerText
  });
}

@Component({
  tag: 'apie-form-list',
  styleUrl: 'apie-form-list.css',
  shadow: false,
})
export class ApieFormList {
  @Prop() name: string;

  @Prop() label: string = '';

  @Prop({reflect: true, mutable: true}) value: Array<any> = [];

  @Prop() templateId: string;

  @Prop() replaceString: string = '__PROTO__';

  @State() previousList!: string;

  @Event({
    eventName: 'input',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) inputChanged: EventEmitter<any[]>;

  public handleClick() {
    this.value = this.value ? [...this.value, null] : [null];
    this.triggerInputOnChange();
  }

  public removeRow(key: number) {
    this.value.splice(key, 1);
    this.value = [...this.value]
    this.triggerInputOnChange();
  }

  @Listen('input') public onInput(ev: any) {
    if (ev?.target?.name && ev?.target?.value) {
      setTimeout(() => {
        this.value = [...applyEventTarget(
          this.name,
          this.value,
          ev.target
        )];
        this.triggerInputOnChange();
      }, 0)
    }
  }

  private triggerInputOnChange(): void
  {
    const current = JSON.stringify(this.value);
    if (current !== this.previousList) {
      this.previousList = current;
      setTimeout(() => {
        this.inputChanged.emit(this.value);
      }, 0);
    }
  }

  render() {
    return (
      <Host>
        <pre>{ JSON.stringify(this.value, null, 4) }</pre>
        <gr-field-group label={this.label} style="">
          <gr-button onClick={() => this.handleClick()} class="unhandled-add-to-list-button" variant="secondary">
            <ion-icon name="add-circle-outline"></ion-icon> Add
          </gr-button>
          <div class="field-list">
            { this.value.map((value: any, key: number) => 
            <div>
              <gr-button onClick={() => this.removeRow(key)}>
                <ion-icon name="close-circle-outline">X</ion-icon>
              </gr-button>
              <apie-scalar-element key={key} name={this.name + '[' + key + ']'} value={value} innerHTML={loadTemplate(this.templateId).replace(this.replaceString, String(key))}>
              </apie-scalar-element>
            </div>
            ) }
          </div>
          <slot></slot>
        </gr-field-group>
      </Host>
    );
  }
}
/**
 * <gr-field-group label="{{ property('name') }}" style="box-shadow: var(--gr-shadow-x-large); width: 100%">
  <gr-button class="unhandled-add-to-list-button" variant="secondary" data-template="{{ component('__proto__')|e }}">
    <ion-icon name="add-circle-outline"></ion-icon> Add
  </gr-button>
  <div style="margin-left: 10%; width: 86%; padding: 2%">
    {% for componentName in property('alreadyRendered') %}
      {{ component(componentName) }}
    {% endfor %}
  </div>
  <script>
  (function (element) {
    const id = provideId();
    element.addEventListener('click', function (event) {
      const target = event.target || element;
      const listContainer = target.nextElementSibling;
      var div = document.createElement('div');
      div.classList.add('form-list-item' + id);
      const keyName = document.querySelectorAll('.form-list-item' + id).length;
      setInnerHtml(div, target.dataset.template.replace(/{{ property('name').getPrototypeName() }}|__PROTO__/g, keyName));
      listContainer.appendChild(div);
    })
    element.classList.remove('unhandled-add-to-list-button');
  }(document.querySelector('.unhandled-add-to-list-button')));
  </script>
</gr-field-group>
 */