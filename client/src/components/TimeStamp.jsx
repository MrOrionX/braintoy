import React from "react";

const TimeStamp = ({ timestamp }) => {
  let elapsedTime = "";

  if (timestamp) {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const timeDifference = (now - messageDate)/1000; // Convert milliseconds to seconds
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInWeek = 7 * secondsInDay;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 365 * secondsInDay;

    // Time difference is wrong during evening time.
    // console.log("now:", now);
    // console.log("messageDate:", messageDate);
    // console.log("timeDifference:", timeDifference);

    switch (true) {
      case timeDifference < secondsInDay:
        const hours = messageDate.getHours();
        const minutes = messageDate.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, "0");
        elapsedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        break;

      case timeDifference < 2 * secondsInDay:
        elapsedTime = "Yesterday";
        break;

      case timeDifference < secondsInWeek:
        const daysPassed = Math.floor(timeDifference / secondsInDay);
        elapsedTime = `${daysPassed} ${daysPassed === 1 ? "day" : "days"} ago`;
        break;

      case timeDifference < secondsInMonth:
        const weeksPassed = Math.floor(timeDifference / secondsInWeek);
        elapsedTime = `${weeksPassed} ${
          weeksPassed === 1 ? "week" : "weeks"
        } ago`;
        break;

      case timeDifference < secondsInYear:
        const monthsPassed = Math.floor(timeDifference / secondsInMonth);
        elapsedTime = `${monthsPassed} ${
          monthsPassed === 1 ? "month" : "months"
        } ago`;
        break;

      default:
        const yearsPassed = Math.floor(timeDifference / secondsInYear);
        elapsedTime = `${yearsPassed} ${
          yearsPassed === 1 ? "year" : "years"
        } ago`;
    }
  }

  return <span className="timestamp">{elapsedTime}</span>;
};

export default TimeStamp;

