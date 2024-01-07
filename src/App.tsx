import React from "react";
import Calendar from "./Component/Calendar";
import { MEvents } from "./Component/Calendar/calendar.type";

function App() {
  const exampleEvents: MEvents[] = [
    {
      title: "Team Meeting",
      startDate: "2023-11-15",
      endDate: "2023-11-15",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      remindBefore: ["1800", "3600"],
      tags: [{ label: "Work", color: "#3498db" }],
      attendes: [
        { name: "John Doe", email: "john@example.com", shouldSentRemainder: true },
        { name: "Jane Doe", email: "jane@example.com", shouldSentRemainder: true },
      ],
      isRecurringEvent: true,
      location: "Conference Room A",
      isMeeting: true,
    },
    {
      title: "Lunch with Friends",
      startDate: "2023-12-20",
      endDate: "2023-12-20",
      startTime: "12:30 PM",
      endTime: "01:30 PM",
      tags: [{ label: "Social", color: "#e74c3c" }],
      attendes: [
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
      ],
      location: "Local Restaurant",
    },
    {
      title: "Project Deadline",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      remindBefore: ["86400"],
      tags: [{ label: "Work", color: "#3498db" }],
    },
  ];
  
  return (
    <div className="container-fluid p-0 mcalendar-container w-100">
      <Calendar view="monthly" events={exampleEvents}/>
      {/* <Calendar view="daily" events={exampleEvents} /> */}
    </div>
  );
}

export default App;
