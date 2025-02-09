import React, { useState, useEffect, useRef } from 'react';
import styles from './countryselect.module.css';

interface CountrySelectProps {
  onSelect: (country: string) => void;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
  'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mexico',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway',
  'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Lucia', 'Samoa',
  'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia',
  'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tanzania', 'Thailand', 'Togo',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

const CountrySelect: React.FC<CountrySelectProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: string) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    onSelect(country);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCountry(''); // Clear selected country when user starts typing
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && searchTerm === '' && selectedCountry) {
      // Clear selection when backspace is pressed and input is empty
      setSelectedCountry('');
      onSelect('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search term if no country was selected
        if (!selectedCountry) {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCountry]);

  return (
    <div className={styles.container} ref={inputRef}>
      <div 
        className={styles.inputWrapper}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm(''); // Clear search term when opening dropdown
          }
        }}
      >
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Select Country"
            value={selectedCountry || searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedCountry) {
                setSelectedCountry(''); // Clear selected country when clicking the input
                setSearchTerm('');
                onSelect('');
              }
              setIsOpen(true);
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country}
                className={styles.option}
                onClick={() => handleSelect(country)}
              >
                {country}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelect;