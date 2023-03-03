import React from "react";
import { Select, Empty, Spin } from "antd";
const { Option } = Select;

export default function MyAsyncSelect({
  value,
  onChange,
  loadOptions,
  size,
  placeholder,
  onBlur,
  optionsState,
  defaultValue,
  selectLoading,
  labelInValue,
  borderBottom,
  mode,
  disabled,
}) {
  return (
    <Select
      onBlur={onBlur}
      disabled={disabled}
      showSearch
      value={value == "" || value == [] ? null : value}
      placeholder={placeholder}
      // allowClear
      // defaultValue={defaultValue}
      mode={mode}
      showArrow={true}
      size={size ? size : "default"}
      style={{
        width: "100%",
        cursor: "pointer",
        // border: borderBottom == "bottom" && "none",
        // borderBottom: borderBottom == "bottom" && "1px solid lightgray",
      }}
      filterOption={false}
      onSearch={loadOptions}
      onChange={onChange}
      notFoundContent={selectLoading ? <Spin size="small" /> : null}
      labelInValue={labelInValue}
      options={(optionsState || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
      // loading={true}
    >
      {/* {optionsState?.map((opt) => (
        <Option key={opt.value}>{opt.text}</Option>
      ))} */}
    </Select>
  );
}
