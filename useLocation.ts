import { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

interface Address {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface LocationState {
  address: Address | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    address: null,
    loading: false,
    error: null,
  });

  const getAddress = () => {
    setState({ address: null, loading: true, error: null });

    Geolocation.requestAuthorization();

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'User-Agent': 'your-app-name' } }
          );

          const data: Address = await res.json();
          setState({ address: data, loading: false, error: null });
        } catch {
          setState({ address: null, loading: false, error: 'Failed to fetch address' });
        }
      },
      (error) => {
        setState({ address: null, loading: false, error: error.message });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return { ...state, getAddress };
}
