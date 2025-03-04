import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

type AutoRefreshComponentProps = {
  invalidateName: string;
  timeoutMinutes?: number;
};

const AutoRefreshComponent = ({
  timeoutMinutes = 5,
  invalidateName,
}: AutoRefreshComponentProps) => {
  // Convert minutes to milliseconds
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const [lastActivity, setLastActivity] = useState(Date.now());
  const queryClient = useQueryClient();

  // Reset timer when user interacts with the page
  const resetTimer = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
      "keyup",
    ];

    // Add all event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Timer to check inactivity
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;

      // Refresh page if inactive for the specified time
      if (elapsed >= timeoutMs) {
        console.log("No activity detected for 2 minutes. Refreshing page...");
        queryClient.invalidateQueries(invalidateName);
        resetTimer();
      }
    }, 1000); // Check every second

    // Cleanup event listeners and interval on unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [lastActivity, timeoutMs]);

  return <div />;
};

export default AutoRefreshComponent;
