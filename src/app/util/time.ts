
/**
 * Formats ms "7874343554" in "07 Dec 2024, 08:54".
 * @param ms The dateTime in ms. Is parsed to a number internaly.
 * 
 */
export function formatDateTime(ms: string | number): string {
    const dateTime = new Date(Number(ms));
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const formattedDateTime = formatter.format(dateTime);
    return formattedDateTime; //  07 Dec 2024, 10:16
}

/**
 * Formats ms "7874343554" in "07 Dec 2024".
 * @param ms The dateTime in ms. Is parsed to a number internaly.
 * 
 */
export function formatDate(ms: string | number): string {
    const date = new Date(Number(ms));
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedDate = formatter.format(date);
    return formattedDate; //  07 Dec 2024
}