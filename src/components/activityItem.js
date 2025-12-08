import React, { useEffect, useRef } from "react";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";

const ActivityItem = ({ name, keyName, resetTrigger }) => {
  const [isCompleted, setIsCompleted] = usePersistentLocalStorage(keyName, false);
  const keyGroup = keyName.split("_")[0];
  const trigger = resetTrigger?.[keyGroup];
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return; // Prevent reset on first mount
    }

    if (trigger !== undefined) {
      setIsCompleted(false);
    }
  }, [trigger]);

  const handleCardClick = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: ".75rem",
        margin: ".2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        border: isCompleted ? "3px solid #4caf50" : "3px solid #ccc",
        transition: "border 0.4s ease, transform 0.3s ease",
        cursor: "pointer",
        flex: "1 1 300px",
        maxWidth: "350px",
        minWidth: "250px",
        position: "relative",
      }}
    >
      {isCompleted && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "24px",
            color: "#4caf50",
          }}
        >
          ✔
        </div>
      )}
      <span style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{name}</span>
    </div>
  );
};

export default ActivityItem;
