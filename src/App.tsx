import React from "react";
import Calendar from "./Component/Calendar";

function App() {
  return (
    <div className="container-fluid p-0 mcalendar-container w-100">
      <Calendar />
      <Calendar view="daily" />
    </div>
  );
}

export default App;
