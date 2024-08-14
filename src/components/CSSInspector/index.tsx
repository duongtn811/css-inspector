"use client";

import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KeyEvent, cssPropertyValues } from "@/utils/constant";
import { ElementStyle } from "@/utils/types";
import Dropdown from "@/components/Dropdown";
import styles from "./inspector.module.css";
import StyleList from "../StyleList";

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
      event.target instanceof HTMLInputElement &&
      (event.target.type === "checkbox" || event.target.type === "text")
    ) {
      return;
    }

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

  useEffect(() => {
    if (propertyInputRef.current) {
      const length = currentProperty.length * 8 || 8;
      propertyInputRef.current.style.width = `${length}px`;
    }
  }, [propertyInputRef, currentProperty]);

  const handleClickBox = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = (event as unknown as Event).target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setIsFocused(false);
      return;
    }
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
    if (option.includes(":")) {
      const property = option.split(":")[0];
      const value = option.split(":")[1];
      setIsPropertyDropdownOpen(false);
      setElementStyles((prevState) => [
        ...prevState,
        { property: property, value: value, check: true },
      ]);
      clearAll();
      return;
    }

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
      { property: currentProperty, value: option, check: true },
    ]);
    clearAll();
    propertyInputRef.current?.focus();
  };

  const handleUpdateStyle = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newStyles = [...elementStyles].map((style, idx) => {
      if (index === idx) {
        return { ...style, check: event.target.checked };
      }
      return style;
    });
    setElementStyles(newStyles);
  };

  const handleKeyDownValue = (event: KeyboardEvent) => {
    if (event.key === KeyEvent.Enter && currentProperty && currentValue) {
      setElementStyles((prevState) => [
        ...prevState,
        { property: currentProperty, value: currentValue, check: true },
      ]);
      setCurrentProperty("");
      setCurrentValue("");
    }
  };

  const filteredCssProperties = useMemo(() => {
    const defaultList = cssProperties;
    const listWithValues: string[] = cssProperties.reduce(
      (acc: string[], val: string) => {
        const values = cssPropertyValues[val];
        const propertyValues: string[] = values.map((v: string) => {
          return `${val} : ${v}`;
        });
        return [...acc, ...propertyValues];
      },
      []
    );
    return [...defaultList, ...listWithValues].filter((option: string) =>
      option.includes(currentProperty)
    );
  }, [currentProperty]);

  const cssValues: string[] = useMemo(() => {
    if (cssProperties.includes(currentProperty)) {
      return cssPropertyValues[currentProperty].filter((value) =>
        value.includes(currentValue)
      );
    }
    return [];
  }, [currentProperty, currentValue]);

  const openText = "element.style {";
  const closedText = "}";
  const isHavingProperties = elementStyles.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.box} onClick={handleClickBox}>
        <div>{openText}</div>
        {isHavingProperties && (
          <StyleList
            onUpdateStyle={handleUpdateStyle}
            elementStyles={elementStyles}
          />
        )}
        {isFocused && (
          <div className={styles.currentRow}>
            <div className={styles.property}>
              <input
                ref={propertyInputRef}
                className={styles.propertyInput}
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
                onKeyDown={handleKeyDownValue}
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
