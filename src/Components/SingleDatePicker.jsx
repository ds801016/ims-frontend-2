import React, { useEffect } from "react";
import moment from "moment";
import { DatePicker } from "antd";

export default function SingleDatePicker({
  setDate,
  placeholder,
  size,
  daysAgo,
  row,
  value,
  inputHandler,
  tablePicker,
  name,
  disabled,
}) {
  const onChange = (date, dateString) => {
    if (tablePicker) {
      inputHandler(name, dateString, row.id);
      return;
    }
    if (setDate) {
      setDate(dateString);
    }
  };
  useEffect(() => {
    if (setDate) {
      setDate(
        daysAgo
          ? moment().subtract(daysAgo, "d").format("DD-MM-YYYY")
          : moment().format("DD-MM-YYYY")
      );
    }
  }, []);
  console.log(value);
  return (
    <DatePicker
      disabled={disabled}
      size={size ?? "default"}
      style={{ width: "100%", height: "100%" }}
      format="DD-MM-YYYY"
      defaultValue={
        value
          ? value != "" && moment(value, "DD-MM-YYYY")
          : daysAgo
          ? moment().subtract(daysAgo, "d")
          : ""
      }
      onChange={onChange}
      placeholder={placeholder && placeholder}
    />
  );
}
