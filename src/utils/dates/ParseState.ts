import { PhpDate } from "./PhpDate";

export interface ParseState {
    bytesToRead: string;
    date: PhpDate;
}