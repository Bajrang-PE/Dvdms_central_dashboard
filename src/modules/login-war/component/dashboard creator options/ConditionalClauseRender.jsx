import { useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import ColumnSelector from "./ColumnSelector";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";

//prettier-ignore
export default function ConditionalClauseRender({
  id,
  renderState,
  tables,
  config,
  dispatcher,
}) {
  const clause = renderState === "" ? "WHERE" : renderState;

  //eslint-disable-next-line
  const { dasboardDispatcher, dashboardState } = useDashboard();

  const computedColumns = useMemo(() => {
    return dashboardState.computedColumns;
  }, [dashboardState.computedColumns]);

  const joinColumns = dashboardState.joinConditions;

  switch (clause) {
    case "WHERE":
      return <WhereClause />;
    case "ORDER BY":
      return <OrderByClause />;
    case "INNER JOIN":
      return <JoinClause />;
    case "LEFT JOIN":
      return <JoinClause />;
    case "RIGHT JOIN":
      return <JoinClause />;
    default:
      return <></>;
  }

  function WhereClause() {

    return (
      <>
        <Dropdown
          values={computedColumns}
          handlerFunction={(e) =>
            handleConfigChange("whereClause", e.target.value)
          }
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={config?.whereClause}
        />
        {"="}
        <input
          placeholder="Enter value here"
          className="configuration_select"
          type="text"
          onChange={(e) => handleConfigChange("whereInputField", e.target.value)}
          value={config?.whereInputField}
        />
        <Conditions />
      </>
    );
  }

  function OrderByClause() {

    return (
      <>
        <ColumnSelector isMultiselectable={false} />
        <Dropdown
          values={["ASC", "DESC"]}
          isMultiselectable={false}
          cssClass={"mb-1"}
          handlerFunction={(e) =>
            handleConfigChange("orderByClause", e.target.value)
          }
          selectedValue={config?.orderByClause}
        />
      </>
    );
  }

  function JoinClause() {

    return (
      <>
        <Dropdown
          values={tables}
          handlerFunction={(e) => handleConfigChange("table", e.target.value)}
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={config?.table}
        />
        <h6 className="sql_identifiers">ON</h6>
        <Dropdown
          values={joinColumns}
          handlerFunction={(e) =>
            handleConfigChange("onColumn1", e.target.value)
          }
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={config?.onColumn1}
        />
        {"="}
        <Dropdown
          values={joinColumns}
          handlerFunction={(e) =>
            handleConfigChange("onColumn2", e.target.value)
          }
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={config?.onColumn2}
        />
      </>
    );
  }

  function Conditions() {
    const [dropdowns, setDropdowns] = useState([]); // Unique ID

    function addDropdown() {
      setDropdowns((prev) => [...prev, Date.now() + Math.random()]);
    }

    function removeDropdown(idToRemove) {
      setDropdowns((prev) => prev.filter((id) => id !== idToRemove));
    }

    function handleChange(){}

    return (
      <>
        {dropdowns.length > 0 &&
          dropdowns.map((id, index) => (
            <div key={id} className="condition_selector">
              <Dropdown
                values={["AND", "OR"]}
                handlerFunction={(e) =>
                  handleConfigChange("whereConditions", e.target.value)
                }
                selectedValue={config?.whereConditions}
                isMultiselectable={false}
                cssClass={"mb-1"}
              />
              <Dropdown
                values={computedColumns}
                handlerFunction={handleChange}
                isMultiselectable={false}
                cssClass={"mb-1"}
              />
              {"="}
              <input
                placeholder="Enter value here"
                className="configuration_select"
                type="text"
              />
              {/*prettier-ignore*/}
              <button className="column_controls" onClick={() => removeDropdown(id)}>-</button>
            </div>
          ))}
        {/*prettier-ignore*/}
        <button className="whereconditions_btn" onClick={addDropdown}>Add Condition</button>
      </>
    );
  }

  function handleConfigChange(field, value) {
    dispatcher({
      type: "UPDATE/CLAUSE_CONFIG",
      payload: {
        id,
        config: { [field]: value },
      },
    });
  }
}
