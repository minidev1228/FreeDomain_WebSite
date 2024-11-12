import React from "react";
import { default as ReactSelect, components } from "react-select";

const OptionCom = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
};

export default OptionCom;