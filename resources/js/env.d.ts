/// <reference types="vite/client" />
import type { MessageKey } from "./i18n";

declare module "@inertiajs/core" {
  export interface InertiaConfig {
    errorValueType: MessageKey;
  }
}
