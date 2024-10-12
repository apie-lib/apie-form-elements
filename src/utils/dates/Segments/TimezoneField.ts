import { Timezone, timezones } from "../../timezones";
import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { PhpDate } from "../PhpDate";
import { defaultParseError, parseString, toString } from "../utils";

/**
 * Date format 'e' => timezone id
 */
export class TimezoneField implements DateFormatSection {
    constructor(private fieldName: keyof Timezone) {
    }

    public render(p: PhpDate): string
    {
        if (p.resolvedTimezone && p.resolvedTimezone[this.fieldName]) {
            return toString(p.resolvedTimezone[this.fieldName]);
        }
        return '???';
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            timezones.map((t: Timezone) => toString(t[this.fieldName])),
            null,
            defaultParseError(state),
        )
    }
}
