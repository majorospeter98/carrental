/* The shapes the Laravel controllers send as page props. */
import type { MessageKey } from "./i18n";

/* "YYYY-MM-DD", both days included */
export interface Period {
  from: string;
  to: string;
}

/* Car::toPublic() */
export interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  image: string;
  bookings: Period[];
  /* sent to the admin's car list only */
  deletable?: boolean;
}

/* the booking just made, on the confirmation page */
export interface Receipt extends Period {
  days: number;
  price: number;
}

/* a row of the admin's booking list */
export interface Rent extends Receipt {
  id: number;
  name: string;
  email: string;
  phone: string;
  /* only bookings made while the form still asked for it */
  address: string | null;
  car: string;
}

/* validation errors are message keys, translated in the browser */
export type FieldErrors = Partial<Record<string, MessageKey>>;
