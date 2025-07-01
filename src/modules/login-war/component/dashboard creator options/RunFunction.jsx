import Dropdown from "./Dropdown";

export default function RunFunction({ isExecuteButtonRequired }) {
  function handleChange() {}

  const dropdownValues = ["FunctionA", "FunctionB"];

  return (
    <>
      <Dropdown
        values={dropdownValues}
        handlerFunction={handleChange}
        dropDownName={"Select Function To Run"}
        isMultiselectable={false}
        cssClass={"configuration_select_container mb-5"}
      />
      {isExecuteButtonRequired && (
        <div className="control_box">
          <button className="execute_button">Execute</button>
        </div>
      )}
    </>
  );
}
