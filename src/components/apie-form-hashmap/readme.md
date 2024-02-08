# apie-form-hashmap



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                                      | Default       |
| --------------- | ---------------- | ----------- | ----------------------------------------- | ------------- |
| `label`         | `label`          |             | `string`                                  | `''`          |
| `name`          | `name`           |             | `string`                                  | `undefined`   |
| `replaceString` | `replace-string` |             | `string`                                  | `'__PROTO__'` |
| `templateId`    | `template-id`    |             | `string`                                  | `undefined`   |
| `value`         | --               |             | `{ [x: string]: any; [x: number]: any; }` | `{}`          |


## Events

| Event   | Description | Type                                                   |
| ------- | ----------- | ------------------------------------------------------ |
| `input` |             | `CustomEvent<{ [x: string]: any; [x: number]: any; }>` |


## Dependencies

### Depends on

- gr-field-group
- gr-input
- gr-button
- [apie-scalar-element](../apie-scalar-element)

### Graph
```mermaid
graph TD;
  apie-form-hashmap --> gr-field-group
  apie-form-hashmap --> gr-input
  apie-form-hashmap --> gr-button
  apie-form-hashmap --> apie-scalar-element
  gr-button --> gr-spinner
  style apie-form-hashmap fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
