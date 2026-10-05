# Zielony Koszyk - sklep internetowy

### Praca inżynierska na kierunku Informatyka na Wydziale Informatyki Wyższej Szkoły Informatyki i Zarządzania w Rzeszowie.

Witamy w **Zielony Koszyk**! To aplikacja umożliwiająca zakup świeżych warzyw online bez wychodzenia z domu.

## Funkcjonalności

- **Przegląd produktów**: Przeglądaj szeroki asortyment świeżych warzyw.
- **Koszyk**: Dodawaj produkty do koszyka i zarządzaj nimi przed zakupem.
- **Bezpieczne płatności**: Dokonuj płatności online za pomocą zaufanych metod.
- **Rejestracja i logowanie**: Twórz konto, aby śledzić swoje zamówienia i historię zakupów.
- **Powiadomienia**: Otrzymuj aktualizacje o nowych produktach i promocjach.

## Technologie

- **Frontend**: React + TypeScript
- **Backend**: NestJS + TypeScript
- **Baza danych**: PostgreSQL

## Wymagania

- **Node.js**: 26
- **npm**: wersja dostarczona z Node.js 26

## Instalacja

1. Sklonuj repozytorium: `git@github.com:amokrzycki/zielony-koszyk-frontend.git`
2. Przejdź do katalogu: `cd zielony-koszyk-frontend`
3. Skopiuj `.env.example` do `.env`.
4. Zainstaluj zależności: `npm ci`
5. Uruchom aplikację: `npm run dev`
6. Sklonuj repozytorium z backendem: `git@github.com:amokrzycki/zielony-koszyk-backend.git`
7. Przejdź do katalogu: `cd zielony-koszyk-backend`
8. Skonfiguruj i uruchom backend zgodnie z jego `README.md`.
9. Backend będzie dostępny pod adresem: `http://localhost:3000`.
10. Frontend będzie dostępny pod adresem: `http://localhost:5173`.

## Wersje językowe (PL / EN)

- **Biblioteki**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`. Tłumaczenia (`src/i18n/locales/{pl,en}/*.json`) są wbudowane w bundle; klucze są typowane na podstawie plików `pl`.
- **Kolejność wyboru języka**: język w adresie URL → wcześniej jawnie wybrany język (`localStorage.preferredLocale`) → język przeglądarki → polski. Sam język z URL ani z przeglądarki nigdy nie zapisuje się jako jawny wybór.
- **Adresy**: `/pl/produkty/15`, `/en/products/15`. Wszystkie ścieżki są zdefiniowane w jednym miejscu (`src/i18n/routes.ts`); w komponentach używamy `useLocalePath()` / `pathFor()`. Adresy bez prefiksu (np. `/`, stare zakładki `/produkty/15`) są przekierowywane (`replace`) na preferowany język z zachowaniem trasy, parametrów, query i hasha.
- **Formatowanie**: `useFormat()` (natywne `Intl`; waluta zawsze PLN).
- **API**: język jest wysyłany w nagłówku `Accept-Language`; zapytania zwracające zlokalizowane dane (`products`) mają `locale` w argumentach, więc jest on częścią klucza cache RTK Query.
- **Ograniczenie (SPA)**: aplikacja nie ma SSR, więc `hreflang`/kanoniczne adresy językowe dla robotów wymagałyby prerenderowania i nie są częścią tej zmiany. Aktualizowane są `<html lang>` i `document.title`.
