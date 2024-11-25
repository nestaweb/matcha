import { useState, useEffect } from 'react';

interface GeolocationState {
	latitude: number | null;
	longitude: number | null;
	error: string | null;
	loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
		latitude: null,
		longitude: null,
		error: null,
		loading: true,
  });

  useEffect(() => {
	if (!navigator.geolocation) {
	  setState(prev => ({
			...prev,
			error: 'Geolocation is not supported by your browser',
			loading: false,
	  }));
	  return;
	}

	navigator.geolocation.getCurrentPosition(
	  (position) => {
		setState({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			error: null,
			loading: false,
		});
	  },
	  (errorNavigator) => {
		const getLocation = fetch(`/api/location/getLocation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setState({
					latitude: data.latitude,
					longitude: data.longitude,
					error: null,
					loading: false,
				});
				return { latitude: data.latitude, longitude: data.longitude, error: null, loading: false };
			}
		})
		.catch((error) => {
			setState(prev => ({
				...prev,
				error: errorNavigator.message,
				loading: false,
			}));
		})
	  }
	);
  }, []);

  return state;
};