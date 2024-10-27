import { Component, Event, EventEmitter, Host, Method, Prop, State, VNode, Watch, h } from '@stencil/core';
import { PhpDate } from '../../utils/dates/PhpDate';
import { DateFormatString } from '../../utils/dates/DateFormatString';
import { Timezone, timezones } from '../../utils/timezones';
import { InputState, RenderInfo } from '../../utils/RenderInfo';
import { FallbackRenderInfo } from '../../utils/FallbackRenderInfo';

export type TimeField = 'hours'|'minutes'|'seconds'|'milliseconds'|'microseconds'|'date'|'month'|'year'|'timezone';

export type RenderInputFn = (
  input: InputState,
  field: TimeField | 'display'
) => VNode | VNode[]

function renderInput(input: InputState, field: TimeField | 'display'): VNode | VNode[] {
  if (field === 'timezone') {
    input = { additionalSettings: {}, ...input };
    input.additionalSettings.options = timezones.map((t: Timezone) => {
      return { name: t.timezone_id, value: t.timezone_id };
    })
    return input.renderInfo.renderSingleInput(['date-timezone', 'select'], input);    
  }
  if (field === 'display') {
    return input.renderInfo.renderSingleInput(['date-display', 'text'], input);
  }

  return input.renderInfo.renderSingleInput(['date-' + field, 'integer', 'number', 'text'], input);
}

@Component({
  tag: 'apie-php-date-input',
  styleUrl: 'apie-php-date-input.css',
  shadow: true,
})
export class ApiePhpDateInput {
  @Prop() name: string;

  @Prop({ mutable: true, reflect: true }) value: string;

  @Prop() disabled: boolean = false;

  @Prop({ reflect: true }) dateFormat: string = 'Y-m-d\\TH:i';

  @State() showDatePicker: boolean = false;

  @Prop({ mutable: true, reflect: true }) internalDate: PhpDate = new PhpDate('', '', '', '', '', '', '', Intl.DateTimeFormat().resolvedOptions().timeZone)

  @Prop({ mutable: true, reflect: true }) compiledDateformat: DateFormatString;

  @Prop() renderInputFn: RenderInputFn = renderInput;

  @Prop() renderInfo: RenderInfo = new FallbackRenderInfo();

  @Event() change: EventEmitter<string>;

  public toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  componentWillLoad() {
    this.compiledDateformat = new DateFormatString(this.dateFormat);
    if (this.value) {
      this.internalDate = this.compiledDateformat.createFromString(this.value, this.internalDate);
    }
    this.checkValue();
  }

  @Watch('value')
  @Watch('compiledDateformat')
  private updateInternalDate() {
    if (this.value) {
      this.internalDate = this.compiledDateformat.createFromString(this.value, this.internalDate);
    }
    this.checkValue();
  }

  @Watch('dateFormat')
  public updateDateFormat() {
    this.compiledDateformat = new DateFormatString(this.dateFormat);
    this.updateInternalDate();
  }

  private checkValue(): void {
    const _value = this.compiledDateformat.isValid(this.internalDate)
      ? this.compiledDateformat.convertToString(this.internalDate)
      : null;
    if (_value !== this.value) {
      this.value = _value;
      this.change.emit(this.value);
    }
  }

  private update(key: TimeField, value: any) {
    this.internalDate[key] = value;
    this.internalDate = this.internalDate.clone();
    this.checkValue();
  }

  @Method() public async updateToCurrentTime(): Promise<void> {
    this.internalDate = PhpDate.createFromLocalDate(); // todo correct timezone?
    this.checkValue();
    await Promise.resolve();
  }

  public get displayHourFields(): boolean
  {
    return this.compiledDateformat.displayHours
     || this.compiledDateformat.displayMinutes
     || this.compiledDateformat.displaySeconds
     || this.compiledDateformat.displayMilliseconds
     || this.compiledDateformat.displayMicroseconds
  }

  public get displayDateFields(): boolean
  {
    return this.compiledDateformat.displayDate
     || this.compiledDateformat.displayMonth
     || this.compiledDateformat.displayYear;
  }

  private renderField(fieldName: TimeField): VNode|VNode[]
  {
    const input: InputState = {
      name: fieldName,
      value: this.internalDate[fieldName],
      disabled: this.disabled,
      valueChanged: (newValue?: string) => this.update(fieldName, newValue),
      renderInfo: this.renderInfo,
      validationResult: {
        valid: this.compiledDateformat.isValid(this.internalDate),
        messages: []
      }
    }
    return this.renderInputFn(input, fieldName);
  }

  private renderDateValue(): VNode|VNode[]
  {
    const input: InputState = {
      name: this.name,
      value: this.compiledDateformat.convertToString(this.internalDate),
      disabled: this.disabled,
      valueChanged: (_newValue?: string) => {},
      renderInfo: this.renderInfo,
      validationResult: {
        valid: true,
        messages: []
      }
    }
    const res = this.renderInputFn(input, 'display');
    if (Array.isArray(res)) {
      res.forEach((r: VNode) => {
        if (r?.$attrs$) {
          r.$attrs$.readonly = true;
        }
      });
    } else if (res?.$attrs$) {
      res.$attrs$.readonly = true;
    }
    return res;
  }

  private renderTimeFields(): VNode|VNode[]
  {
    // Format date and time separately with Intl.DateTimeFormat
    const dateFormat = new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).formatToParts(new Date);
    // Extract order from date parts
    const dateParts = [];
    dateFormat.forEach(part => {
        if (part.type === 'hour' && this.compiledDateformat.displayHours) {
          dateParts.push(this.renderField('hours'));
        }
        if (part.type === 'minute' && this.compiledDateformat.displayMinutes) {
          dateParts.push(this.renderField('minutes'));
        }
        if (part.type === 'second') {
          if (this.compiledDateformat.displaySeconds) {
            dateParts.push(this.renderField('seconds'));
          }
          if (this.compiledDateformat.displayMicroseconds) {
            dateParts.push(this.renderField('microseconds'));
          } else if (this.compiledDateformat.displayMilliseconds) {
            dateParts.push(this.renderField('milliseconds'));
          }
        }
    });
    return <div style={{display: 'flex'}}>
    { dateParts }
  </div>
  }

  private renderDateFields(): VNode|VNode[]
  {
    // Format date and time separately with Intl.DateTimeFormat
    const dateFormat = new Intl.DateTimeFormat(navigator.language, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(new Date);
    // Extract order from date parts
    const dateParts = [];
    dateFormat.forEach(part => {
        if (part.type === 'day' && this.compiledDateformat.displayDate) {
          dateParts.push(this.renderField('date'));
        }
        if (part.type === 'month' && this.compiledDateformat.displayMonth) {
          dateParts.push(this.renderField('month'));
        }
        if (part.type === 'year' && this.compiledDateformat.displayYear) {
          dateParts.push(this.renderField('year'));
        }
    });
    return <div style={{display: 'flex'}}>
    { dateParts }
    </div>
  }

  private renderNow()
  {
    return <slot name="now"><button type="button" onClick={() => this.updateToCurrentTime()}>NOW</button></slot>
  }

  render() {
    const displayHours = this.displayHourFields;
    const displayDays = this.displayDateFields;
    const displayTimezone = this.compiledDateformat.displayTimezone;
    if (displayHours && !displayDays && !displayTimezone) {
      return <Host><div><slot name="hourfields">{this.renderTimeFields()}</slot></div>{ this.renderNow() }</Host>
    }
    if (displayDays && !displayHours && !displayTimezone) {
      return <Host><div><slot name="datefields">{this.renderDateFields()}</slot></div>{ this.renderNow() }</Host>
    }
    if (displayTimezone && !displayDays && !displayHours) {
      return <Host><slot name="timezone"><div style={{display: 'flex'}}>{ this.renderField('timezone') }</div></slot></Host>
    }
    return <Host>
        <div>
          <div onClick={() => !this.disabled && this.toggleDatePicker()}>
            <slot name="input">{this.renderDateValue()}</slot>
          </div>
          { this.showDatePicker && <div style={{display: 'flex', flexDirection: 'column'}}>
              { displayHours && <slot name="hourfields">{this.renderTimeFields()}</slot>}
              { displayDays && <slot name="datefields">{ this.renderDateFields()}</slot> }
              { displayTimezone && <slot name="timezone"><div style={{display: 'flex'}}>
                { this.renderField('timezone') }
                </div></slot> }
              { this.renderNow() }
            </div>
          }
        </div>
      </Host>
    ;
  }
}
