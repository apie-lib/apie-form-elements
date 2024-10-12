import toRegexRange from 'to-regex-range';
import { ParseState } from "./ParseState";

export function warning(warning: any)
{
    throw new Error(warning);
    //console.warn(warning);
}

export const defaultParseError = (state: ParseState) => (options: Array<string>): any => {
    warning('I expect "' + options.join('", "') + '" but found "' + state.bytesToRead + '"');
}

export function parseString(
    parseState: ParseState,
    options: Array<string>,
    success: null|((string) => any) = null,
    failure: null|((expected: Array<string>) => any) = null
): ParseState {
    for (let option of options) {
        if (parseState.bytesToRead.startsWith(option)) {
            parseState.bytesToRead = parseState.bytesToRead.substring(option.length);
            success && success(option)
            return parseState;
        }
    }
    failure && failure(options);
    return parseState;
}

export function toString(value: boolean|string|File|null|number|undefined): string {
    if (value === true) {
      return 'on';
    }
    if (!value && value !== 0) {
      return '';
    }
    if (value instanceof File) {
      return value.name;
    }
    return String(value);
}

export function generateRegexForRange(minimum: number, maximum: number): RegExp
{
    return new RegExp('^' + toRegexRange(minimum, maximum) + '(\b|$)');
}

export function parseNumber(
    parseState: ParseState,
    minimum: number,
    maximum: number,
    success: null|((string) => any) = null,
    failure: null|((expected: Array<string>) => any) = null
): ParseState {
    const regex = generateRegexForRange(minimum, maximum);
    const match = parseState.bytesToRead.match(regex);
    if (!match) {
        failure && failure(['A number between ' + minimum + ' and ' + maximum]);
        return parseState;
    }
    const number = Number(match[0]);
    parseState.bytesToRead = parseState.bytesToRead.substring(match[0].length);
    if (match[0] === String(number)) {
        success && success(Number(number));
    } else {
        failure && failure(['A number']);
    }
    return parseState;
}

export function parsePrefixedNumber(
    parseState: ParseState,
    numberOfCharacters: number,
    success: null|((string) => any) = null,
    failure: null|((expected: Array<string>) => any) = null
): ParseState {
    const number = parseState.bytesToRead.substring(0, numberOfCharacters);
    parseState.bytesToRead = parseState.bytesToRead.substring(numberOfCharacters);
    const data = String(Number(number));
    if (number !== '' && Number(number) === Number(data)) {
        success && success(Number(number));
    } else {
        failure && failure(['A number']);
    }
    return parseState;
}