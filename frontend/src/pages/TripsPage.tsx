import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrips } from '../api/trips';
import useTranslation from '../utils/useTranslation';
import 'animate.css';

type Trip = {
    id: number;
    name: string;
    budget: number;
    image: string;
    startDate: string;
    endDate: string;
    destination: string;
};

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslation(); // Load translations

    useEffect(() => {
        fetchTrips()
            .then(setTrips)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <span className='animate__animated animate__fadeInDown'>
                        <h1 className="text-3xl font-extrabold text-text">
                            {t.myTrips}
                        </h1>
                    </span>
                    <span className='animate__animated animate__bounceIn flex' >
                        <button className='bg-secondary px-2 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-110 duration-150 '>
                            <Link to="/trips/new">+ {t.createNewTrip}</Link>
                        </button>
                    </span>
                </div>
                {trips.length === 0 ? (
                    <div className="text-center text-gray-500">
                        {t.noTripsFound}
                    </div>
                ) : (
                    <div className="flex justify-center gap-3 flex-wrap">
                        {trips.map((trip, index) => (
                            <span key={trip.id} className='lazy group lg:basis-2/5 basis-full animate__animated animate__zoomIn animate__delay-1s' style={{ animationDelay: `${index * 0.2}s`, flexGrow: `${trips.length % 2 === 0 ? "1" : trips.length === index + 1 ? '0' : '1'}` }}>
                                <div
                                    className="bg-white bg-opacity-30  shadow-lg hover:shadow-xl transition transform hover:border-primary ease-in-out duration-150 backdrop-blur-lg border border-white/30 rounded-lg overflow-hidden"
                                >
                                    {trip.image && (
                                        <img
                                            src={trip.image}
                                            alt={trip.name}
                                            className="w-full h-40 object-cover rounded-t-lg group-hover:scale-110 duration-150"
                                        />
                                    )}
                                    <div className="p-8 text-center">
                                        <div className='flex flex-row justify-between text-start'>
                                            <span>
                                                <h2 className="text-2xl text-text drop-shadow-md">
                                                    {trip.name}
                                                </h2>
                                                <p>{trip.destination}</p>
                                            </span>
                                            <span>
                                                <p className="text-text_secondary font-medium rounded-xl bg-primary px-2">
                                                    {t.budget}: {trip.budget} ₪
                                                </p>
                                                {trip.startDate && trip.endDate && (
                                                    <p className="text-sm text-text_secondary mt-2">
                                                        {new Date(trip.startDate).toLocaleDateString()} -{' '}
                                                        {new Date(trip.endDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/trips/${trip.id}`}
                                            className="mt-6 w-2/4 inline-block bg-gradient-to-r from-secondary to-secondary-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-400 transform hover:scale-110 transition duration-300"
                                        >
                                            {t.viewTripDetails}
                                        </Link>
                                    </div>
                                </div>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}