import { OrderStatuses } from "../enums/OrderStatuses.ts";
import { PolishOrderStatuses } from "../enums/PolishOrderStatuses.ts";

export function getPolishStatus(status: string): string {
  switch (status) {
    case OrderStatuses.NEW:
      return PolishOrderStatuses.NOWE;
    case OrderStatuses.WAITING_FOR_PAYMENT:
      return PolishOrderStatuses.OCZEKIWANIE_NA_PLATNOSC;
    case OrderStatuses.WAITING_FOR_CONFIRMATION:
      return PolishOrderStatuses.OCZEKIWANIE_NA_POTWIERDZENIE;
    case OrderStatuses.IN_PROGRESS:
      return PolishOrderStatuses.W_TRAKCIE_REALIZACJI;
    case OrderStatuses.TO_BE_SHIPPED:
      return PolishOrderStatuses.DO_WYSYLKI;
    case OrderStatuses.SHIPPING:
      return PolishOrderStatuses.WYSYLKA;
    case OrderStatuses.DELIVERED:
      return PolishOrderStatuses.DOSTARCZONE;
    case OrderStatuses.DONE:
      return PolishOrderStatuses.ZAKONCZONE;
    default:
      return PolishOrderStatuses.NOWE;
  }
}
