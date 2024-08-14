"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cssPropertyValues } from "@/utils/constant";
import { ElementStyle } from "@/utils/types";
import Dropdown from "@/components/Dropdown";
import styles from "./inspector.module.css";

const cssProperties = Object.keys(cssPropertyValues);

const CSSInspector = () => {
  const [elementStyles, setElementStyles] = useState<ElementStyle[]>([]);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [currentProperty, setCurrentProperty] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>("");

  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] =
    useState<boolean>(false);
  const [isValueDropdownOpen, setIsValueDropdownOpen] =
    useState<boolean>(false);

  const propertyInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const clearAll = () => {
    setCurrentProperty("");
    setCurrentValue("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !dropdownRef.current ||
      (dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node))
    ) {
      setIsPropertyDropdownOpen(false);
      setIsValueDropdownOpen(false);
      setIsFocused(false);
      clearAll();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickBox = () => {
    setIsFocused(true);
  };

  const handleChangeProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.endsWith(":")) {
      setIsPropertyDropdownOpen(false);
      valueInputRef.current?.focus();
      setIsValueDropdownOpen(true);
      return;
    }

    setCurrentProperty(event.target.value);

    if (event.target.value) {
      setIsPropertyDropdownOpen(true);
    } else {
      setIsPropertyDropdownOpen(false);
    }
  };

  const handleSelectProperty = (option: string) => {
    setCurrentProperty(option);
    setIsPropertyDropdownOpen(false);
    valueInputRef.current?.focus();
    setIsValueDropdownOpen(true);
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);

    if (event.target.value) {
      setIsValueDropdownOpen(true);
    } else {
      setIsValueDropdownOpen(false);
    }
  };

  const handleSelectValue = (option: string) => {
    setIsValueDropdownOpen(false);
    setElementStyles((prevState) => [
      ...prevState,
      { property: currentProperty, value: option },
    ]);
    clearAll();
    propertyInputRef.current?.focus();
  };

  const filteredCssProperties = useMemo(() => {
    return cssProperties.filter((option: string) =>
      option.includes(currentProperty)
    );
  }, [currentProperty]);
  const cssValues: string[] = useMemo(() => {
    if (cssProperties.includes(currentProperty)) {
      return cssPropertyValues[currentProperty];
    }
    return [];
  }, [currentProperty]);

  const openText = "element.style {";
  const closedText = "}";
  const isHavingProperties = elementStyles.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.box} onClick={handleClickBox}>
        <div>{openText}</div>
        {isHavingProperties && (
          <div>
            {elementStyles.map((style: ElementStyle, index: number) => (
              <div
                key={`${style.property}.${index}`}
                className={styles.createdRow}
              >
                <input type="checkbox" defaultChecked />
                <div className={styles.createdProperty}>{style.property}</div>
                <div> : </div>
                <div>{style.value}</div>
              </div>
            ))}
          </div>
        )}
        {isFocused && (
          <div className={styles.currentRow}>
            <div className={styles.property}>
              <input
                ref={propertyInputRef}
                className={styles.input}
                autoFocus={isFocused}
                value={currentProperty}
                onChange={handleChangeProperty}
              />
              {isPropertyDropdownOpen && (
                <Dropdown
                  ref={dropdownRef}
                  onSelect={handleSelectProperty}
                  list={filteredCssProperties}
                />
              )}
            </div>
            :
            <div className={styles.value}>
              <input
                ref={valueInputRef}
                className={styles.input}
                value={currentValue}
                onChange={handleChangeValue}
              />
              {isValueDropdownOpen && (
                <Dropdown
                  ref={dropdownRef}
                  onSelect={handleSelectValue}
                  list={cssValues}
                />
              )}
            </div>
          </div>
        )}
        <div>{closedText}</div>
      </div>
    </div>
  );
};

export default CSSInspector;
