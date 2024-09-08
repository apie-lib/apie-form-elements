import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { APIE_FORM_CONTROLLER, ChangeEvent, Option } from '../../utils/utils';
import { renderTemplates } from '../../utils/renderTemplates';
import { DateFormatString } from '../../utils/DateFormatString';
import { PhpDate } from '../../utils/PhpDate';
import { Timezone, timezones } from '../../utils/timezones';

@Component({
  tag: 'apie-date',
  styleUrl: 'apie-date.css',
  shadow: true,
})
export class ApieDate {
  @Prop({reflect: true}) name: string;

  @Prop({reflect: true}) label: string | null = null;

  @Prop({reflect: true, mutable: true}) value: string | null = null;;

  @Prop({reflect: true, mutable: true}) internalState: {
    date: string,
    month: string,
    year: string,
    hours: string,
    minutes: string,
    seconds: string,
    microseconds: string,
    timezone: string,
  } = {
    date: '',
    month: '',
    year: '',
    hours: '',
    minutes: '',
    seconds: '',
    microseconds: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  @Prop({reflect: true }) dateFormat: string = '';

  @Prop({reflect: true, mutable: true}) types: string = '';

  @Prop({reflect: true}) apie: Symbol = APIE_FORM_CONTROLLER;

  @Event() triggerChange: EventEmitter<ChangeEvent>

  @Event() triggerInternalState: EventEmitter<ChangeEvent>

  @State() compiledDateFormat: DateFormatString;

  @State() openDatePicker: boolean = false;

  @State() date: PhpDate = new PhpDate('', '', '', '', '', '', '', null);

  @State() internalStateState!: string;

  private renderInput(name: keyof typeof this.internalState|'ms') {
    let value = this.internalState[name];
    if (name === 'ms' && value.length) {
      value = Math.floor(Number(value) / 1000);
    }

    return renderTemplates.renderSingleInput({
      name: this.name + '[' + name + ']',
      label: name,
      value,
      types: [name, 'text'],
      valueChanged: (newValue: string) => {
        this.date[name] = newValue;
        if (name === 'ms') {
          this.internalState.microseconds = newValue === '' ? '' : String(Number(newValue) * 1000)
        } else {
          this.internalState[name] = newValue;
        }
        this.checkInternalState();
        this.checkValue(false);
      }
    })
  }

  private renderTimezone() {
    let value = this.internalState.timezone;

    return renderTemplates.renderSelect({
      name: this.name + '[timezone]',
      label: 'timezone',
      value,
      options: timezones.map((value: Timezone): Option => {
        return {
          name: value.timezone_id,
          value: value.timezone_id
        }
      }),
      valueChanged: (newValue: string) => {
        const newValueLower = newValue.toLowerCase();
        this.date.timezone = timezones.find((value: Timezone) => value.timezone_id.toLowerCase() === newValueLower);
        this.internalState.timezone = newValue;
        this.checkInternalState();
        this.checkValue(false);
      }
    })
  }

  private renderValue()  {
    return renderTemplates.renderSingleInput({
      name: this.name,
      label: this.label,
      value: this.compiledDateFormat.convertToString(this.date),
      disabled: true,
      types: ['datetime_internal'],
      valueChanged: (newValue: string) => {
        this.value = newValue;
        this.checkValue();
      }
    })
  }

  @Watch('dateFormat') onDateFormatChange() {
    this.compiledDateFormat = new DateFormatString(this.dateFormat);
    Promise.resolve().then(() => this.checkValue());
  }

  @Watch('date') onValueChange() {
    Promise.resolve().then(() => this.checkValue(false));
  }

  public componentWillLoad()
  {
    this.compiledDateFormat = new DateFormatString(this.dateFormat ?? '');
    this.checkValue();
  }

  private checkInternalState(force: boolean = false) {
    const internalStateState: string = JSON.stringify(this.internalState);
    if (force || internalStateState !== this.internalStateState) {
      Promise.resolve().then(() => {
        this.internalStateState = internalStateState;
        this.internalState = { ...this.internalState };
        this.triggerInternalState.emit({ name: this.name, value: this.internalState, force });
      })
    }
  }

  private checkValue(readValue: boolean = true) {
    if (readValue) {
      try {
        this.compiledDateFormat.createFromString(this.value ?? '', this.date, this.internalState.timezone);
        this.internalState = {
          date: String(this.date.resolvedDate ?? ''),
          month: String(this.date.resolvedMonth ?? ''),
          year: String(this.date.resolvedYear ?? ''),
          hours: String(this.date.resolvedHours ?? ''),
          minutes: String(this.date.resolvedMinutes ?? ''),
          seconds: String(this.date.resolvedSeconds ?? ''),
          microseconds: String(this.date.resolvedMicroseconds ?? ''),
          timezone: String(this.date.timezone?.timezone_id ?? ''),
        }
        this.checkInternalState();
      } catch (err) {
        // TODO
      }
    }
    const newValue = this.date.isValid(this.compiledDateFormat) ? this.compiledDateFormat.convertToString(this.date) : null;
    if (newValue !== this.value) {
      this.value = newValue;
      this.triggerChange.emit({name: this.name, value: this.value});
    }
  }

  render() {
    return (
      <Host onBlur={() => this.openDatePicker = false}>
        <pre>{ JSON.stringify(this.date) }</pre>
        <div onClick={() => this.openDatePicker = !this.openDatePicker}>
          { this.renderValue() }
        </div>
        { this.openDatePicker && (<div>
          <div class="date-picker">
            {this.compiledDateFormat.displayDate && (
              this.renderInput('date')
            )}
            {this.compiledDateFormat.displayMonth && (
              this.renderInput('month')
            )}
            {this.compiledDateFormat.displayYear && (
              this.renderInput('year')
            )}
          </div>
          <div class="time-picker">
            {this.compiledDateFormat.displayHours && (
              this.renderInput('hours')
            )}
            {this.compiledDateFormat.displayMinutes && (
              this.renderInput('minutes')
            )}
            {this.compiledDateFormat.displaySeconds && (
              this.renderInput('seconds')
            )}
            {this.compiledDateFormat.displayMicroseconds && (
              this.renderInput('microseconds')
            )}
            {!this.compiledDateFormat.displayMicroseconds && this.compiledDateFormat.displayMilliseconds && (
              this.renderInput('ms')
            )}
          </div>
            {this.compiledDateFormat.displayTimezone && (
            <div class="timezone-picker">
              { this.renderTimezone() }
            </div>
          )}
      </div>)}
      </Host>
    );
  }
}
