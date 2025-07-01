import Dropdown from "./Dropdown";

export default function RunProcedure({ isExecuteButtonRequired }) {
  function handleChange() {}

  const dropdownValues = ["ProcedureA", "ProcedureB"];

  return (
    <>
      <Dropdown
        values={dropdownValues}
        handlerFunction={handleChange}
        dropDownName={"Select Procedure To Run"}
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
