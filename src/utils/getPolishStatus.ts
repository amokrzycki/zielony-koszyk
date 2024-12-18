import { OrderStatuses } from "../enums/OrderStatuses.ts";

export function getPolishStatus(status: OrderStatuses): string {
  switch (status) {
    case OrderStatuses.NEW:
      return "Nowe";
    case OrderStatuses.WAITING_FOR_PAYMENT:
      return "Oczekiwanie na płatność";
    case OrderStatuses.WAITING_FOR_CONFIRMATION:
      return "Oczekiwanie na potwierdzenie";
    case OrderStatuses.IN_PROGRESS:
      return "W trakcie realizacji";
    case OrderStatuses.TO_BE_SHIPPED:
      return "Do wysyłki";
    case OrderStatuses.SHIPPING:
      return "Wysyłka";
    case OrderStatuses.DELIVERED:
      return "Dostarczone";
    case OrderStatuses.DONE:
      return "Zakończone";
    default:
      return "Nieznany status";
  }
}
