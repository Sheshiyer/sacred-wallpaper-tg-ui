import { useState } from 'react';
import { BirthDataSchema } from '../types';
import LocationSearch from './LocationSearch';

interface BirthDataFormProps {
  onSubmit: (data: BirthDataSchema) => void;
  initialData?: Partial<BirthDataSchema>;
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, initialData }) => {
  const [birthData, setBirthData] = useState({
    date: initialData?.date || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    locationName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: new Date(birthData.date).toISOString(),
      latitude: Number(birthData.latitude),
      longitude: Number(birthData.longitude)
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setBirthData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="birth-data-form">
      <div className="form-group">
        <label htmlFor="birthDate">Date & Time of Birth</label>
        <input
          type="datetime-local"
          id="birthDate"
          value={birthData.date}
          onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Birth Location</label>
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          placeholder="Search for your birth location..."
        />
      </div>

      <div className="coordinates-display">
        {birthData.latitude && birthData.longitude && (
          <p className="coordinates">
            📍 Selected Location: {Number(birthData.latitude).toFixed(6)}°, {Number(birthData.longitude).toFixed(6)}°
          </p>
        )}
      </div>

      <button type="submit" className="submit-button" disabled={!birthData.latitude || !birthData.longitude}>
        ✨ Save Birth Data
      </button>
    </form>
  );
};

export default BirthDataForm;
