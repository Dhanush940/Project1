import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  // console.log(allEvents);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {allEvents?.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} />
            )}
            <h1 className="text-center mb-3 800px:text-left">
              {allEvents?.length === 0 && "No Events Present"}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
