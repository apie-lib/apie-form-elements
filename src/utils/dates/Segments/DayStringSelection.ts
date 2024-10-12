import { DateFieldSelection } from "../DateFieldSelection";
import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { PhpDate } from "../PhpDate";
import { defaultParseError, parseString } from "../utils";

export class DayStringSelection implements DateFormatSection, DateFieldSelection {
    constructor(
        private propertyName: keyof PhpDate,
        private names: Array<string>,
        public displayFields: Partial<DateFieldSelection> = {},
    ) {
    }

    public render(d:PhpDate): string
    {
        const propertyValue = d[this.propertyName as any];
        if (propertyValue === null) {
            return '--';
        }
        return this.names[propertyValue]
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            this.names,
            null,
            defaultParseError(state),
        )
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