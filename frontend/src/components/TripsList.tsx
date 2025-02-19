import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Trip } from '../types/trip';

const TripCard = lazy(() => import('./TripCard'));

interface TripsListProps {
  trips: Trip[];
  t: any;
}

const TripsList = ({ trips, t }: TripsListProps) => {
  const [visibleTrips, setVisibleTrips] = useState<string[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleTrips((prev) => [...new Set([...prev, entry.target.dataset.id!])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('.lazy-trip').forEach((trip) => observer.observe(trip));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip, index) => (
        <div key={trip.id} data-id={trip.id.toString()} className="lazy-trip">
          {visibleTrips.includes(trip.id.toString()) ? (
            <Suspense fallback={<div className="h-40 w-full bg-gray-200 animate-pulse rounded-lg" />}>
              <TripCard trip={trip} t={t} />
            </Suspense>
          ) : (
            <div className="h-40 w-full bg-gray-200 animate-pulse rounded-lg" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TripsList;