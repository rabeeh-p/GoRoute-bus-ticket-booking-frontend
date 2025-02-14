import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';  

const SearchForm = () => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [selectedFromCity, setSelectedFromCity] = useState('');
  const [selectedToCity, setSelectedToCity] = useState('');
  const [showSuggestionsFrom, setShowSuggestionsFrom] = useState(false);
  const [showSuggestionsTo, setShowSuggestionsTo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStopSuggestions = async () => {
      try {
        // const response = await axios.get('http://127.0.0.1:8000/all-stops/');
        const response = await axios.get('https://api.goroute.site/all-stops/');
        setStopSuggestions(response.data.stops || []);
      } catch (error) {
        // console.error('Error fetching stop suggestions:', error);
      }
    };

    fetchStopSuggestions();
  }, []);

  const filterSuggestions = (input) => {
    if (!stopSuggestions || stopSuggestions.length === 0) return [];
    return stopSuggestions.filter((stop) =>
      stop.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    if (fromCity && toCity && date) {
      try {
        const response = await axios.get('https://api.goroute.site/search_buses/', {
          params: { from: fromCity, to: toCity, date },
        });

        if (response.data && Array.isArray(response.data.buses)) {
          localStorage.setItem('searchParams', JSON.stringify({ from: fromCity, to: toCity, date }));

          if (response.data.buses.length > 0) {
            navigate('/trip-booking');
          } else {
            // Show SweetAlert if no buses are found
            Swal.fire({
              icon: 'info',
              title: 'No Buses Found',
              text: 'Sorry, there are no buses available for the selected route and date.',
            });
          }
        } else {
          setError('No buses found.');
        }
      } catch (err) {
        setError('Error fetching buses');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill all the fields');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="grid md:grid-cols-3 gap-4">
          {/* From City Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="flex items-center border rounded-md p-2">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => {
                  setFromCity(e.target.value);
                  setSelectedFromCity(e.target.value);
                  setShowSuggestionsFrom(true);
                }}
                placeholder="Enter source city"
                className="w-full focus:outline-none"
              />
            </div>
            <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-10">
              {fromCity &&
                showSuggestionsFrom &&
                filterSuggestions(fromCity).map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setFromCity(suggestion);
                      setSelectedFromCity(suggestion);
                      setShowSuggestionsFrom(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </div>
                ))}
            </div>
          </div>

          {/* To City Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="flex items-center border rounded-md p-2">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="text"
                value={toCity}
                onChange={(e) => {
                  setToCity(e.target.value);
                  setSelectedToCity(e.target.value);
                  setShowSuggestionsTo(true);
                }}
                placeholder="Enter destination city"
                className="w-full focus:outline-none"
              />
            </div>
            <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-10">
              {toCity &&
                showSuggestionsTo &&
                filterSuggestions(toCity).map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setToCity(suggestion);
                      setSelectedToCity(suggestion);
                      setShowSuggestionsTo(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </div>
                ))}
            </div>
          </div>

          {/* Date Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="flex items-center border rounded-md p-2">
              <Calendar className="h-5 w-5 text-red-600 mr-2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300"
        >
          {loading ? 'Loading...' : 'Search Buses'}
        </button>

        {/* Error Message */}
        <div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;

