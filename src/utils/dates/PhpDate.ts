import { Timezone, timezones } from "../timezones";

type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V? P: never]: any
}

const fieldKeys = [
    'date', 
    'month',
    'year',
    'minutes',
    'seconds',
    'microseconds',
    'timezone',
    'milliseconds',
]

export class PhpDate {
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
    private _timezone: Timezone | null | undefined = undefined;
    private prevTimezone: string | undefined = undefined;

    constructor(
        public date: string,
        public month: string,
        public year: string,
        public hours: string,
        public minutes: string,
        public seconds: string,
        public microseconds: string,
        public timezone?: string,
    ) {
    }

    public clone(): PhpDate {
        const cloned = new PhpDate(
            this.date,
            this.month,
            this.year,
            this.hours,
            this.minutes,
            this.seconds,
            this.microseconds,
            this.timezone
        );
        
        // Copy over private fields
        cloned._date = this._date;
        cloned.prevDate = this.prevDate;
        cloned._month = this._month;
        cloned.prevMonth = this.prevMonth;
        cloned._year = this._year;
        cloned.prevYear = this.prevYear;
        cloned._hours = this._hours;
        cloned.prevHours = this.prevHours;
        cloned._minutes = this._minutes;
        cloned.prevMinutes = this.prevMinutes;
        cloned._seconds = this._seconds;
        cloned.prevSeconds = this.prevSeconds;
        cloned._microseconds = this._microseconds;
        cloned.prevMicroseconds = this.prevMicroseconds;
        cloned._timezone = this._timezone;
        cloned.prevTimezone = this.prevTimezone;
        
        return cloned;
    }

    public static createFromLocalDate(d: Date = new Date()): PhpDate
    {
        return new PhpDate(
            String(d.getDate()),
            String(d.getMonth() + 1),
            String(d.getFullYear()),
            String(d.getHours()).padStart(2, '0'),
            String(d.getMinutes()).padStart(2, '0'),
            String(d.getSeconds()).padStart(2, '0'),
            String(d.getMilliseconds() * 1000).padStart(6, '0'),
            Intl.DateTimeFormat().resolvedOptions().timeZone
        )
    }

    public static createFromUTCDate(d: Date = new Date()): PhpDate
    {
        return new PhpDate(
            String(d.getUTCDate()),
            String(d.getUTCMonth() + 1),
            String(d.getUTCFullYear()),
            String(d.getUTCHours()).padStart(2, '0'),
            String(d.getUTCMinutes()).padStart(2, '0'),
            String(d.getUTCSeconds()).padStart(2, '0'),
            String(d.getUTCMilliseconds() * 1000).padStart(6, '0'),
            'UTC'
        )
    }

    public static createFromJson(input: Partial<Record<typeof fieldKeys[0], any>>): PhpDate {
        return new PhpDate(
            input.date ?? '',
            input.month ?? '',
            input.year ?? '',
            input.hours ?? '',
            input.minutes ?? '',
            input.seconds ?? '',
            input.microseconds ?? (input.milliseconds * 1000) ?? '',
            input.timezone ?? undefined
        );
    }

    public toJSON(): Partial<Record<typeof fieldKeys[0], any>> {
        const res: Partial<Record<typeof fieldKeys[0], any>> = {
        };
        for (let key of fieldKeys) {
            const value = this[key];
            if (value !== undefined) {
                res[key] = value;
            }
        }
        return res;
    }

    private resolveNumberValue(
        resolvedName: '_year'|'_month'|'_date'|'_hours'|'_minutes'|'_seconds' | '_microseconds',
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
            this[prevName] = this[currentName];
        }
        return this[resolvedName] as number | null;
    }

    public get resolvedTimezone(): Timezone | null
    {
        if (this._timezone === undefined || this.prevTimezone !== this.timezone) {
            const timezone = this.timezone?.toLowerCase();
            if (timezone === null) {
                return null;
            }
            this._timezone = timezones.find((value: Timezone) => value.timezone_id.toLowerCase() === timezone);
            this.prevTimezone = this.timezone;
        }
        return this._timezone as Timezone | null;
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

    public get resolvedWeekYear(): number | null
    {
        const tempDate = this.toLocalDate();
        if (isNaN(tempDate.getTime())) {
            return null;
        }
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);

        return tempDate.getFullYear();
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

    public get resolvedMaxDaysInMonth(): number
    {
        const month = this.resolvedMonth;
        const year = this.resolvedYear;
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

    public get resolvedDate(): number | null
    {
        let daysInMonth = this.resolvedMaxDaysInMonth;
        return this.resolveNumberValue(
            '_date',
            'prevDate',
            'date',
            1,
            daysInMonth
        );
    }

    public get resolvedDayOfWeek(): number | null
    {
        if (this.resolvedYear && this.resolvedMonth, this.resolvedDate) {
            const d = new Date(
                this.resolvedYear as number,
                this.resolvedMonth as number,
                this.resolvedDate as number
            );
            return d.getDay();
        }
        return null;
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
        this.microseconds = val.length ? (val + '000') : '';
    }

    public get resolvedMilliseconds(): number | null
    {
        const micro = this.resolvedMicroseconds;
        if (micro === null) {
            return null;
        }

        return Math.floor(micro / 1000)
    }

    public get resolvedDaySuffix(): 'st' | 'nd' | 'rd' | 'th' | null
    {
        if (this.resolvedDate === null) {
            return null;
        }
        switch(this.resolvedDate) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        };
    }

    public get resolvedDayOfYear(): number | null
    {
        const year = this.resolvedYear;
        if (year === null) {
            return null;
        }
        const startOfYear = new Date(Number(year), 0, 1);
        const diff = this.toLocalDate().getTime() - startOfYear.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

        return dayOfYear;
    }

    public get resolvedWeekNumber(): number | null
    {
        const tempDate = new Date(this.toLocalDate(new Date('unknown')).getTime());
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
        if (isNaN(tempDate.getTime())) {
            return null;
        }
        const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() + 6) % 7);
        const weekNumber = Math.floor((tempDate.getTime() - firstThursday.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;
    
        return weekNumber;
    }

    public get resolvedSwatchTime(): number | null
    {
        const date = this.toUtcDate();
        if (isNaN(date.getTime())) {
            return null;
        }
        // Convert the current date to UTC
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const utcSeconds = date.getUTCSeconds();

        // Calculate the total seconds since midnight UTC
        const totalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;

        // Adjust for BMT (UTC+1)
        const bmtSeconds = totalSeconds + 3600;

        // Calculate the Swatch beats
        const swatchBeats = Math.floor((bmtSeconds / 86.4) % 1000);

        return swatchBeats;
    }

    public get resolvedIsDst(): boolean
    {
        if (this.resolvedTimezone && !this.resolvedTimezone.dst) {
            return false;
        }
        const date = this.toLocalDate();
        const jan = new Date(date.getFullYear(), 0, 1); // January 1st (likely non-DST)
        const jul = new Date(date.getFullYear(), 6, 1); // July 1st (likely DST)
    
        const standardTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

        // Compare current date's offset with the standard offset
        return date.getTimezoneOffset() < standardTimezoneOffset;
    }

    public get resolvedUnixTimestamp(): number | null
    {
        const date = this.toLocalDate();
        const time = date.getTime();
        return isNaN(time) ? null : time;
    }

    public toLocalDate(currentTime: Date = new Date()): Date
    {
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

    public toUtcDate(currentTime: Date = new Date()): Date
    {
        const returnValue = new Date();
        returnValue.setFullYear(
            this.resolvedYear ?? currentTime.getFullYear(),
            (this.resolvedMonth ?? currentTime.getMonth()) - 1,
            this.resolvedDate ?? currentTime.getDate()
        );
        returnValue.setUTCHours(
            this.resolvedHours ?? currentTime.getHours(),
            this.resolvedMinutes ?? currentTime.getMinutes(),
            this.resolvedSeconds ?? currentTime.getSeconds(),
            this.resolvedMicroseconds ? (this.resolvedMicroseconds / 1000) : 0
        );
        const timezone = this.resolvedTimezone;
        if (timezone) {
            returnValue.setSeconds(returnValue.getSeconds() + timezone.offset);
        }
        return returnValue;
    }
}