import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { PhpDate } from '../../utils/dates/PhpDate';
import { DateFormatString } from '../../utils/dates/DateFormatString';
import { Timezone, timezones } from '../../utils/timezones';

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

  private update(key: 'hours'|'minutes'|'seconds'|'milliseconds'|'microseconds'|'date'|'month'|'year'|'timezone', value: any) {
    this.internalDate[key] = value;
    this.internalDate = this.internalDate.clone();
    this.checkValue();
  }

  public updateToCurrentTime(): void {
    this.internalDate = PhpDate.createFromLocalDate(); // todo correct timezone?
    this.checkValue();
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

  render() {
    return (
      <Host>
        <div>
          <div onClick={() => !this.disabled && this.toggleDatePicker()}>
            <slot name="input"><input disabled={this.disabled} name={this.name} value={this.compiledDateformat.convertToString(this.internalDate)} readonly/></slot>
          </div>
          { this.showDatePicker && <div>
              { this.displayHourFields && <slot name="hourfields"><div>
                { this.compiledDateformat.displayHours && <slot name="hours"><input placeholder="HH" value={this.internalDate.hours} onChange={(ev) => this.update('hours', (ev.target as HTMLInputElement).value)}/></slot> }
                { this.compiledDateformat.displayMinutes && <slot name="minutes"><input placeholder="MM" value={this.internalDate.minutes} onChange={(ev) => this.update('minutes', (ev.target as HTMLInputElement).value)}/></slot> }
                { this.compiledDateformat.displaySeconds && <slot name="seconds"><input placeholder="SS" value={this.internalDate.seconds} onChange={(ev) => this.update('seconds', (ev.target as HTMLInputElement).value)}/></slot> }
                { this.compiledDateformat.displayMilliseconds && !this.compiledDateformat.displayMicroseconds && <slot name="milliseconds"><input placeholder="ms" value={this.internalDate.milliseconds} onChange={(ev) => this.update('milliseconds', (ev.target as HTMLInputElement).value)}/></slot> }
                { this.compiledDateformat.displayMicroseconds && <slot name="microseconds"><input placeholder="microseconds" value={this.internalDate.microseconds} onChange={(ev) => this.update('microseconds', (ev.target as HTMLInputElement).value)}/></slot> }
              </div></slot> }
              { this.displayDateFields && <slot name="datefields"><div>
              { this.compiledDateformat.displayDate && <slot name="date"><input placeholder="DD" value={this.internalDate.date} onChange={(ev) => this.update('date', (ev.target as HTMLInputElement).value)}/></slot> }
              { this.compiledDateformat.displayMonth && <slot name="month"><input placeholder="MM" value={this.internalDate.month} onChange={(ev) => this.update('month', (ev.target as HTMLInputElement).value)}/></slot> }
              { this.compiledDateformat.displayYear && <slot name="year"><input placeholder="YY" value={this.internalDate.year} onChange={(ev) => this.update('year', (ev.target as HTMLInputElement).value)}/></slot> }
              </div></slot> }
              { this.compiledDateformat.displayTimezone && <slot name="timezone"><select onChange={(ev) => this.update('timezone', (ev.target as HTMLInputElement).value)}>
                <option selected={this.internalDate.timezone === null}>--</option>
                { timezones.map(
                  (timezone: Timezone) => {
                    return <option selected={timezone.timezone_id === this.internalDate.timezone}>{timezone.timezone_id}</option>
                  })
                }
                </select></slot> }
              <slot name="now"><button type="button" onClick={() => this.updateToCurrentTime()}>NOW</button></slot>
            </div>}
        </div>
      </Host>
    );
  }
}
