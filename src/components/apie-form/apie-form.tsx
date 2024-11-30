import { Component, Host, Prop, Watch, VNode, h } from '@stencil/core';
import { changeForm, createFormFieldState, FormDefinition, FormField, FormFieldState, FormStateDefinition, handlesValidationForField, NestedRecord, Primitive, SubmitField, toChildState, validate } from '../../utils/FormDefinition';
import { clone, toArray, toString } from '../../utils/utils';
import { RenderInfo, toSingleError } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';

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
  @Prop({reflect: true, mutable: true}) initialValue!: NestedRecord<SubmitField>;
  @Prop({reflect: true, mutable: true}) value: NestedRecord<SubmitField> = {};
  @Prop({reflect: true, mutable: true}) internalState: NestedRecord<Primitive> = {};
  @Prop({reflect: true, mutable: true}) validationErrors: NestedRecord<string> = {};

  @Prop({reflect: true, mutable: true}) definitionId: string;

  @Prop({ reflect: true }) supportsMultipart: boolean = false;

  @Prop({ reflect: true }) debugMode: boolean = false;

  @Prop({reflect: true}) renderInfo: RenderInfo = new FallbackRenderInfo();

  @Prop({reflect: true}) polymorphicColumnName?: string = undefined;

  @Prop({reflect: true}) polymorphicFormDefinition?: Record<string, string> = undefined;

  instantiated: boolean = false;

  private onInternalStateUpdate(fieldNamePath: string[], value: SubmitField) {
    if (fieldNamePath.length === 0) {
      // todo ensure {}
      this.internalState = value as any;
      return;
    }
    let ptr: any = this.internalState;
    let fieldName: string = fieldNamePath[0];
    if (fieldNamePath.length === 1) {
      ptr[fieldName] = value;
      this.internalState = { ...this.internalState }
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
    this.internalState = { ...this.internalState }
  }

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
      if (!Object.prototype.hasOwnProperty.call(ptr, fieldName) || ptr[fieldName] === null || typeof ptr[fieldName] !== 'object') {
        ptr[fieldName] = {};
      }
      ptr = ptr[fieldName];
    }
    fieldName = fieldNamePath.shift();
    ptr[fieldName] = value;
    this.value = { ...this.value }
  }

  private getItem(fieldNamePath: string[]): any {
    let fieldNamePathCopy = fieldNamePath.slice(0)
    let ptr: any = this.value;
    let fieldName: string;
    while (fieldNamePathCopy.length > 0) {
      fieldName = fieldNamePathCopy.shift();
      ptr = ptr[fieldName] ? ptr[fieldName] : [];
    }
    return ptr;
  }

  private onAddItemList(fieldNamePath: string[]) {
    const ptr: any[] = toArray(this.getItem(fieldNamePath)).slice(0);
    ptr.push(null);
    this.onFieldUpdate(fieldNamePath, ptr as any);
  }

  private removeFromList(fieldNamePath: string[], index: number)
  {
    const ptr: any[] = toArray(this.getItem(fieldNamePath)).slice(0);
    ptr.splice(index, 1);
    this.onFieldUpdate(fieldNamePath, ptr as any);
  }

  private renderRootField(formField: FormField, formDefinition: FormStateDefinition) {
    const formFieldState = createFormFieldState(formField, formDefinition);
    return this.renderInfo.renderListOrMapRow(
      {
        mappingKey: formField.name,
        isMap: true,
      },
      this.renderField(formFieldState, [])
    );
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

  @Watch('polymorphicFormDefinition')
  @Watch('polymorphicColumnName')
  updateDefinitionIdOnPolymorphicDefinition(): void
  {
    if (!this.polymorphicColumnName) {
      return;
    }
    this.definitionId = this.value[this.polymorphicColumnName] ? toString(this.value[this.polymorphicColumnName] as any) : undefined;
  }

  public renderPolymorphicSelection(): VNode|VNode[]
  {
    if (!this.polymorphicFormDefinition) {
      return [];
    }
    return this.renderInfo.renderSingleInput(
      ['polymorphic_select', 'select'],
      {
        name: this.polymorphicColumnName,
        label: 'type',
        value: this.value[this.polymorphicColumnName] as any,
        disabled: !this.polymorphicColumnName || Object.entries(this.polymorphicFormDefinition).length === 0,
        valueChanged: (newValue?: string) => {
          this.value[this.polymorphicColumnName] = newValue as any;
          this.updateDefinitionIdOnPolymorphicDefinition();
          this.value = { ...this.value }
        },
        touched: !this.polymorphicColumnName,
        onTouched: () => {},
        additionalSettings: {
          options: Object.entries(this.polymorphicFormDefinition)
            .map(([value, name]) => { return { name, value }}),
        },
        validationResult: {
          valid: true,
          messages: []
        },
        serverValidationError: toSingleError(
          this.validationErrors[this.polymorphicColumnName],
          this.value[this.polymorphicColumnName],
          this.initialValue[this.polymorphicColumnName],
        ),
        renderInfo: this.renderInfo,
        currentFieldWrapper: this.renderInfo.createFieldWrapper(),
      }
    )
  }

  private formName(prefixes: string[]): string
  {
    if (prefixes.length === 0) {
      return 'form';
    }
    return 'form[' + prefixes.join('][') + ']';
  }

  private renderField(state: FormFieldState, prefixes: string[], key: number | string | null = null) {
    const newPrefix = [...prefixes, state.form.name];
    const validationResult = validate(state.value, state.form.constraints);
    if (state.form.fieldType === 'single') {
      return <apie-single-input
        key={key ?? state.form.name}
        name={this.formName(newPrefix)}
        types={state.form.types.join(',')}
        label={state.form.label}
        value={state.value as any}
        allowsNull={state.form.allowsNull}
        emptyStringAllowed={state.form.emptyStringAllowed}
        required={state.form.required}
        renderInfo={this.renderInfo}
        additionalSettings={state.form.additionalSettings}
        onTriggerChange={(ev) => { this.onFieldUpdate(newPrefix.slice(0), ev.detail.value as any)}}
        validationResult={validationResult}
        serverValidationError={toSingleError(
          state.validationErrors,
          state.value,
          state.initialValue
        )}
      ></apie-single-input>
    }
    if (state.form.fieldType === 'group') {
      const subElements = [];
      let index = 0;
      const unmappedValidationErrors = new Set(Object.keys(state.validationErrors ?? {}));
      for (let formField of state.form.fields) {
        let newState = toChildState(formField, state);
        if (handlesValidationForField(formField)) {
          unmappedValidationErrors.delete(formField.name);
        }
        subElements.push(this.renderField(newState, newPrefix, index));
        index++;
      }
      subElements.push(
        this.renderInfo.renderUnmappedErrors(unmappedValidationErrors, state.validationErrors)
      );
      return this.renderInfo.renderFormGroup(
        {
          name: state.form.name,
          label: state.form.label,
          value: state.value,
        },
        subElements,
        key
      );
    }
    if (state.form.fieldType === 'map') {
      const subElements = [];
      const formName = this.formName(newPrefix);
      const list = Array.from(Object.entries(state.value as any ?? {}));
      const unmappedValidationErrors = new Set(Object.keys(state.validationErrors ?? {}));
      for (let index = 0; index < list.length; index++) {
        const subFormField: FormField = clone(state.form.subField);
        subFormField.name = String(list[index][0]);
        if (handlesValidationForField(subFormField)) {
          unmappedValidationErrors.delete(subFormField.name);
        }
        let newState = toChildState(subFormField, state);
        subElements.push(this.renderField(newState, newPrefix, index));
      }
      subElements.push(
        this.renderInfo.renderUnmappedErrors(unmappedValidationErrors, state.validationErrors)
      );
      return <apie-form-map
        key={key ?? state.form.name}
        subElements={subElements}
        name={formName}
        types={state.form.types.join(',')}
        label={state.form.label}
        value={state.value}
        renderInfo={this.renderInfo}
        onTriggerChange={(ev) => { ev.detail.name === formName && this.onFieldUpdate(newPrefix, ev.detail.value as any)}}
        ></apie-form-map>
    }
    if (state.form.fieldType === 'list') {
      const subElements = [];
      const list = toArray(state.value).slice(0);
      const unmappedValidationErrors = new Set(Object.keys(state.validationErrors ?? {}));
      for (let index = 0; index < list.length; index++) {
        const subFormField: FormField = clone(state.form.subField);
        subFormField.name = String(index);
        if (handlesValidationForField(subFormField)) {
          unmappedValidationErrors.delete(subFormField.name);
        }
        let newState = toChildState(subFormField, state);
        subElements.push(
          this.renderInfo.renderListOrMapRow(
            {
              mappingKey: index,
              isMap:false,
              onRowRemove: () => this.removeFromList(newPrefix.slice(0), index),
            },
            this.renderField(newState, newPrefix, index)
          )
        );
      }
      subElements.push(this.renderInfo.renderAddItemToList({
        mappingKey: '__add' + (key ?? 'unknown'),
        isMap: true,
        label: 'Add',
        disabled: false,
         onRowAdd: () => this.onAddItemList(newPrefix.slice(0))
      }));
      subElements.push(
        this.renderInfo.renderUnmappedErrors(unmappedValidationErrors, state.validationErrors)
      );
      return this.renderInfo.renderFormGroup(
        {
          name: state.form.name,
          label: state.form.label,
          value: state.value,
        },
        subElements,
        key ?? state.form.name
      );
    }

    if (state.form.fieldType === 'split') {
      const formName = this.formName(newPrefix);
      const selected = state.internalState?._split ?? null;
      let selectedField = null;
      for (let subField of state.form.subFields) {
        if (subField.value === selected) {
          selectedField = subField;
          break;
        }
      }

      return [
        <apie-form-select
          key={key ?? state.form.name}
          name={formName}
          label={state.form.label}
          value={state.value}
          options={state.form.subFields}
          renderInfo={this.renderInfo}
          internalState={state.internalState ?? {}}
          onTriggerChange={(ev) => { ev.detail.name === formName && this.onFieldUpdate(newPrefix, ev.detail.value as any)}}
          onTriggerInternalState={(ev) => { ev.detail.name === formName && this.onInternalStateUpdate(newPrefix, ev.detail.value as any)}}
          ></apie-form-select>,
          selectedField && this.renderField(changeForm(selectedField.definition, state), prefixes, key + '_subform')
        ]
    }
    console.log(state);
    return <div></div>
  }

  private renderSubmitButton() {
    return this.renderInfo.renderSubmitButton({
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
    if (!this.initialValue) {
      this.initialValue = clone(this.value);
    }
    if (this.polymorphicFormDefinition) {
      this.updateDefinitionIdOnPolymorphicDefinition();
    }
    if (this.definitionId) {
      this.onDefinitionIdChange(this.definitionId);
    }
  }

  disconnectedCallback() {
    this.instantiated = false;
  }

  render() {
    const formDefinition = this.formDefinition ?? null;
    if (!formDefinition) {
      return <Host>{this.renderPolymorphicSelection()}</Host>
    }
    const state: FormStateDefinition = {
      form: formDefinition,
      csrfToken: this.csrfToken,
      value: this.value,
      initialValue: this.initialValue,
      internalState: this.internalState,
      validationErrors: this.validationErrors,
    }
    const fields = [];
    const unmappedValidationErrors = new Set(Object.keys(state.validationErrors ?? {}));
    formDefinition.fields.forEach((formField: FormField) => {
      fields.push(this.renderRootField(formField, state));
      if (handlesValidationForField(formField)) {
        unmappedValidationErrors.delete(formField.name);
      }
    });
    fields.push(
      this.renderInfo.renderUnmappedErrors(unmappedValidationErrors, state.validationErrors)
    );

    return (
      <Host>
        { this.debugMode && <pre>{ JSON.stringify(
          this.value,
          (_key: string, value: any) => {
            if (value instanceof File) { return { name: value.name, type: value.type, lastModified: value.lastModified, size: value.size }; }
            return value;
          },
          4
        ) }</pre>}
        { this.renderPolymorphicSelection() }
        <slot></slot>
        { this.renderInfo.renderFormGroup(
          {
            name: '',
            value: this.value,
          },
          fields,
          null
        ) }
        <form action={this.getCalculatedAction()} method={this.method} enctype={this.supportsMultipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
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
