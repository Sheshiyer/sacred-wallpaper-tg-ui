import { useState, useCallback, useMemo } from 'react';
import { LoadScript, Autocomplete, Libraries } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ['places'] as Libraries;

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number) => void;
  placeholder?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, placeholder }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
    setIsLoading(false);
  }, []);

  const onLoadError = useCallback((error: Error) => {
    console.error('Google Maps API failed to load:', error);
    setError('Failed to load location search. Please try again later.');
    setIsLoading(false);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onLocationSelect(lat, lng);
      } else {
        setError('Please select a location from the dropdown.');
      }
    }
  }, [autocomplete, onLocationSelect]);

  // Memoize the LoadScript component to prevent unnecessary reloads
  const loadScriptComponent = useMemo(() => (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
      onError={onLoadError}
    >
      {isLoading ? (
        <div className="location-search-loading">
          <div className="loading-spinner"></div>
          <span>Loading location search...</span>
        </div>
      ) : error ? (
        <div className="location-search-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      ) : (
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            className="form-input"
            placeholder={placeholder || "Search for your birth location..."}
          />
        </Autocomplete>
      )}
    </LoadScript>
  ), [isLoading, error, onLoad, onPlaceChanged, placeholder, onLoadError]);

  return (
    <div className="location-search">
      {loadScriptComponent}
      {error && !isLoading && (
        <p className="location-search-help">
          Try typing a city name or address and select from the suggestions.
        </p>
      )}
    </div>
  );
};

export default LocationSearch;
