import { DateFormatSection } from "../DateFormatSection";
import { ParseState } from "../ParseState";
import { defaultParseError, parseString } from "../utils";

/**
 * Date format constant string
 */
export class CharacterConstant implements DateFormatSection {
    constructor(private character: string) {
    }

    public render(): string {
        return this.character;
    }

    public parse(state: ParseState): ParseState {
        return parseString(
            state,
            [this.character],
            null,
            defaultParseError(state),
        )
    }
}
