import { Timezone, timezones } from "../../timezones";
import { DateFieldSelection } from "../DateFieldSelection";
import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { PhpDate } from "../PhpDate";
import { defaultParseError, parseString, toString, sortLength } from "../utils";

/**
 * Date format 'e' => timezone id
 */
export class TimezoneField implements DateFormatSection, DateFieldSelection {
    constructor(
        private fieldName: keyof Timezone,
        private conversion: (value: any) => any = function (value) { return value; }
    ) {
    }

    public render(p: PhpDate): string
    {
        if (p.resolvedTimezone) {
            return toString(this.conversion(p.resolvedTimezone[this.fieldName]));
        }
        return '???';
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            sortLength(timezones.map((t: Timezone) => toString(this.conversion(t[this.fieldName])))),
            null,
            defaultParseError(state),
        )
    }

    public get displayTimezone(): boolean
    {
        return true;
    }

    get displayHours(): boolean
    {
        return false;
    }
    get displayMinutes(): boolean
    {
        return false;
    }
    get displaySeconds(): boolean
    {
        return false;
    }
    get displayMilliseconds(): boolean
    {
        return false;
    }
    get displayMicroseconds(): boolean
    {
        return false;
    }
    get displayDate(): boolean
    {
        return false;
    }
    get displayMonth(): boolean
    {
        return false;
    }
    get displayYear(): boolean
    {
        return false;
    }
}
