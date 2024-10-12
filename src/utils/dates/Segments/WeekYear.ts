import { DateFieldSelection } from "../DateFieldSelection";
import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { PhpDate } from "../PhpDate";
import { defaultParseError, parseNumber } from "../utils";

export class WeekYear implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        const tempDate = date.toLocalDate()
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);

        return String(tempDate.getFullYear());
    }

    public parse(state: ParseState): ParseState
    {
        return parseNumber(
            state,
            1000,
            9999,
            null,
            defaultParseError(state),
        );
    }

    get displayHours(): boolean {
        return false;
    }
    get displayMinutes(): boolean {
        return false;
    }
    get displaySeconds(): boolean{
        return false;
    }
    get displayMilliseconds(): boolean{
        return false;
    }
    get displayMicroseconds(): boolean{
        return false;
    }
    get displayDate(): boolean{
        return true;
    }
    get displayMonth(): boolean{
        return true;
    }
    get displayYear(): boolean{
        return true;
    }
    get displayTimezone(): boolean{
        return false;
    }
}