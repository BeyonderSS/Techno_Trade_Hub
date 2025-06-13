// utils/timezoneHelper.js
import moment from 'moment-timezone';

/**
 * Gets the start and end Date objects for the current day in 'Asia/Kolkata' timezone.
 * @returns {{start: Date, end: Date}}
 */
export const getISTTodayRange = () => {
    const startOfTodayIST = moment().tz('Asia/Kolkata').startOf('day');
    const endOfTodayIST = moment().tz('Asia/Kolkata').endOf('day');
    return {
        start: startOfTodayIST.toDate(),
        end: endOfTodayIST.toDate()
    };
};