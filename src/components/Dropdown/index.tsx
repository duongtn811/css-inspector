"use client";

import { useState, useEffect, memo, forwardRef } from "react";
import { KeyEvent } from "@/utils/constant";
import styles from "./dropdown.module.css";

type IProps = Readonly<{
  onSelect: (option: string) => void;
  list: string[];
}>;
type Ref = HTMLUListElement;

export const Dropdown = forwardRef<Ref, IProps>(({ onSelect, list }, ref) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyEvent.ArrowDown) {
      event.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex + 1) % list.length);
    } else if (event.key === KeyEvent.ArrowUp) {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : list.length - 1
      );
    } else if (event.key === KeyEvent.Enter) {
      if (focusedIndex >= 0 && focusedIndex < list.length) {
        onSelect(list[focusedIndex]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, list]);

  const handleSelectOption = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    option: string
  ) => {
    event.stopPropagation();
    onSelect(option);
  };

  if (!list.length) {
    return null;
  }

  return (
    <ul className={styles.list} ref={ref}>
      {list.map((option, index) => (
        <li
          key={option}
          className={`${styles.option} ${
            focusedIndex === index ? styles.focused : ""
          }`}
          onClick={(event) => handleSelectOption(event, option)}
        >
          {option}
        </li>
      ))}
    </ul>
  );
});

export default memo(Dropdown);
