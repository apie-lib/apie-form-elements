# apie-single-input



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description | Type                  | Default                                   |
| -------------------- | --------- | ----------- | --------------------- | ----------------------------------------- |
| `additionalSettings` | --        |             | `SingleFieldSettings` | `{}`                                      |
| `label`              | `label`   |             | `string`              | `null`                                    |
| `name`               | `name`    |             | `string`              | `undefined`                               |
| `renderInfo`         | --        |             | `RenderInfo`          | `new FallbackRenderInfo()`                |
| `types`              | `types`   |             | `string`              | `''`                                      |
| `validationResult`   | --        |             | `ValidationResult`    | `{     valid: true,     messages: []   }` |
| `value`              | `value`   |             | `string`              | `undefined`                               |


## Events

| Event           | Description | Type                       |
| --------------- | ----------- | -------------------------- |
| `triggerChange` |             | `CustomEvent<ChangeEvent>` |


## Dependencies

### Used by

 - [apie-form](../apie-form)

### Graph
```mermaid
graph TD;
  apie-form --> apie-single-input
  style apie-single-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
