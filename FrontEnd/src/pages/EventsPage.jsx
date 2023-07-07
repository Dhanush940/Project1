import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
// import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      <div>
        <Header activeHeading={4} />

        {allEvents ? (
          <EventCard data={allEvents && allEvents[0]} active={true} />
        ) : (
          <div style={"display:flex;justify-content:center;align-items:center"}>
            No Events Present
          </div>
        )}
      </div>
    </>
  );
};

export default EventsPage;
