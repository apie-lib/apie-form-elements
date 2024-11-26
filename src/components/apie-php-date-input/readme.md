# apie-php-date-input



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute     | Description | Type                                                                     | Default                                                                                     |
| -------------------- | ------------- | ----------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `compiledDateformat` | --            |             | `DateFormatString`                                                       | `undefined`                                                                                 |
| `dateFormat`         | `date-format` |             | `string`                                                                 | `'Y-m-d\\TH:i'`                                                                             |
| `disabled`           | `disabled`    |             | `boolean`                                                                | `false`                                                                                     |
| `internalDate`       | --            |             | `PhpDate`                                                                | `new PhpDate('', '', '', '', '', '', '', Intl.DateTimeFormat().resolvedOptions().timeZone)` |
| `name`               | `name`        |             | `string`                                                                 | `undefined`                                                                                 |
| `renderInfo`         | --            |             | `RenderInfo`                                                             | `new FallbackRenderInfo()`                                                                  |
| `renderInputFn`      | --            |             | `(input: InputState, field: "display" \| TimeField) => VNode \| VNode[]` | `renderInput`                                                                               |
| `value`              | `value`       |             | `string`                                                                 | `undefined`                                                                                 |


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
