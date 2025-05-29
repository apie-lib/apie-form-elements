# apie-combobox-input



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type                                                                                               | Default                    |
| ----------------- | ------------------ | ----------- | -------------------------------------------------------------------------------------------------- | -------------------------- |
| `autocompleteUrl` | `autocomplete-url` |             | `string`                                                                                           | `undefined`                |
| `disabled`        | `disabled`         |             | `boolean`                                                                                          | `false`                    |
| `label`           | `label`            |             | `string`                                                                                           | `null`                     |
| `name`            | `name`             |             | `string`                                                                                           | `undefined`                |
| `optionRender`    | `option-render`    |             | `(options: ComboboxResult[], optionClicked: (result: ComboboxResult) => void) => VNode \| VNode[]` | `defaultOptionsRender`     |
| `options`         | `options`          |             | `ComboboxResult[]`                                                                                 | `[]`                       |
| `removeDisabled`  | `remove-disabled`  |             | `boolean`                                                                                          | `false`                    |
| `renderInfo`      | `render-info`      |             | `RenderInfo`                                                                                       | `new FallbackRenderInfo()` |
| `selectedValues`  | `selected-values`  |             | `string[]`                                                                                         | `[]`                       |
| `touched`         | `touched`          |             | `boolean`                                                                                          | `undefined`                |
| `value`           | `value`            |             | `string`                                                                                           | `undefined`                |


## Events

| Event                  | Description | Type                          |
| ---------------------- | ----------- | ----------------------------- |
| `fieldTouched`         |             | `CustomEvent<boolean>`        |
| `optionClicked`        |             | `CustomEvent<ComboboxResult>` |
| `selectedValueChanged` |             | `CustomEvent<string[]>`       |
| `valueChanged`         |             | `CustomEvent<string>`         |


## Methods

### `refetch() => Promise<Array<ComboboxResult>>`



#### Returns

Type: `Promise<ComboboxResult[]>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
