// Newer Node versions ship an experimental global `localStorage` that shadows happy-dom's and is unusable without
// `--localstorage-file`. Give DOM tests a plain in-memory Storage so persistence code runs for real.
if (typeof window !== "undefined" && !window.localStorage) {
  const data = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
}
