import { ParseState } from "./ParseState";
import { PhpDate } from "./PhpDate";

export interface DateFormatSection {
    render(d: PhpDate): string;
    parse(state: ParseState): ParseState;
}