import { PolishOrderStatuses } from "../enums/PolishOrderStatuses.ts";
import { OrderStatuses } from "../enums/OrderStatuses.ts";

export function getEnglishStatus(status: PolishOrderStatuses): string {
  switch (status) {
    case PolishOrderStatuses.NOWE:
      return OrderStatuses.NEW;
    case PolishOrderStatuses.OCZEKIWANIE_NA_PLATNOSC:
      return OrderStatuses.WAITING_FOR_PAYMENT;
    case PolishOrderStatuses.OCZEKIWANIE_NA_POTWIERDZENIE:
      return OrderStatuses.WAITING_FOR_CONFIRMATION;
    case PolishOrderStatuses.W_TRAKCIE_REALIZACJI:
      return OrderStatuses.IN_PROGRESS;
    case PolishOrderStatuses.DO_WYSYLKI:
      return OrderStatuses.TO_BE_SHIPPED;
    case PolishOrderStatuses.WYSYLKA:
      return OrderStatuses.SHIPPING;
    case PolishOrderStatuses.DOSTARCZONE:
      return OrderStatuses.DELIVERED;
    case PolishOrderStatuses.ZAKONCZONE:
      return OrderStatuses.DONE;
    default:
      return OrderStatuses.NEW;
  }
}
