# apie-date



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute     | Description | Type                                                                                                                                      | Default                                                                                                                                                                                  |
| --------------- | ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apie`          | --            |             | `Symbol`                                                                                                                                  | `APIE_FORM_CONTROLLER`                                                                                                                                                                   |
| `dateFormat`    | `date-format` |             | `string`                                                                                                                                  | `''`                                                                                                                                                                                     |
| `internalState` | --            |             | `{ date: string; month: string; year: string; hours: string; minutes: string; seconds: string; microseconds: string; timezone: string; }` | `{     date: '',     month: '',     year: '',     hours: '',     minutes: '',     seconds: '',     microseconds: '',     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone   }` |
| `label`         | `label`       |             | `string`                                                                                                                                  | `null`                                                                                                                                                                                   |
| `name`          | `name`        |             | `string`                                                                                                                                  | `undefined`                                                                                                                                                                              |
| `types`         | `types`       |             | `string`                                                                                                                                  | `''`                                                                                                                                                                                     |
| `value`         | `value`       |             | `string`                                                                                                                                  | `null`                                                                                                                                                                                   |


## Events

| Event                  | Description | Type                       |
| ---------------------- | ----------- | -------------------------- |
| `triggerChange`        |             | `CustomEvent<ChangeEvent>` |
| `triggerInternalState` |             | `CustomEvent<ChangeEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
