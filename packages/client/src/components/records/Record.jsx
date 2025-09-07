import { useContext, useEffect } from "react";
import styles from "./Record.module.css";
import { StyledRecordCell } from "@common";
import { AppContext } from "@root/AppContext";
import { Button } from "@root/common";

export function Record(props) {
  const { setTotalCalories: addCalories } = useContext(AppContext);

  if (props.calories < 0) {
    return null;
  }

  useEffect(() => {
    addCalories((prevTotal) => prevTotal + props.calories);

    return () => {
      addCalories((prevTotal) => prevTotal - props.calories);
    };
  }, [addCalories, props.calories]);

  const deleteHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/records/${props.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        props.refresh?.();
      } else {
        console.error("Failed to delete record");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <ul className={styles.record}>
      <li>{props.meal}</li>
      <li>{props.content}</li>
      <li className={styles["record-calories"]}>
        <StyledRecordCell>{props.calories}</StyledRecordCell>
      </li>
      <Button variant="secondary" onClick={deleteHandler}>
        Delete
      </Button>
    </ul>
  );
}

