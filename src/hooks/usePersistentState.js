import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistentState(key, initialValue) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    let active = true;

    async function loadValue() {
      try {
        const storedValue = await AsyncStorage.getItem(key);

        if (!active) {
          return;
        }

        if (storedValue !== null) {
          setState(JSON.parse(storedValue));
        }
      } catch (error) {
        // Keep the in-memory fallback if local storage is unavailable.
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    }

    loadValue();

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(key, JSON.stringify(state)).catch(() => {});
  }, [hydrated, key, state]);

  return [state, setState];
}
