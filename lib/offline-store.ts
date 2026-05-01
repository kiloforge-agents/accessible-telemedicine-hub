'use client';

import { Appointment } from './data';

const DB_NAME = 'careconnect-db';
const DB_VERSION = 1;
const APPOINTMENTS_STORE = 'appointments';
const PROVIDERS_CACHE = 'providers-cache';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(APPOINTMENTS_STORE)) {
        db.createObjectStore(APPOINTMENTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PROVIDERS_CACHE)) {
        db.createObjectStore(PROVIDERS_CACHE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(APPOINTMENTS_STORE, 'readwrite');
    tx.objectStore(APPOINTMENTS_STORE).put(appointment);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
    const idx = stored.findIndex((a: Appointment) => a.id === appointment.id);
    if (idx >= 0) stored[idx] = appointment;
    else stored.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(stored));
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(APPOINTMENTS_STORE, 'readonly');
    const store = tx.objectStore(APPOINTMENTS_STORE);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(APPOINTMENTS_STORE, 'readwrite');
    tx.objectStore(APPOINTMENTS_STORE).delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
    localStorage.setItem('appointments', JSON.stringify(stored.filter((a: Appointment) => a.id !== id)));
  }
}
