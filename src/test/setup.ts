import "@testing-library/jest-dom";
import { beforeEach, afterEach } from "vitest";

// Network Guard: ensure tests never perform real outbound network requests
export const unmockedFetchGuard: typeof globalThis.fetch = (
  input: RequestInfo | URL,
  _init?: RequestInit,
): Promise<Response> => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : (input as Request).url;
  throw new Error(`Unmocked network call in test: ${url}`);
};

globalThis.fetch = unmockedFetchGuard;

beforeEach(() => {
  globalThis.fetch = unmockedFetchGuard;
});

afterEach(() => {
  globalThis.fetch = unmockedFetchGuard;
});
