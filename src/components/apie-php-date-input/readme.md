# apie-php-date-input



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute             | Description | Type                                                                     | Default                                                                                     |
| -------------------- | --------------------- | ----------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `compiledDateformat` | `compiled-dateformat` |             | `DateFormatString`                                                       | `undefined`                                                                                 |
| `dateFormat`         | `date-format`         |             | `string`                                                                 | `'Y-m-d\\TH:i'`                                                                             |
| `disabled`           | `disabled`            |             | `boolean`                                                                | `false`                                                                                     |
| `internalDate`       | `internal-date`       |             | `PhpDate`                                                                | `new PhpDate('', '', '', '', '', '', '', Intl.DateTimeFormat().resolvedOptions().timeZone)` |
| `name`               | `name`                |             | `string`                                                                 | `undefined`                                                                                 |
| `renderInfo`         | `render-info`         |             | `RenderInfo`                                                             | `new FallbackRenderInfo()`                                                                  |
| `renderInputFn`      | `render-input-fn`     |             | `(input: InputState, field: "display" \| TimeField) => VNode \| VNode[]` | `renderInput`                                                                               |
| `value`              | `value`               |             | `string`                                                                 | `undefined`                                                                                 |


## Events

| Event     | Description | Type                  |
| --------- | ----------- | --------------------- |
| `change`  |             | `CustomEvent<string>` |
| `touched` |             | `CustomEvent<void>`   |


## Methods

### `updateToCurrentTime() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
