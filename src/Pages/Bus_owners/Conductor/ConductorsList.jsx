import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios/axios';

const ConductorsList = () => {
    const [conductors, setConductors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConductors = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    setErrorMessage('No access token found');
                    return;
                }
                const response = await axiosInstance.get("/conductors/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setConductors(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (error) {
                setErrorMessage("Failed to load conductors.");
                setLoading(false);
            }
        };

        fetchConductors();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-600">Loading conductors...</p>;
    }

    if (errorMessage) {
        return <p className="text-center text-red-600">{errorMessage}</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold text-red-600 mb-6">Conductors List</h2>
            <ul className="space-y-6">
                {conductors.length > 0 ? (
                    conductors.map((conductor) => (
                        <li
                            key={conductor.id}
                            className="p-6 border border-red-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                        >
                            {/* <h3 className="text-2xl font-bold text-red-700">{conductor.name}</h3> */}
                            <h3 className="text-2xl font-bold text-red-700">{conductor.name.charAt(0).toUpperCase() + conductor.name.slice(1)}</h3>
                            {conductor.user?.username && (
                                <h4 className="text-xl text-gray-800 font-medium">{conductor.user.username}</h4>
                            )}
                            <p className="text-gray-600 mt-2">License Number: {conductor.license_number}</p>
                            <p className="text-gray-600">Phone: {conductor.phone_number}</p>
                            <p className="text-gray-600">Hired on: {conductor.hired_date}</p>
                            <p className="text-gray-600">
                                Duty:
                                <span className={conductor.is_active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                    {conductor.is_active ? "On Duty" : "Not Scheduled"}
                                </span>
                            </p>

                            {conductor.scheduled_bus_details?.scheduled_bus ? (
                                <div className="mt-4">
                                    <h4 className="text-lg font-semibold text-gray-800">Scheduled Bus Details:</h4>
                                    <p className="text-gray-600">
                                        Bus Number: {conductor.scheduled_bus_details.scheduled_bus.bus_number}
                                    </p>
                                    <p className="text-gray-600">
                                        Name: {conductor.scheduled_bus_details.scheduled_bus.name}
                                    </p>
                                    <p className="text-gray-600">
                                        Route: {conductor.scheduled_bus_details.scheduled_bus.route}
                                    </p>
                                    <p className="text-gray-600">
                                        Scheduled Date: {new Date(
                                            conductor.scheduled_bus_details.scheduled_bus.scheduled_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-600 mt-2">No scheduled bus details available.</p>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No conductors here.</p>
                )}
            </ul>
        </div>
    );
};

export default ConductorsList;
