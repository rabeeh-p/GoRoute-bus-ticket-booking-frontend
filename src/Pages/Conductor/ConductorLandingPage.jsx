import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, MapPin } from "lucide-react";
import useLogout from "../../Hook/useLogout";
import axiosInstance from "../../axios/axios";
import Swal from 'sweetalert2';
import axios from 'axios';

const ConductorLandingPage = () => {
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const [busData, setBusData] = useState(null);
  const [currentStop, setCurrentStop] = useState(0);
  const [busPosition, setBusPosition] = useState(0);
  const [isOnJob, setIsOnJob] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  console.log(isJourneyStarted, 'jouir');
  const [message, setMessage] = useState(null);


  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };


  useEffect(() => {
    const fetchBusData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found');
          return;
        }
        const response = await axiosInstance.get("/conductor-dashboard/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data) {
          setBusData(response.data);
          console.log(response.data, 'bus and stops detgails');
          setMessage(response.data.detail);

          setLoading(false);
          setCurrentStop(response.data.current_stop);
          updateBusPosition(5);
          setName(response.data.bus.bus_owner_name);
          setIsJourneyStarted(response.data.bus.started);
        }
      } catch (error) {
        setLoading(false);
        setError("Error fetching bus data. Please try again later.");
      }
    };

    if (isOnJob) {
      fetchBusData();
    } else {
      setBusData(null);
    }
  }, [isOnJob]);

  useEffect(() => {
    if (busData && busData.stops) {
      updateBusPosition(currentStop);
    }
  }, [currentStop, busData]);

  const updateBusPosition = (stopIndex) => {
    if (busData && busData.stops) {
      const position = (stopIndex / (busData.stops.length - 1)) * 100;
      setBusPosition(position);
    }
  };


  const startJourney = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      // const response = await axios.post('http://127.0.0.1:8000/api/start-journey', {
      const response = await axios.post('https://api.goroute.site/api/start-journey', {
        busId: busData?.bus?.id
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setIsJourneyStarted(true);
      } else {
        console.error('Failed to start journey');
      }
    } catch (error) {
      console.error('Error starting journey:', error);
    }
  };





  // const handleChangeStop = (stopIndex) => {
  //   if (stopIndex <= currentStop) {
  //     Swal.fire({
  //       title: 'Action Not Allowed',
  //       text: 'You can only move forward to the next stop. You cannot go back to a previous stop.',
  //       icon: 'error',
  //       confirmButtonText: 'Okay',
  //     });
  //     return;
  //   }

  //   if (stopIndex > currentStop + 1) {
  //     Swal.fire({
  //       title: 'Action Not Allowed',
  //       text: 'You must move through the stops sequentially. Skipping stops is not allowed.',
  //       icon: 'error',
  //       confirmButtonText: 'Okay',
  //     });
  //     return;
  //   }

  //   if (stopIndex === busData.stops.length - 1 && currentStop !== busData.stops.length - 2) {
  //     Swal.fire({
  //       title: 'Action Not Allowed',
  //       text: 'You cannot go directly to the last stop. Please complete all intermediate stops first.',
  //       icon: 'error',
  //       confirmButtonText: 'Okay',
  //     });
  //     return;
  //   }

  //   const stopOrder = busData.stops[stopIndex].stop_order;

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: `You are about to move to the next stop: ${busData.stops[stopIndex].stop_name}`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, move to next stop',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const accessToken = localStorage.getItem('accessToken');
  //         if (!accessToken) {
  //           Swal.fire('Error', 'No access token found', 'error');
  //           return;
  //         }

  //         const response = await axiosInstance.post("/update-stop/", {
  //           bus_id: busData.bus.id,
  //           stop_order: stopOrder - 1,
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           }
  //         });

  //         if (response.data.success) {
  //           setCurrentStop(stopIndex);
  //           updateBusPosition(stopIndex);
  //           Swal.fire('Success', 'Successfully moved to the next stop!', 'success');
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 2000);
  //         } else {
  //           Swal.fire('Error', 'Failed to move to the next stop. Please try again later.', 'error');
  //         }
  //       } catch (error) {
  //         Swal.fire('Error', 'Error updating the stop. Please try again later.', 'error');
  //       }
  //     }
  //   });
  // };


  const handleChangeStop = (stopIndex) => {
    if (stopIndex <= currentStop) {
      Swal.fire({
        title: 'Action Not Allowed',
        text: 'You can only move forward to the next stop. You cannot go back to a previous stop.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    if (stopIndex > currentStop + 1) {
      Swal.fire({
        title: 'Action Not Allowed',
        text: 'You must move through the stops sequentially. Skipping stops is not allowed.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    if (stopIndex === busData.stops.length - 1 && currentStop !== busData.stops.length - 2) {
      Swal.fire({
        title: 'Action Not Allowed',
        text: 'You cannot go directly to the last stop. Please complete all intermediate stops first.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }
  
    const stopOrder = busData.stops[stopIndex].stop_order;
  
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to move to the next stop: ${busData.stops[stopIndex].stop_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, move to next stop',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show loading indicator
        const loadingSwal = Swal.fire({
          title: 'Loading...',
          text: 'Moving to the next stop. Please wait.',
          icon: 'info',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show the loading spinner
          }
        });
  
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            Swal.fire('Error', 'No access token found', 'error');
            loadingSwal.close(); 
            return;
          }
  
          const response = await axiosInstance.post("/update-stop/", {
            bus_id: busData.bus.id,
            stop_order: stopOrder - 1,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
  
          if (response.data.success) {
            setCurrentStop(stopIndex);
            updateBusPosition(stopIndex);
            Swal.fire('Success', 'Successfully moved to the next stop!', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            Swal.fire('Error', 'Failed to move to the next stop. Please try again later.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error updating the stop. Please try again later.', 'error');
        } finally {
          loadingSwal.close(); // Close the loading spinner after the operation
        }
      }
    });
  };
  

  if ((message && message === "You have no bus assigned.") || message === "Conductor is not active.") {
    return (
      <>
        <div className="flex justify-between items-center bg-red-700 p-6 text-white">
          <h1 className="text-3xl font-semibold cursor-pointer" onClick={() => navigate('/conductor-home')}>
            Conductor Dashboard
          </h1>
          <div className="flex space-x-4">
            {!message && (
              <button
                onClick={() => navigate('/chat-conductor')}
                className="bg-red-600 py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg font-semibold"
              >
                Chat
              </button>
            )}
            <button onClick={handleLogout} className="bg-red-600 py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg font-semibold">
              Logout
            </button>
          </div>
        </div>

        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center py-12">
          <div className="bg-white shadow-2xl rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 p-8 text-center">
            <p className="text-xl text-red-600"> {message === "Conductor is not active." ? "Duty not scheduled" : message}</p>
            <button onClick={handleLogout} className="bg-red-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-800 transition duration-300 text-lg mt-4">
              Logout
            </button>
          </div>
        </div>
      </>
    );
  }


  return (




    <>
      <div className="flex justify-between items-center bg-red-700 p-6 text-white">
        <h1 className="text-3xl font-semibold cursor-pointer" onClick={() => navigate('/conductor-home')}>
          Conductor Dashboard
        </h1>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/chat-conductor')}
            className="bg-red-600 py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg font-semibold"
          >
            Chat
          </button>
          <button
            onClick={handleLogoutClick}
            className="bg-red-600 py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center py-12">
        <div className="bg-white shadow-2xl rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-red-700">Welcome, Conductor! {name}</h1>
            <p className="text-lg text-gray-700 mt-2">Manage your bus routes and stops efficiently!</p>
          </div>

          <div className="text-center">
            {error && <p className="text-lg text-red-600">{error}</p>}
            {loading ? (
              <p className="text-lg text-gray-600">Loading bus data...</p>
            ) : isOnJob ? (
              isJourneyStarted ? (
                busData ? (
                  <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-red-700 mb-4 flex items-center justify-center">
                      <Bus className="mr-2" />
                      Bus Tracking {busData.bus_number}
                    </h2>

                    <div className="flex items-center justify-center bg-red-100 p-4 rounded-lg mb-8">
                      <MapPin className="text-red-700" />
                      <span className="text-xl text-red-700 font-medium ml-2">
                        {busData.stops[currentStop]?.stop_name || "End of Route"}
                      </span>
                    </div>

                    {/* Bus details section */}
                    <div className="bg-gray-200 p-4 rounded-lg shadow-sm mb-8">
                      <h3 className="text-2xl font-semibold text-red-700">Bus Details</h3>
                      <ul className="text-left mt-4 text-gray-800">
                        <li><strong>Bus Number:</strong> {busData.bus.bus_number}</li>
                        <li><strong>Bus Owner Name:</strong> {busData.bus.bus_owner_name}</li>
                        <li><strong>Bus Type:</strong> {busData.bus.bus_type}</li>
                        <li><strong>Route:</strong> {busData.bus.route}</li>
                      </ul>
                    </div>

                    <div className="relative w-full h-4 bg-gray-300 rounded-full mb-8">
                      <div
                        className="absolute top-0 left-0 h-full bg-red-700 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${busPosition}%` }}
                      />
                      {busData.stops.map((stop, index) => (
                        <div
                          key={stop.stop_order}
                          className="absolute top-full mt-2"
                          style={{ left: `${(index / (busData.stops.length - 1)) * 100}%` }}
                        >
                          <div className="w-3 h-3 bg-red-700 rounded-full mb-1 mx-auto" />
                          <div className="text-xs text-gray-600 text-center">{stop.stop_name}</div>
                        </div>
                      ))}
                      <div
                        className="absolute top-0 w-8 h-8 bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out"
                        style={{ left: `calc(${busPosition}% - 16px)`, top: "-10px" }}
                      >
                        <Bus className="text-white w-5 h-5" />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold text-red-700 mb-4">Manage Stops</h2>
                      <div className="flex justify-center gap-4 flex-wrap">
                        {busData.stops.map((stop, index) => (
                          <button
                            key={stop.stop_order}
                            onClick={() => handleChangeStop(index)}
                            className={`${currentStop === index ? "bg-red-800" : "bg-red-700"
                              } text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-800 mb-4 transition duration-300`}
                          >
                            Stop {stop.stop_order}: {stop.stop_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl text-gray-600">No bus data available.</p>
                )
              ) : (
                <button
                  onClick={startJourney}
                  className="bg-red-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-800 transition duration-300 text-lg"
                >
                  Start Journey
                </button>
              )
            ) : (
              <p className="text-xl text-gray-600">You are not on job currently.</p>
            )}
          </div>
        </div>
      </div>
    </>



  );
};

export default ConductorLandingPage;
