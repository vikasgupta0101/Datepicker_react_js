import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

const Materialui = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const month = date.month() + 1; // Day.js month is 0 indexed
      const day = date.date();
      fetchEvents(month, day);
    }
  };

  const fetchEvents = async (month, day) => {
    try {
      const response = await axios.get(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`
      );
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    // Fetch events for today's date on initial render
    const today = new Date();
    fetchEvents(today.getMonth() + 1, today.getDate());
  }, []);

  return (
    <Box style={{ padding: "20px" }}>
      <Typography variant="h5">Mui Date picker</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
      {events.length > 0 && (
        <Box>
          <Typography variant="h6">Events on this day:</Typography>
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.text}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Materialui; 
