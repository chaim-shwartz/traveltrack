import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types/trip';

interface TripCardProps {
  trip: Trip;
  t: any;
}

const TripCard = ({ trip, t }: TripCardProps) => {
  return (
    <div className="bg-white bg-opacity-30 shadow-lg hover:shadow-xl transition transform hover:border-primary ease-in-out duration-150 backdrop-blur-lg border border-white/30 rounded-lg overflow-hidden">
      {trip.image && (
        <img
          src={trip.image}
          alt={trip.name}
          className="w-full h-40 object-cover rounded-t-lg hover:scale-110 duration-150"
        />
      )}
      <div className="p-8 text-center">
        <div className="flex flex-col sm:flex-row justify-between text-start">
          <span>
            <h2 className="text-2xl text-text drop-shadow-md">{trip.name}</h2>
            <p>{trip.destination}</p>
          </span>
          <span className="mt-4 sm:mt-0">
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
          className="mt-6 w-full sm:w-2/4 inline-block bg-gradient-to-r from-secondary to-secondary-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-400 transform hover:scale-110 transition duration-300"
        >
          {t.viewTripDetails}
        </Link>
      </div>
    </div>
  );
};

export default React.memo(TripCard);