// localStorage 저장 — 실패하거나 데이터가 손상돼도 앱이 계속 동작한다.
import { STORAGE_KEY, defaultState, parseStoredState } from './logic.js';

let storageOk = true;
let recoveredFromCorrupt = false;

export function loadState() {
  let text = null;
  try {
    text = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    storageOk = false;
    return defaultState();
  }
  const { state, recovered } = parseStoredState(text);
  if (recovered) {
    recoveredFromCorrupt = true;
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* 무시 */ }
  }
  return state;
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageOk = true;
  } catch {
    storageOk = false;
  }
  return storageOk;
}

export function clearState() {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* 무시 */ }
  return defaultState();
}

export function storageStatus() {
  return { ok: storageOk, recovered: recoveredFromCorrupt };
}
