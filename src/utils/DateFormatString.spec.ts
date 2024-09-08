import { DateFormatString } from './DateFormatString';
import { PhpDate } from './PhpDate';
import { Timezone, timezones } from './timezones';

describe('DateFormatString', function () {
    return;
    const testcases = ['', ...('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:'.split(''))];
//    const testcases = ['y']
    const mapping = {
        displayHours: 'hours',
        displayMinutes: 'minutes',
        displaySeconds: 'seconds',
        displayMilliseconds: 'milliseconds',
        displayDate: 'date',
        displayMonth: 'month',
        displayYear: 'resolvedYear',
    };
    timezones.forEach((timezone: Timezone) => {
        describe('It works with timezone "' + timezone.timezone_id + '".', () => {
            testcases.forEach((format) => {
                describe('It encodes "' + format + '" perfectly.', () => {
                    const testItem = new DateFormatString(format);
                    const date = PhpDate.createFromDate(new Date);
                    date.timezone = timezone;
                    const actual = testItem.convertToString(date);
                    it('it parses "' + actual + '" perfectly', () => {
                        const expected = testItem.createFromString(actual, date);
                        //todo displayMicroseconds, displayTimezone
                        Object.entries(mapping).forEach((entry: [string, string]) => {
                            if (testItem[entry[0]]) {
                                expect(date[entry[1]]()).toEqual(expected[entry[1]]())
                            }
                        });
                    });
                });
            });
        });
    })
});