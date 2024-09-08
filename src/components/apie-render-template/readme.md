# apie-render-template



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type     | Default                |
| --------------- | ---------------- | ----------- | -------- | ---------------------- |
| `apie`          | --               |             | `Symbol` | `APIE_FORM_CONTROLLER` |
| `name`          | `name`           |             | `string` | `undefined`            |
| `replaceString` | `replace-string` |             | `string` | `undefined`            |
| `templateId`    | `template-id`    |             | `string` | `undefined`            |
| `value`         | `value`          |             | `any`    | `undefined`            |


## Events

| Event           | Description | Type                       |
| --------------- | ----------- | -------------------------- |
| `triggerChange` |             | `CustomEvent<ChangeEvent>` |


## Dependencies

### Used by

 - [apie-form-hashmap](../apie-form-hashmap)
 - [apie-form-list](../apie-form-list)
 - [apie-form-select](../apie-form-select)

### Graph
```mermaid
graph TD;
  apie-form-hashmap --> apie-render-template
  apie-form-list --> apie-render-template
  apie-form-select --> apie-render-template
  style apie-render-template fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
