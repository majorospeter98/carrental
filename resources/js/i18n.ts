import { reactive } from "vue";
import { loadLang, saveLang, type Lang } from "./preferences";

const hu = {
  brand: "Autókölcsönző", from: "Átvétel", to: "Leadás", search: "Szabad autók", perDay: "/ nap",
  available: "Szabad", booked: "Foglalt", choose: "Lefoglalom", total: "Összesen",
  noResults: "Erre az időszakra nincs szabad autó.", noResultsHelp: "Próbálj rövidebb vagy későbbi időszakot.",
  name: "Név", email: "Email cím", address: "Lakcím", phone: "Telefonszám", book: "Foglalás elküldése",
  bookingTitle: "Foglalás", back: "Vissza", doneTitle: "Sikeres foglalás", doneText: "A foglalást rögzítettük.",
  newSearch: "Új keresés", admin: "Admin", home: "Vissza a főoldalra", username: "Felhasználónév", password: "Jelszó",
  login: "Bejelentkezés", loginTitle: "Bejelentkezés", loginError: "Hibás felhasználónév vagy jelszó.",
  demoHint: "Demó belépés: admin / admin12345", logout: "Kijelentkezés", bookings: "Foglalások", cars: "Autók",
  noBookings: "Nincsenek foglalások.", addCar: "Autó hozzáadása", editCar: "Autó szerkesztése", edit: "Szerkesztés",
  brandField: "Márka", model: "Modell", price: "Napi ár (Ft)", save: "Mentés", cancel: "Mégse",
  required: "Töltsd ki ezt a mezőt.", badEmail: "Adj meg érvényes email címet.", badPhone: "Csak számokat írj, legalább 7-et.",
  badFrom: "Az átvétel nem lehet a mai nap előtt.", badTo: "A leadás nem lehet az átvétel előtt.",
  badPrice: "1000 és 50 000 Ft közötti árat adj meg.", taken: "Ez az autó ebben az időszakban már foglalt.",
  tooLong: "Ez a szöveg túl hosszú.", tooMany: "Túl sok próbálkozás. Várj egy percet.",
  notFound: "Nem létező oldal", notFoundHelp: "Ez a cím nem vezet sehova.",
  demoTag: "Demó adat", clear: "Bejegyzések törlése", noPhoto: "Nincs fotó", pickDates: "Válassz időszakot", selected: "Kiválasztott napok",
  noCars: "Még nincs autó a flottában.", language: "Nyelv",
  clearConfirm: "Törlöd az összes foglalást? Minden autó újra szabad lesz.", clearYes: "Igen, törlöm",
  allRequired: "Minden mező kitöltése kötelező.", clash: "Kiválasztott, de foglalt",
  bookedDays: "Foglalt napok", noBookedDays: "Nincs foglalt nap.",
  description: "Autókölcsönző demó: válassz időszakot, nézd meg a szabad autókat és foglalj.",
  offline: "A szerver nem érhető el. Ellenőrizd a kapcsolatot, és próbáld újra.",
  serverError: "Hiba történt a szerveren. Próbáld újra.", close: "Bezárás",
  mainNav: "Főmenü", adminNav: "Admin menü", saved: "Mentve", stripCut: "A naptár utolsó látható napja:",
};

export type MessageKey = keyof typeof hu;

// typed against the Hungarian texts, so a missing translation does not compile
const en: Record<MessageKey, string> = {
  brand: "Car Rental", from: "Pick-up", to: "Return", search: "Show available cars", perDay: "/ day",
  available: "Available", booked: "Booked", choose: "Book this car", total: "Total",
  noResults: "No car is available for these dates.", noResultsHelp: "Try a shorter or later period.",
  name: "Name", email: "Email", address: "Home address", phone: "Phone", book: "Send booking",
  bookingTitle: "Booking", back: "Back", doneTitle: "Booking confirmed", doneText: "Your booking has been recorded.",
  newSearch: "New search", admin: "Admin", home: "Back to home", username: "Username", password: "Password",
  login: "Log in", loginTitle: "Login", loginError: "Wrong username or password.",
  demoHint: "Demo login: admin / admin12345", logout: "Log out", bookings: "Bookings", cars: "Cars",
  noBookings: "No bookings yet.", addCar: "Add car", editCar: "Edit car", edit: "Edit",
  brandField: "Make", model: "Model", price: "Price per day (Ft)", save: "Save", cancel: "Cancel",
  required: "Fill in this field.", badEmail: "Enter a valid email address.", badPhone: "Digits only, at least 7.",
  badFrom: "Pick-up cannot be before today.", badTo: "Return cannot be before pick-up.",
  badPrice: "Enter a price between 1,000 and 50,000 Ft.", taken: "This car is already booked for those dates.",
  tooLong: "This text is too long.", tooMany: "Too many attempts. Wait a minute.",
  notFound: "Page not found", notFoundHelp: "This address leads nowhere.",
  demoTag: "Demo data", clear: "Clear all bookings", noPhoto: "No photo", pickDates: "Choose your dates", selected: "Selected days",
  noCars: "There are no cars in the fleet yet.", language: "Language",
  clearConfirm: "Delete all bookings? Every car becomes available again.", clearYes: "Yes, delete",
  allRequired: "All fields are required.", clash: "Selected, but booked",
  bookedDays: "Booked days", noBookedDays: "No booked days.",
  description: "Car rental demo: pick your dates, see which cars are available and book.",
  offline: "Could not reach the server. Check your connection and try again.",
  serverError: "Something went wrong on the server. Try again.", close: "Close",
  mainNav: "Main menu", adminNav: "Admin menu", saved: "Saved", stripCut: "Calendar shown up to",
};

const messages: Record<Lang, Record<MessageKey, string>> = { hu, en };

export const locale = reactive({ lang: loadLang() });

export function setLang(lang: Lang) {
  locale.lang = lang;
  document.documentElement.lang = lang;
  saveLang(lang);
}

export const t = (key: MessageKey): string => messages[locale.lang][key] ?? key;

const intlLocale = () => (locale.lang === "hu" ? "hu-HU" : "en-GB");

export const money = (n: number) =>
  // "always" is newer than the ES2022 typings, which only know a boolean
  new Intl.NumberFormat(intlLocale(), { useGrouping: "always" } as object).format(n) + " Ft";

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) =>
  iso
    ? new Intl.DateTimeFormat(intlLocale(), { timeZone: "UTC", ...options }).format(new Date(iso))
    : "–";

/* with the year: for bookings, which may be months ahead */
export const fullDate = (iso: string) => formatDate(iso, { year: "numeric", month: "short", day: "numeric" });

export const foundLabel = (n: number) =>
  locale.lang === "hu" ? `${n} szabad autó erre az időszakra.` : `${n} ${n === 1 ? "car" : "cars"} available for these dates.`;

export const dayLabel = (n: number) =>
  locale.lang === "hu" ? `${n} nap` : `${n} ${n === 1 ? "day" : "days"}`;
