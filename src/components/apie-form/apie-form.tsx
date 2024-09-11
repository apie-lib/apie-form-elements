import { Component, Host, Prop, Watch, h } from '@stencil/core';
import { createFormFieldState, FormDefinition, FormField, FormFieldState, FormStateDefinition, NestedRecord, Primitive, SubmitField, toChildState } from '../../utils/FormDefinition';
import { toString } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';
@Component({
  tag: 'apie-form',
  styleUrl: 'apie-form.css',
  shadow: false,
})
export class ApieForm {
  @Prop({mutable: true, reflect: true}) formDefinition: FormDefinition;
  @Prop({reflect: true}) action: string = window.location.href;
  @Prop({reflect: true}) method: string = 'post';
  @Prop({reflect: true}) submitLabel: string = 'Submit';

  @Prop() csrfToken: string|null = null;
  @Prop({reflect: true, mutable: true}) value: NestedRecord<SubmitField> = {};
  @Prop({reflect: true, mutable: true}) internalState: NestedRecord<Primitive> = {};
  @Prop({reflect: true, mutable: true}) validationErrors: NestedRecord<string> = {};

  @Prop() definitionId: string;

  @Prop({ reflect: true }) supportsMultipart: boolean = false;

  @Prop({ reflect: true }) debugMode: boolean = false;

  instantiated: boolean = false;

  private onFieldUpdate(fieldNamePath: string[], value: SubmitField) {
    if (fieldNamePath.length === 0) {
      // todo ensure {}
      this.value = value as any;
      return;
    }
    let ptr: any = this.value;
    let fieldName: string = fieldNamePath[0];
    if (fieldNamePath.length === 1) {
      ptr[fieldName] = value;
      this.value = { ...this.value }
      return;
    }
    while (fieldNamePath.length > 1) {
      fieldName = fieldNamePath.shift();
      if (!Object.prototype.hasOwnProperty.call(ptr, fieldName)) {
        ptr[fieldName] = {};
      }
      ptr = ptr[fieldName];
    }
    fieldName = fieldNamePath.shift();
    ptr[fieldName] = value;
    this.value = { ...this.value }
  }

  private onAddItemList(fieldNamePath: string[]) {
    let fieldNamePathCopy = fieldNamePath.slice(0)
    let ptr: any = this.value;
    let fieldName: string;
    while (fieldNamePathCopy.length > 0) {
      fieldName = fieldNamePathCopy.shift();
      ptr = ptr[fieldName] ? ptr[fieldName] : [];
    }
    ptr = Array.from(ptr ?? []);
    ptr.push(null);
    this.onFieldUpdate(fieldNamePath, ptr);
  }

  private renderRootField(formField: FormField, formDefinition: FormStateDefinition) {
    const formFieldState = createFormFieldState(formField, formDefinition);
    return this.renderField(formFieldState, []);
  }

  @Watch('definitionId') async onDefinitionIdChange(newValue): Promise<void> {
    const definition = await new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (!this.instantiated || this.definitionId !== newValue) {
          clearInterval(id);
          reject(new Error('definitionId changed or component destroyed'));
        }
        const definition = document.getElementById(this.definitionId);
        if (definition) {
          clearInterval(id);
          resolve(definition);
        }
      })
    });
    this.formDefinition = await (definition as any).getDefinition();
  }

  private formName(prefixes: string[]): string
  {
    if (prefixes.length === 0) {
      return 'form';
    }
    return 'form[' + prefixes.join('][') + ']';
  }

  private renderField(state: FormFieldState, prefixes: string[], key: number | null = null) {
    const newPrefix = [...prefixes, state.form.name];
    if (state.form.fieldType === 'single') {
      return <apie-single-input
        key={key ?? state.form.name}
        name={this.formName(newPrefix)}
        types={state.form.types.join(',')}
        label={state.form.label}
        value={toString(state.value as any)}
        onTriggerChange={(ev) => { this.onFieldUpdate(newPrefix.slice(0), ev.detail.value as any)}}
      ></apie-single-input>
    }
    if (state.form.fieldType === 'group') {
      const subElements = [];
      let index = 0;
      for (let formField of state.form.fields) {
        let newState = toChildState(formField, state);
        subElements.push(this.renderField(newState, newPrefix, index));
        index++;
      }
      return <div key={key ?? state.form.name}>{subElements}</div>
    }
    if (state.form.fieldType === 'list') {
      const subElements = [];
      const list = Array.from(state.value as any ?? []);
      for (let index = 0; index < list.length; index++) {
        const subFormField: FormField = JSON.parse(JSON.stringify(state.form.subField));
        subFormField.name = String(index);
        let newState = toChildState(subFormField, state);
        subElements.push(this.renderField(newState, newPrefix, index));
      }
      return <div>
        <div key={key ?? state.form.name}>{subElements}</div>
        <button type="button" onClick={() => this.onAddItemList(newPrefix.slice(0)) }>Add</button>
      </div>
    }
    // TODO map
    return <div></div>
  }

  private renderSubmitButton() {
    return renderTemplates.renderSubmitButton({
      label: this.submitLabel,
      disabled: false
    })
  }

  private getCalculatedAction(): string {
    return String(this.action || '').replace(
      /\{([a-zA-Z0-9]+)\}/g,
      (_match: string, cp1: string): string => {
        return String(this.value[cp1] ?? '');
      }
    );
  }

  connectedCallback() {
    this.instantiated = true;
    if (this.definitionId) {
      this.onDefinitionIdChange(this.definitionId);
    }
  }

  disconnectedCallback() {
    this.instantiated = false;
  }

  render() {
    const formDefinition = this.formDefinition;
    if (!formDefinition) {
      return <Host></Host>
    }
    const state: FormStateDefinition = {
      form: formDefinition,
      csrfToken: this.csrfToken,
      value: this.value,
      internalState: this.internalState,
      validationErrors: this.validationErrors,
    }
    return (
      <Host>
        { this.debugMode && <pre>{ JSON.stringify(this.value, null, 4) }</pre>}
        <slot></slot>
        <form action={this.getCalculatedAction()} method={this.method} enctype={this.supportsMultipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
        { formDefinition.fields.map((formField: FormField) => this.renderRootField(formField, state))}
         <apie-render-types
         value={this.value}
         csrfToken={this.csrfToken}
         internalState={this.internalState}
         supportsMultipart={this.supportsMultipart}></apie-render-types>
         {this.renderSubmitButton()}
         </form>
      </Host>
    );
  }

}
