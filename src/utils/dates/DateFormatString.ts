import { DateFieldSelection } from './DateFieldSelection';
import { DateFormatSection } from './DateFormatSection';
import { ParseState } from './ParseState';
import { PhpDate } from './PhpDate';
import { CharacterConstant } from './Segments/CharacterConstant';
import { DaySelection } from './Segments/DaySelection';
import { DayStringSelection } from './Segments/DayStringSelection';
import { TimezoneField } from './Segments/TimezoneField';
import { WeekYear } from './Segments/WeekYear';
import { defaultParseError, parseNumber, parsePrefixedNumber, parseString, warning } from './utils';

export class DateFormatString implements DateFieldSelection {
    private dateFormat: Array<DateFormatSection>
    private formats: Record<string, () => DateFormatSection> = {
        // AM or PM
        A: () => new DaySelection(
            'resolvedHours',
            false,
            (value) => value === null ? '--' : (value < 12 ? 'AM' : 'PM'),
            { displayHours: true },
            (state: ParseState) => {
                return parseString(
                    state,
                    ['AM', 'PM'],
                    null,
                    defaultParseError(state)
                )
            }
        ),
        // Swatch beat time (split day in exact 1000 beats), 000-999
        B: () => new DaySelection(
            'resolvedSwatchTime',
            false,
            null,
            { displayHours: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    3,
                    null,
                    defaultParseError(state)
                )
            }
        ),
        // day in the week Sun to Sat (always English)
        D: () => new DayStringSelection(
            'resolvedDayOfWeek',
            'Sun|Mon|Tue|Wed|Thu|Fri|Sat'.split('|'),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // month as English name: January - December
        F: () => new DayStringSelection(
            'resolvedMonth',
            '|January|February|March|April|May|June|July|August|September|October|November|December'.split('|'),
            { displayMonth: true }
        ),
        // hours 0-23
        G: () => new DaySelection(
            'resolvedHours',
            false,
            null,
            {
                displayHours: true
            },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    0,
                    23,
                    (v: string) => state.date.hours = v,
                    defaultParseError(state)
                )
            }
        ),
        // hours 00-23
        H: () => new DaySelection(
            'resolvedHours',
            true,
            null,
            {
                displayHours: true
            },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.hours = v,
                    defaultParseError(state)
                );
            },
        ),
        // is DST applied or not
        I: () => new DaySelection(
            'resolvedIsDst',
            false,
            null,
            {
                displayDate: true,
                displayMonth: true,
            },
            (state: ParseState) => {
                return parseString(
                    state,
                    ['0', '1'],
                    null, defaultParseError(state)
                );
            },
        ),
        // 1: is leap year, 0: is not leap year
        L: () => new DaySelection(
            'resolvedYear',
            false,
            (year) => ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? '1' : '0',
            {
                displayYear: true
            },
            (state: ParseState) => {
                return parseString(
                    state,
                    ['0', '1'],
                    null,
                    defaultParseError(state),
                );
            },
            9999
        ),
        // month as English name: Jan - Dec
        M: () => new DayStringSelection(
            'resolvedMonth',
            '|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|'),
            { displayMonth: true }
        ),
        // day in the week 1-7
        N: () => new DayStringSelection(
            'resolvedDayOfWeek',
            '1234567'.split(''),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // day suffix: th, rd, nd (always English)
        S: () => new DaySelection(
            'resolvedDaySuffix',
            false,
            (v) => v,
            { displayDate: true, displayYear: true, displayMonth: true },
            (state: ParseState) => {
                return parseString(
                    state,
                    ['th', 'rd', 'nd']
                );
            }
        ),
        // timezone abbreviation
        T: () => new TimezoneField("abbreviation"),
        // unix timestamp
        U: () => new DaySelection(
            'resolvedUnixTimestamp',
            false,
            null,
            {
                displayDate: true,
                displayMonth: true,
                displayYear: true,
                displayHours: true,
                displayMinutes: true,
                displaySeconds: true
            },
            (state: ParseState) => {
                const regex = /^[0-9]+/;
                const match = state.bytesToRead.match(regex);
                if (!match) {
                    defaultParseError(state)(['An integer'])
                    return state;
                }
                const number = Number(match[0]);
                state.bytesToRead = state.bytesToRead.substring(match[0].length);
                if (match[0] === String(number)) {
                    state.date = PhpDate.createFromLocalDate(new Date(Number(number)));
                } else {
                    defaultParseError(state)(['An integer'])
                }
                return state;
            
            }
        ),
        // week number of the year
        W: () => new DaySelection(
            'resolvedWeekNumber',
            false,
            null,
            { displayDate: true, displayYear: true, displayMonth: true },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    1,
                    54
                );
            }
        ),
        // year written as 4 digits
        Y: () => new DaySelection(
            'resolvedYear',
            false,
            null,
            { displayYear: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    4,
                    (v: string) => { state.date.year = v },
                    defaultParseError(state)
                )
            },
            9999
        ),
        // am or pm
        a: () => new DaySelection(
            'resolvedHours',
            false,
            (value) => value === null ? '--' : (value < 12 ? 'am' : 'pm'),
            { displayHours: true },
            (state: ParseState) => {
                return parseString(
                    state,
                    ['am', 'pm'],
                    null,
                    defaultParseError(state)
                )
            }
        ),
        // day of month: 01-31
        d: () => new DaySelection(
            'resolvedDate',
            true,
            null,
            { displayDate: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.date = v,
                    defaultParseError(state)
                )
            },
        ),
        // timezone id
        e: () => new TimezoneField('timezone_id'),
        // hours 1-12
        g: () => new DaySelection(
            'resolvedHours',
            false,
            (input) => {
                input %= 12;
                if (input === 0) {
                    return 12;
                }
                return input;
            },
            {
                displayHours: true
            },
            (state: ParseState) => {
                const hours = state.date.resolvedHours ?? 0;
                const amOrPm = hours - hours % 12;
                return parseNumber(
                    state,
                    1,
                    12,
                    (v: string) => state.date.hours = String(amOrPm + Number(v)),
                    defaultParseError(state)
                )
            }
        ),
        // hours 01-12
        h: () => new DaySelection(
            'resolvedHours',
            true,
            (input) => {
                input %= 12;
                if (input === 0) {
                    return 12;
                }
                return input;
            },
            {
                displayHours: true
            },
            (state: ParseState) => {
                const hours = state.date.resolvedHours ?? 0;
                const amOrPm = hours - hours % 12;
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.hours = String(amOrPm + Number(v)),
                    defaultParseError(state)
                )
            }
        ),
        // minutes 00-59
        i: () => new DaySelection(
            'resolvedMinutes',
            true,
            null,
            { displayMinutes: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.minutes = v,
                    defaultParseError(state)
                )
            }
        ),
        // day of month: 1-31
        j: () => new DaySelection(
            'resolvedDate',
            false,
            null,
            { displayDate: true },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    1,
                    31,
                    (v: string) => state.date.date = v,
                    defaultParseError(state)
                )
            }
        ),
        // day in the week Sunday to Saturday (always English)
        l: () => new DayStringSelection(
            'resolvedDayOfWeek',
            'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|'),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // month: 01-12
        m: () => new DaySelection(
            'resolvedMonth',
            true,
            null,
            { displayMonth: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.month = v,
                    defaultParseError(state)
                )
            }
        ),
        // month: 1-12
        n: () => new DaySelection(
            'resolvedMonth',
            false,
            null,
            { displayMonth: true },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    1,
                    12,
                    (v: string) => state.date.month = v,
                    defaultParseError(state)
                )
            }
        ),
        // year matches to the week of the date according ISO
        o: () => new WeekYear(),
        // seconds 00-59
        s: () => new DaySelection(
            'resolvedSeconds',
            true,
            null,
            { displaySeconds: true },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.seconds = v,
                    defaultParseError(state)
                )
            }
        ),
        // number of days in month: 28, 29, 30 or 31
        t: () => new DaySelection(
            'resolvedMaxDaysInMonth',
            false,
            null,
            { displayYear: true, displayMonth: true },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    28,
                    31
                );
            }
        ),
        // microseconds 000000-999000. Date has no microseconds, so we padd it with 3 zeroes
        u: () => new DaySelection(
            'resolvedMicroseconds',
            false,
            (input) => String(input).padStart(6, '0'),
            {
                displayMicroseconds: true
            },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    6,
                    (v: string) => state.date.microseconds = v,
                    defaultParseError(state)
                )
            },
            
        ),
        // milliseconds: 000-999
        v: () => new DaySelection(
            'resolvedMilliseconds',
            false,
            (input) => String(input).padStart(3, '0'),
            {
                displayMilliseconds: true
            },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    3,
                    (v: string) => state.date.milliseconds = v,
                    defaultParseError(state)
                )
            }
        ),
        // day in the week 0-6
        w: () => new DayStringSelection(
            'resolvedDayOfWeek',
            '0123456'.split(''),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // year written, but only the last 2 digits
        y: () => new DaySelection(
            'resolvedYear',
            true,
            (input) => { return String(input).substring(String(input).length - 2); },
            { displayYear: true },
            (state: ParseState) => {
                const year = state.date.resolvedYear

                const century = year === null ? 2000 : (year - year % 100);
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.year = String(century + Number(v)),
                    defaultParseError(state)
                )
            },
            9999
        ),
        // count day of the year january 1st = 0, january 2nd = 1, etc.
        z: () => new DaySelection(
            'resolvedDayOfYear',
            false,
            (v) => v,
            { displayDate: true, displayYear: true, displayMonth: true },
            (state: ParseState) => {
                return parseNumber(
                    state,
                    0,
                    365
                );
            },
            365
        )
        /*  
        
        // Timezone offset '+2000'
        O: () => new DaySelection(
            'timezoneOffset',
            false,
            (offset) => {
                const absOffsetHours = Math.floor(Math.abs(offset) / 60);
                const absOffsetMinutes = Math.abs(offset) % 60;
                const sign = offset <= 0 ? '+' : '-';

                const formattedOffset = sign +
                                        String(absOffsetHours).padStart(2, '0') +
                                        String(absOffsetMinutes).padStart(2, '0');

                return formattedOffset;
            },
            {
                displayTimezone: true
            }
        ),
        // Timezone offset '+20:00'
        P: () => new DaySelection(
            'timezoneOffset',
            false,
            (offset) => {
                const absOffsetHours = Math.floor(Math.abs(offset) / 60);
                const absOffsetMinutes = Math.abs(offset) % 60;
                const sign = offset <= 0 ? '+' : '-';

                const formattedOffset = sign +
                                        String(absOffsetHours).padStart(2, '0') +
                                        ':' + 
                                        String(absOffsetMinutes).padStart(2, '0');

                return formattedOffset;
            },
            {
                displayTimezone: true
            }
        ),
        // Timezone offset '+20:00' | 'Z'
        p: () => new DaySelection(
            'timezoneOffset',
            false,
            (offset) => {
                if (offset === 0) {
                    return 'Z';
                }
                const absOffsetHours = Math.floor(Math.abs(offset) / 60);
                const absOffsetMinutes = Math.abs(offset) % 60;
                const sign = offset <= 0 ? '+' : '-';

                const formattedOffset = sign +
                                        String(absOffsetHours).padStart(2, '0') +
                                        ':' + 
                                        String(absOffsetMinutes).padStart(2, '0');

                return formattedOffset;
            },
            {
                displayTimezone: true
            }
        ),
        // timezone offset in minutes
        Z: () => new DaySelection(
            'timezoneOffset',
            false,
            null,
            {
                displayTimezone: true
            }
        ),
        
        ,*/
    };
    constructor(dateFormatString: string)
    {
        let nextIsLiteral: boolean = false;
        this.dateFormat = [];
        for (let char of dateFormatString.split('')) {
            if (nextIsLiteral) {
                this.dateFormat.push(new CharacterConstant(char));
                nextIsLiteral = false;
                continue;
            }
            if (char === '\\') {
                nextIsLiteral = true;
                continue;
            }
            if (char === 'c') {
                this.appendRegex('Y-m-d\\TH:i:sP')
                continue;
            }
            if (char === 'r') {
                this.appendRegex('D, d M y H:i:s O');
                continue;
            }
            if (Object.hasOwnProperty.call(this.formats, char)) {
                this.dateFormat.push(this.formats[char]());
            } else {
                this.dateFormat.push(new CharacterConstant(char));
            }      
        }
    }

    public convertToString(date: PhpDate): string {
        return this.dateFormat.map((d: DateFormatSection) => d.render(date)).join('');
    }

    public createFromString(input: string, date: PhpDate = PhpDate.createFromLocalDate()): PhpDate {
        let state: ParseState = {
            bytesToRead: input,
            date,
        };
        this.dateFormat.forEach((d: DateFormatSection) => {
            state = d.parse(state)
        });
        if (state.bytesToRead !== '') {
            warning('Trailing data after parsing: ' + state.bytesToRead);
        }
        return state.date;
    }

    private appendRegex(regex: string): void
    {
        const child = new DateFormatString(regex);
        this.dateFormat.push(...child.dateFormat);
    }

    get displayHours(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayHours);
    }
    get displayMinutes(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayMinutes);
    }
    get displaySeconds(): boolean
    {
        return this.dateFormat.some((v: any) => v.displaySeconds);
    }
    get displayMilliseconds(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayMiliseconds);
    }
    get displayMicroseconds(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayMicroseconds);
    }
    get displayDate(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayDate);
    }
    get displayMonth(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayMonth);
    }
    get displayYear(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayYear);
    }
    get displayTimezone(): boolean
    {
        return this.dateFormat.some((v: any) => v.displayTimezone);
    }
}