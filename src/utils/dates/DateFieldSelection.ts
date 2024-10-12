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