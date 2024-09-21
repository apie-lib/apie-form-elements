# apie-form



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type                                                 | Default                    |
| ------------------- | -------------------- | ----------- | ---------------------------------------------------- | -------------------------- |
| `action`            | `action`             |             | `string`                                             | `window.location.href`     |
| `csrfToken`         | `csrf-token`         |             | `string`                                             | `null`                     |
| `debugMode`         | `debug-mode`         |             | `boolean`                                            | `false`                    |
| `definitionId`      | `definition-id`      |             | `string`                                             | `undefined`                |
| `formDefinition`    | --                   |             | `FormDefinition`                                     | `undefined`                |
| `internalState`     | --                   |             | `{ [key: string]: NestedRecordField<Primitive>; }`   | `{}`                       |
| `method`            | `method`             |             | `string`                                             | `'post'`                   |
| `renderInfo`        | --                   |             | `RenderInfo`                                         | `new FallbackRenderInfo()` |
| `submitLabel`       | `submit-label`       |             | `string`                                             | `'Submit'`                 |
| `supportsMultipart` | `supports-multipart` |             | `boolean`                                            | `false`                    |
| `validationErrors`  | --                   |             | `{ [key: string]: NestedRecordField<string>; }`      | `{}`                       |
| `value`             | --                   |             | `{ [key: string]: NestedRecordField<SubmitField>; }` | `{}`                       |


## Dependencies

### Depends on

- [apie-single-input](../apie-single-input)
- [apie-form-map](../apie-form-map)
- [apie-form-select](../apie-form-select)
- [apie-render-types](../apie-render-types)

### Graph
```mermaid
graph TD;
  apie-form --> apie-single-input
  apie-form --> apie-form-map
  apie-form --> apie-form-select
  apie-form --> apie-render-types
  style apie-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
