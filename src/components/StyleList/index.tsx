"use client";

import { ChangeEvent } from "react";
import { ElementStyle } from "@/utils/types";
import styles from "./style-list.module.css";
import { cssPropertyValues } from "@/utils/constant";

const cssProperties = Object.keys(cssPropertyValues);

type IProps = {
  elementStyles: ElementStyle[];
  onUpdateStyle: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
};

const StyleList = ({ elementStyles, onUpdateStyle }: IProps) => {
  const renderCheckbox = (value: string, index: number) => {
    if (cssProperties.includes(value.trim())) {
      return (
        <input
          type="checkbox"
          defaultChecked
          onChange={(event) => onUpdateStyle(event, index)}
        />
      );
    }
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          fill="#F44336"
        />
      </svg>
    );
  };

  return (
    <div>
      {elementStyles.map((style: ElementStyle, index: number) => (
        <div key={`${style.property}.${index}`} className={styles.createdRow}>
          {renderCheckbox(style.property, index)}
          <div
            className={`${styles.createdProperty} ${
              style.check ? "" : styles.removed
            }`}
          >
            {style.property}
          </div>
          <div> : </div>
          <div className={style.check ? "" : styles.removed}>{style.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StyleList;
