import toRegexRange from 'to-regex-range';
import { DateFieldSelection, maxDay, PhpDate } from './PhpDate';
import { timezones, Timezone as TimezoneInfo } from './timezones';
interface ParseState {
    bytesToRead: string;
    date: PhpDate;
    timezone: string|null;
}



function parseString(
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

function getTimeZoneAbbreviations(): Array<string> {
    const date = new Date();
    const timeZones: Array<string> = (Intl as any).supportedValuesOf('timeZone');
    const abbreviations: Set<string> = new Set();

    timeZones.forEach(timeZone => {
        const options = { timeZone, timeZoneName: 'short' };
        const formatter = new (Intl as any).DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);
        const abbreviation = parts.find(part => part.type === 'timeZoneName')?.value;
        if (abbreviation) {
            if (/^GMT[\-+]\d{1,2}$/.test(abbreviation)) {
                abbreviations.add(abbreviation + ':00');
            } else {
                abbreviations.add(abbreviation);
            }
        }
    });
    const res = Array.from(abbreviations);
    res.sort((a, b) => a.length > b.length ? -1 : 1)
    return res;
}

function parsePrefixedNumber(
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

function generateRegexForRange(minimum: number, maximum: number): RegExp
{
    return new RegExp('^' + toRegexRange(minimum, maximum) + '(\b|$)');
}

function parseNumber(
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

interface DateFormatSection {
    render(d: PhpDate): string;
    parse(state: ParseState): ParseState;
}

function warning(warning: any)
{
    throw new Error(warning);
    //console.warn(warning);
}

const defaultParseError = (state: ParseState) => (options: Array<string>): any => {
    warning('I expect "' + options.join('", "') + '" but found "' + state.bytesToRead + '"');
}

class CharacterConstant implements DateFormatSection {
    constructor(private character: string)
    {
    }

    public render(): string
    {
        return this.character;
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            [this.character],
            null,
            defaultParseError(state),
        )
    }
}

class DaySelection implements DateFormatSection, DateFieldSelection {
    constructor(
        private propertyName: keyof PhpDate,
        private prefixZero: boolean,
        private callback: null|((i: any) => string|number) = null,
        public displayFields: Partial<DateFieldSelection> = {},
        private parseCallback: null|((state: ParseState) => ParseState) = null,
    ) {
    }

    public render(d:PhpDate): string
    {
        let dayNumber = d[this.propertyName as any];
        if (null !== this.callback) {
            dayNumber = this.callback(dayNumber);
        }
        if (dayNumber === null || Number.isNaN(dayNumber) || dayNumber > 99) {
            return '--';
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

class DayStringSelection implements DateFormatSection, DateFieldSelection {
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

class DaySuffix implements DateFormatSection, DateFieldSelection {
    public render(d: PhpDate): string
    {
        if (d.resolvedDate === null) {
            return '';
        }
        switch(d.resolvedDate) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        };
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            ['st', 'nd', 'rd', 'th'],
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
        return false;
    }
    get displayYear(): boolean{
        return false;
    }
    get displayTimezone(): boolean{
        return false;
    }
}

class DayOfTheYear implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        const startOfYear = new Date(Number(date.year), 0, 1);
        const diff = date.toDate().getTime() - startOfYear.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

        return String(dayOfYear);
    }
    public parse(state: ParseState): ParseState
    {
        return parseNumber(
            state,
            0,
            365,
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

class WeekNumber implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        const tempDate = new Date(date.toDate().getTime());
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
        const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() + 6) % 7);
        const weekNumber = Math.floor((tempDate.getTime() - firstThursday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    
        return String(weekNumber);
    }

    public parse(state: ParseState): ParseState
    {
        return parseNumber(
            state,
            1,
            53,
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

class NumberOfDaysInMonth implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        return String(maxDay(date.resolvedYear, date.resolvedMonth));
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            ['28', '29', '30', '31'],
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
        return false;
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

class IsAmOrPm implements DateFormatSection, DateFieldSelection {
    constructor(private readonly amText: string, private readonly pmText: string) {
    }
    public render(d: PhpDate): string
    {
        if (d.resolvedHours === null) {
            return '--';
        }
        return d.resolvedHours <= 12 ? this.amText : this.pmText;
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            [this.amText, this.pmText],
            null,
            defaultParseError(state),
        );
    }

    get displayHours(): boolean {
        return true;
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
        return false;
    }
    get displayMonth(): boolean{
        return false;
    }
    get displayYear(): boolean{
        return false;
    }
    get displayTimezone(): boolean{
        return false;
    }
}

class SwatchTime implements DateFormatSection, DateFieldSelection {
    public render(phpDate: PhpDate): string
    {
        const date = phpDate.toDate();
        // Convert the current date to UTC
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const utcSeconds = date.getUTCSeconds();

        // Calculate the total seconds since midnight UTC
        const totalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;

        // Adjust for BMT (UTC+1)
        const bmtSeconds = totalSeconds + 3600;

        // Calculate the Swatch .beats
        const swatchBeats = Math.floor((bmtSeconds / 86.4) % 1000);

        return String(swatchBeats);
    }

    public parse(state: ParseState): ParseState
    {
        return parseNumber(
            state,
            0,
            1000,
            null,
            defaultParseError(state),
        );
    }

    get displayHours(): boolean {
        return true;
    }
    get displayMinutes(): boolean {
        return true;
    }
    get displaySeconds(): boolean{
        return true;
    }
    get displayMilliseconds(): boolean{
        return false;
    }
    get displayMicroseconds(): boolean{
        return false;
    }
    get displayDate(): boolean{
        return false;
    }
    get displayMonth(): boolean{
        return false;
    }
    get displayYear(): boolean{
        return false;
    }
    get displayTimezone(): boolean{
        return false;
    }
}

class WeekYear implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        const tempDate = date.toDate()
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

class IsDst implements DateFormatSection {
    public render(phpDate: PhpDate): string
    {
        const date = phpDate.toDate();
        const jan = new Date(date.getFullYear(), 0, 1); // January 1st (likely non-DST)
        const jul = new Date(date.getFullYear(), 6, 1); // July 1st (likely DST)
    
        const standardTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

        // Compare current date's offset with the standard offset
        return date.getTimezoneOffset() < standardTimezoneOffset ? '1' : '0';
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            ['0', '1'],
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
        return false;
    }
    get displayTimezone(): boolean{
        return false;
    }
}

class TimezoneAbbreviation implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        // Use Intl.DateTimeFormat to get the timezone abbreviation
        const timezone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(date.toDate());
        
        // Extract the timeZoneName part
        const timeZoneName = timezone.find(part => part.type === 'timeZoneName')?.value;

        return timeZoneName ?? '';
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            getTimeZoneAbbreviations(),
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
        return false;
    }
    get displayMonth(): boolean{
        return false;
    }
    get displayYear(): boolean{
        return false;
    }
    get displayTimezone(): boolean{
        return true;
    }
}

class Timezone implements DateFormatSection, DateFieldSelection {
    public render(date: PhpDate): string
    {
        return date.timezone?.timezone_id ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    public parse(state: ParseState): ParseState
    {
        return parseString(
            state,
            timezones.map((t) => t.timezone_id),
            (value: string) => {
                const timezone = value.toLowerCase();
                state.date.timezone = timezones.find((value: TimezoneInfo) => value.timezone_id.toLowerCase() === timezone)
            },
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
        return false;
    }
    get displayMonth(): boolean{
        return false;
    }
    get displayYear(): boolean{
        return false;
    }
    get displayTimezone(): boolean{
        return true;
    }
}

export class DateFormatString implements DateFieldSelection {
    private dateFormat: Array<DateFormatSection>
    private formats: Record<string, () => DateFormatSection> = {
        // timezone: not part of javascript Date, get from Intl default, store separate
        e: () => new Timezone(),
        // day of month: 01-31
        d: () => new DaySelection(
            'date',
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
        // day of month: 1-31
        j: () => new DaySelection(
            'date',
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
        // day in the week Sun to Sat (always English)
        D: () => new DayStringSelection(
            'dayOfWeek',
            'Sun|Mon|Tue|Wed|Thu|Fri|Sat'.split('|'),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // day in the week Sunday to Saturday (always English)
        l: () => new DayStringSelection(
            'dayOfWeek',
            'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|'),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // day in the week 1-7
        N: () => new DayStringSelection(
            'dayOfWeek',
            '1234567'.split(''),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // day in the week 0-6
        w: () => new DayStringSelection(
            'dayOfWeek',
            '0123456'.split(''),
            { displayDate: true, displayYear: true, displayMonth: true }
        ),
        // day suffix: th, rd, nd (always English)
        S: () => new DaySuffix(),
        // count day of the year january 1st = 0, january 2nd = 1, etc.
        z: () => new DayOfTheYear(),
        // week number of the year
        W: () => new WeekNumber(),
        // month as English name: January - December
        F: () => new DayStringSelection(
            'month',
            '|January|February|March|April|May|June|July|August|September|October|November|December'.split('|'),
            { displayMonth: true }
        ),
        // month as English name: Jan - Dec
        M: () => new DayStringSelection(
            'month',
            '|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|'),
            { displayMonth: true }
        ),
        // month: 01-12
        m: () => new DaySelection(
            'month',
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
            'month',
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
        // number of days in month: 28, 29, 30 or 31
        t: () => new NumberOfDaysInMonth(),
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
            }
        ),
        // year matches to the week of the date according ISO
        o: () => new WeekYear(),
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
            }
        ),
        // year written, but only the last 2 digits
        y: () => new DaySelection(
            'resolvedYear',
            true,
            (input) => { return String(input).substring(String(input).length - 2); },
            { displayYear: true },
            (state: ParseState) => {
                const century = state.date.resolvedYear - state.date.resolvedYear % 100;
                return parsePrefixedNumber(
                    state,
                    2,
                    (v: string) => state.date.year = String(century + Number(v)),
                    defaultParseError(state)
                )
            }
        ),
        // am or pm
        a: () => new IsAmOrPm('am', 'pm'),
        // AM or PM
        A: () => new IsAmOrPm('AM', 'PM'),
        // Swatch beat time (split day in exact 1000 beats), 000-999
        B: () => new SwatchTime(),
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
                const amOrPm = state.date.resolvedHours - state.date.resolvedHours % 12;
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
                const amOrPm = state.date.resolvedHours - state.date.resolvedHours % 12;
                return parseNumber(
                    state,
                    1,
                    12,
                    (v: string) => state.date.hours = String(amOrPm + Number(v)),
                    defaultParseError(state)
                )
            }
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
                )
            },
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
        // microseconds 000000-999000. Date has no microseconds, so we padd it with 3 zeroes
        u: () => new DaySelection(
            'milliseconds',
            false,
            (input) => String(input * 1000).padStart(6, '0'),
            {
                displayMilliseconds: true
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
            'milliseconds',
            false,
            (input) => String(input).padStart(3, '0'),
            {
                displayMilliseconds: true
            },
            (state: ParseState) => {
                return parsePrefixedNumber(
                    state,
                    6,
                    (v: string) => state.date.milliseconds = v,
                    defaultParseError(state)
                )
            }
        ),
        // is DST applied or not
        I: () => new IsDst(),
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
        // unix timestamp
        U: () => new DaySelection(
            'timezoneOffset',
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
                    state.date = PhpDate.createFromDate(new Date(Number(number)));
                } else {
                    defaultParseError(state)(['An integer'])
                }
                return state;
            
            }
        ),
        // timezone abbreviation
        T: () => new TimezoneAbbreviation(),
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

    public createFromString(input: string, date: PhpDate = PhpDate.createFromDate(), timezone: string|null = null): PhpDate {
        let state: ParseState = {
            bytesToRead: input,
            date,
            timezone,
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