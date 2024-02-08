# apie-form-list



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type     | Default       |
| --------------- | ---------------- | ----------- | -------- | ------------- |
| `label`         | `label`          |             | `string` | `''`          |
| `name`          | `name`           |             | `string` | `undefined`   |
| `replaceString` | `replace-string` |             | `string` | `'__PROTO__'` |
| `templateId`    | `template-id`    |             | `string` | `undefined`   |
| `value`         | --               |             | `any[]`  | `[]`          |


## Events

| Event   | Description | Type                 |
| ------- | ----------- | -------------------- |
| `input` |             | `CustomEvent<any[]>` |


## Dependencies

### Depends on

- gr-field-group
- gr-button
- [apie-scalar-element](../apie-scalar-element)

### Graph
```mermaid
graph TD;
  apie-form-list --> gr-field-group
  apie-form-list --> gr-button
  apie-form-list --> apie-scalar-element
  gr-button --> gr-spinner
  style apie-form-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
