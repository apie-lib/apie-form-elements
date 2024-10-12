import { DateFieldSelection } from "../DateFieldSelection";
import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { PhpDate } from "../PhpDate";

export class DaySelection implements DateFormatSection, DateFieldSelection {
    constructor(
        private propertyName: keyof PhpDate,
        private prefixZero: boolean,
        private callback: null|((i: any) => string|number) = null,
        public displayFields: Partial<DateFieldSelection> = {},
        private parseCallback: null|((state: ParseState) => ParseState) = null,
        private maxValue = 99
    ) {
    }

    public render(d:PhpDate): string
    {
        let dayNumber = d[this.propertyName as any];
        if (null !== this.callback) {
            dayNumber = this.callback(dayNumber);
        }
        if (dayNumber === null || Number.isNaN(dayNumber) || dayNumber > this.maxValue) {
            return '-'.repeat(Math.log10(this.maxValue + 1));
        }
        if (this.prefixZero && dayNumber < 10) {
            return '0' + dayNumber;
        }
        return String(dayNumber);
    }

    public parse(state: ParseState): ParseState
    {
        if (!this.parseCallback) {
            return state;
        }
        return this.parseCallback(state);
    }

    get displayHours(): boolean {
        return this.displayFields.displayHours ?? false;
    }
    get displayMinutes(): boolean {
        return this.displayFields.displayMinutes ?? false;
    }
    get displaySeconds(): boolean{
        return this.displayFields.displaySeconds ?? false;
    }
    get displayMilliseconds(): boolean{
        return this.displayFields.displayMilliseconds ?? false;
    }
    get displayMicroseconds(): boolean{
        return this.displayFields.displayMicroseconds ?? false;
    }
    get displayDate(): boolean{
        return this.displayFields.displayDate ?? false;
    }
    get displayMonth(): boolean{
        return this.displayFields.displayMonth ?? false;
    }
    get displayYear(): boolean{
        return this.displayFields.displayYear ?? false;
    }
    get displayTimezone(): boolean{
        return this.displayFields.displayTimezone ?? false;
    }
}