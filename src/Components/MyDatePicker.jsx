import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function MyDatePicker({ setDateRange, size, spacedFormat }) {
  const [searchDateRange, setSearchDateRange] = useState([
    moment().subtract(89, "d"),
    moment(),
  ]);

  useEffect(() => {
    if (searchDateRange[0] && searchDateRange[1]) {
      const from = searchDateRange[0];
      const to = searchDateRange[1];
      let dash = spacedFormat ? " - " : "-";
      const formattedDate = from + dash + to;
      setDateRange(formattedDate);
    }
  }, [searchDateRange]);
  useEffect(() => {
    const from = moment().subtract(89, "d").format("DD-MM-YYYY");
    const to = moment().format("DD-MM-YYYY");

    const formattedDate = from + "-" + to;
    setSearchDateRange([from, to]);
  }, []);
  return (
    <RangePicker
      // className="date-picker"
      size={size ? size : "default"}
      style={{
        width: "100%",
        fontSize: window.innerWidth <= 1600 ? "0.7rem" : "0.9rem",
      }}
      defaultValue={searchDateRange}
      format="DD-MM-YYYY"
      ranges={{
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "day"), moment().subtract(1, "day")],
        "Last 7 Days": [moment().subtract(7, "d"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().startOf("month").subtract(1, "month"),
          moment().startOf("month"),
        ],
        "Last 90 days": [moment().subtract(89, "d"), moment()],
      }}
      // style={{ height: "38px" }}
      onChange={(e) => {
        setSearchDateRange(
          e.map((item) => {
            return moment(item).format("DD-MM-YYYY");
          })
        );
      }}
    />
  );
}
