import Cookies from 'js-cookie';

/**
 * Ustawia ciasteczko.
 * @param {string} name - nazwa ciasteczka
 * @param {any} value - wartość (string, liczba, obiekt - obiekt zostanie zserializowany)
 * @param {number} days - liczba dni ważności (domyślnie 1)
 */
export function setCookie(name, value, days = 1) {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    Cookies.set(name, value, { expires: days, path: '/' });
}

/**
 * Pobiera wartość ciasteczka.
 * @param {string} name - nazwa ciasteczka
 * @param {boolean} parseJson - czy parsować JSON (domyślnie true)
 */
export function getCookie(name, parseJson = true) {
    const value = Cookies.get(name);
    if (!value) return null;
    if (parseJson) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    return value;
}

/**
 * Usuwa ciasteczko.
 * @param {string} name - nazwa ciasteczka
 */
export function removeCookie(name) {
    Cookies.remove(name, { path: '/' });
}
