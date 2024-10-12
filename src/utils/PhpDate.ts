import { Timezone, timezones } from "./timezones";

type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V? P: never]: any
}

export interface DateFieldSelection {
    get displayHours(): boolean;
    get displayMinutes(): boolean;
    get displaySeconds(): boolean;
    get displayMilliseconds(): boolean;
    get displayMicroseconds(): boolean;
    get displayDate(): boolean;
    get displayMonth(): boolean;
    get displayYear(): boolean;
    get displayTimezone(): boolean;
}

export function maxDay(year: number|null, month: number|null): number
{
    if (month === null) {
        return 31;
    }
    if (month === 2) {
        if (year === null || ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
            return 29;
        }
        return 28;
    }
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31;
    }
    return 30;
}

export function getUserTimezone(): Timezone|null {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
    return timezones.find((value: Timezone) => value.timezone_id.toLowerCase() === browserTimezone);
}

export class PhpDate {
    public timezone?: Timezone;

    private _date: number | null | undefined = undefined;
    private prevDate: string | undefined = undefined;
    private _month: number | null | undefined = undefined;
    private prevMonth: string | undefined = undefined;
    private _year: number | null | undefined = undefined;
    private prevYear: string | undefined = undefined;
    private _hours: number | null | undefined = undefined;
    private prevHours: string | undefined = undefined;
    private _minutes: number | null | undefined = undefined;
    private prevMinutes: string | undefined = undefined;
    private _seconds: number | null | undefined = undefined;
    private prevSeconds: string | undefined = undefined;
    private _microseconds: number | null | undefined = undefined;
    private prevMicroseconds: string | undefined = undefined;

    constructor(
        public date: string,
        public month: string,
        public year: string,
        public hours: string,
        public minutes: string,
        public seconds: string,
        public microseconds: string,
        timezone?: Timezone|string,
    ) {
        if (typeof timezone === 'string') {
            timezone = timezone.toLowerCase();
            this.timezone = timezones.find((value: Timezone) => value.timezone_id.toLowerCase() === timezone);
        } else {
            this.timezone = timezone;
        }
    }

    private resolveNumberValue(
        resolvedName: '_year'|'_month'|'_date'|'_hours'|'_minutes'|'_seconds' | '_microseconds' | '_date',
        prevName: 'prevDate'|'prevMonth'|'prevYear'|'prevHours'|'prevMinutes'|'prevSeconds'|'prevMicroseconds',
        currentName: KeyOfType<PhpDate, string>,
        minimum: number,
        maximum: number
    ): number | null {
        if (this[resolvedName] === undefined || this[prevName] !== this[currentName]) {
            const valueAsNumber = parseInt(String(this[currentName]), 10);
            if (valueAsNumber >= minimum && valueAsNumber <= maximum) {
                this[resolvedName as any] = valueAsNumber;
            } else {
                this[resolvedName as any] = null;
            }
        }
        return this[resolvedName];
    }

    public get resolvedYear(): number | null
    {
        return this.resolveNumberValue(
            '_year',
            'prevYear',
            'year',
            1000,
            9999
        );
    }

    public get resolvedMonth(): number | null
    {
        return this.resolveNumberValue(
            '_month',
            'prevMonth',
            'month',
            1,
            12
        );
    }

    public get resolvedDate(): number | null
    {
        let daysInMonth = maxDay(this.resolvedYear, this.resolvedMonth);
        return this.resolveNumberValue(
            '_date',
            'prevDate',
            'date',
            1,
            daysInMonth
        );
    }

    public get resolvedHours(): number | null
    {
        return this.resolveNumberValue(
            '_hours',
            'prevHours',
            'hours',
            0,
            23
        );
    }

    public get resolvedMinutes(): number | null
    {
        return this.resolveNumberValue(
            '_minutes',
            'prevMinutes',
            'minutes',
            0,
            59
        );
    }

    public get resolvedSeconds(): number | null
    {
        return this.resolveNumberValue(
            '_seconds',
            'prevSeconds',
            'seconds',
            0,
            59
        );
    }

    public get timezoneOffset(): string
    {
        if (this.timezone) {
            return String(this.timezone.offset);
        }  
        const offset = this.toDate().getTimezoneOffset();
        const absOffsetHours = Math.floor(Math.abs(offset) / 60);
        const absOffsetMinutes = Math.abs(offset) % 60;
        const sign = offset <= 0 ? '+' : '-';

        const formattedOffset = sign +
                                String(absOffsetHours).padStart(2, '0') +
                                String(absOffsetMinutes).padStart(2, '0');

        return formattedOffset;
        
    }

    public get resolvedMicroseconds(): number | null
    {
        return this.resolveNumberValue(
            '_microseconds',
            'prevMicroseconds',
            'microseconds',
            0,
            999999
        );
    }

    public toDate(): Date
    {
        const currentTime = new Date()
        const returnValue = new Date();
        returnValue.setFullYear(
            this.resolvedYear ?? currentTime.getFullYear(),
            (this.resolvedMonth ?? currentTime.getMonth()) - 1,
            this.resolvedDate ?? currentTime.getDate()
        );
        returnValue.setHours(
            this.resolvedHours ?? currentTime.getHours(),
            this.resolvedMinutes ?? currentTime.getMinutes(),
            this.resolvedSeconds ?? currentTime.getSeconds(),
            this.resolvedMicroseconds ? (this.resolvedMicroseconds / 1000) : 0
        );
        return returnValue;
    }

    public static createFromDate(d: Date = new Date()): PhpDate
    {
        return new PhpDate(
            String(d.getDate()),
            String(d.getMonth() + 1),
            String(d.getFullYear()),
            String(d.getHours()).padStart(2, '0'),
            String(d.getMinutes()).padStart(2, '0'),
            String(d.getSeconds()).padStart(2, '0'),
            String(d.getMilliseconds() * 1000).padStart(6, '0'),
            getUserTimezone(),
        )
    }

    public get dayOfWeek(): number | null
    {
        if (this.year && this.month && this.date) {
            const d = new Date(this.resolvedYear, this.resolvedMonth, this.resolvedDate);
            return d.getDay();
        }
        return null;
    }

    public get milliseconds(): string
    {
        const micro = this.resolvedMicroseconds;
        if (micro === null) {
            return '';
        }
        return String(Math.floor(micro / 1000)).padStart(3, '0');
    }

    public set milliseconds(val: string)
    {
        this.microseconds = val + '000';
    }

    public getValidFields(): Record<string, boolean>
    {
        let result: Record<string, boolean> = {};
        if (this.timezone) {
            result.timezone = true;
        }
        if (null !== this.resolvedMicroseconds) {
            result.microseconds = true;
            result.milliseconds = true;
        }
        if (null !== this.resolvedSeconds) {
            result.seconds = true;
        }
        if (null !== this.resolvedMinutes) {
            result.minutes = true;
        }
        if (null !== this.resolvedHours) {
            result.hours = true;
        }
        if (null !== this.resolvedYear) {
            result.year = true;
        }
        if (null !== this.resolvedMonth) {
            result.month = true;
        }
        if (null !== this.resolvedDate) {
            result.date = true;
        }
        return result;
    }

    public isValid(selection: DateFieldSelection): boolean
    {
        const validFields = this.getValidFields();
        return !['date', 'month', 'year', 'hours', 'minutes', 'seconds', 'microseconds', 'milliseconds'].some(
            (fieldName: string) => (
                selection['display' + fieldName[0].toUpperCase() + fieldName.substring(1)]
                && !validFields[fieldName]
            )
        )
    }
}
(window as any).PhpDate = PhpDate;