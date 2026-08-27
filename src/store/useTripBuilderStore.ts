import { useState, useCallback, useEffect } from 'react';
import { CartItem, wholesaleService } from '../services/wholesaleService';

export interface TripBuilderState {
  destination: string;
  masterStartDate: string;
  masterEndDate: string;
  adults: number;
  children: number;
  cartItems: CartItem[];
  brokerMarkupType: 'fixed' | 'percentage';
  brokerMarkupValue: number;
  bookingId: number | null;
  bookingNumber: string | null;
  bookingStatus: string | null;
  histories: any[];
}

// Global in-memory state store listener pattern
let globalState: TripBuilderState = {
  destination: 'Galápagos',
  masterStartDate: '2026-08-27',
  masterEndDate: '2026-08-31',
  adults: 2,
  children: 1,
  cartItems: [],
  brokerMarkupType: 'fixed',
  brokerMarkupValue: 100,
  bookingId: null,
  bookingNumber: null,
  bookingStatus: null,
  histories: [],
};

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const tripBuilderStoreActions = {
  getState: () => globalState,

  setMasterContext: (destination: string, start: string, end: string, adults: number, children: number) => {
    globalState = {
      ...globalState,
      destination,
      masterStartDate: start,
      masterEndDate: end,
      adults,
      children,
    };
    notify();
  },

  setBrokerMarkup: (type: 'fixed' | 'percentage', value: number) => {
    globalState = {
      ...globalState,
      brokerMarkupType: type,
      brokerMarkupValue: value,
    };
    notify();
  },

  addItemToLienzo: (item: Omit<CartItem, 'id'>) => {
    // Validate Master Dates range
    if (item.start_date < globalState.masterStartDate || item.end_date > globalState.masterEndDate) {
      throw new Error(`El elemento (${item.start_date} - ${item.end_date}) sobrepasa las Fechas Maestras (${globalState.masterStartDate} - ${globalState.masterEndDate}).`);
    }

    const newItem: CartItem = {
      ...item,
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    };

    // Auto-sort chronologically by start_date
    const updatedCart = [...globalState.cartItems, newItem].sort((a, b) => a.start_date.localeCompare(b.start_date));

    globalState = {
      ...globalState,
      cartItems: updatedCart,
    };
    notify();
  },

  removeItemFromLienzo: (id: string) => {
    globalState = {
      ...globalState,
      cartItems: globalState.cartItems.filter((i) => i.id !== id),
    };
    notify();
  },

  setBookingDetails: (bookingId: number, bookingNumber: string, status: string, items: any[], histories: any[] = []) => {
    globalState = {
      ...globalState,
      bookingId,
      bookingNumber,
      bookingStatus: status,
      histories,
    };
    notify();
  },

  clearLienzo: () => {
    globalState = {
      ...globalState,
      cartItems: [],
      bookingId: null,
      bookingNumber: null,
      bookingStatus: null,
      histories: [],
    };
    notify();
  }
};

export function useTripBuilderStore() {
  const [state, setState] = useState<TripBuilderState>(globalState);

  useEffect(() => {
    const listener = () => setState(globalState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Compute live totals
  const totalBaseCost = state.cartItems.reduce((acc, item) => acc + (item.broker_base_cost * item.quantity), 0);
  
  let calculatedBrokerMarkup = 0;
  if (state.brokerMarkupType === 'percentage') {
    calculatedBrokerMarkup = totalBaseCost * (state.brokerMarkupValue / 100);
  } else {
    calculatedBrokerMarkup = state.brokerMarkupValue;
  }

  const totalClientFinal = totalBaseCost + calculatedBrokerMarkup;

  return {
    ...state,
    totalBaseCost,
    calculatedBrokerMarkup,
    totalClientFinal,
    setMasterContext: tripBuilderStoreActions.setMasterContext,
    setBrokerMarkup: tripBuilderStoreActions.setBrokerMarkup,
    addItemToLienzo: tripBuilderStoreActions.addItemToLienzo,
    removeItemFromLienzo: tripBuilderStoreActions.removeItemFromLienzo,
    setBookingDetails: tripBuilderStoreActions.setBookingDetails,
    clearLienzo: tripBuilderStoreActions.clearLienzo,
  };
}
