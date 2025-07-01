import { useReducer } from "react";
import Dropdown from "../Dropdown";
import ConditionalClauseRender from "../ConditionalClauseRender";
import useDashboard from "../../../../his-utils/contextApi/useDashboardHook";

const clausesArray = [
  "WHERE",
  "ORDER BY",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
];

function sqlClauseReducer(state, action) {
  switch (action.type) {
    case "ADD/CLAUSE":
      return {
        ...state,
        clauses: [
          ...state.clauses,
          { id: action.payload.id, selectedClause: "", config: {} },
        ],
      };

    case "UPDATE/CLAUSE":
      return {
        ...state,
        clauses: state.clauses.map((clause) =>
          clause.id === action.payload.id
            ? { ...clause, selectedClause: action.payload.selectedClause }
            : clause
        ),
      };

    case "REMOVE/CLAUSE":
      return {
        ...state,
        clauses: state.clauses.filter(
          (clause) => clause.id !== action.payload.id
        ),
      };

    case "UPDATE/CLAUSE_CONFIG":
      return {
        ...state,
        clauses: state.clauses.map((clause) =>
          clause.id === action.payload.id
            ? {
                ...clause,
                config: { ...clause.config, ...action.payload.config },
              }
            : clause
        ),
      };

    default:
      return state;
  }
}

export default function ClauseSelector() {
  const initialState = {
    clauses: [],
  };
  const [clauseState, dispatcher] = useReducer(sqlClauseReducer, initialState);

  //eslint-disable-next-line
  const { dispatch, dashboardState } = useDashboard();
  const tables = dashboardState.clusterTables;

  function handleChange(e, id) {
    e.preventDefault();
    const selectedClause = e.target.value;

    //prettier-ignore
    dispatcher({type: "UPDATE/CLAUSE", payload: { id, selectedClause },});
  }

  function showClauseSelector() {
    const id = Date.now() + Math.random();
    dispatcher({
      type: "ADD/CLAUSE",
      payload: { id },
    });
  }

  function removeDropdown(id) {
    dispatcher({
      type: "REMOVE/CLAUSE",
      payload: { id },
    });
  }

  return (
    <>
      {clauseState.clauses.map(({ id, selectedClause, config }) => (
        <div key={id} className="sql_clauseSelector">
          <div className="sql_clauseSelector-dropdown">
            <Dropdown
              values={clausesArray}
              handlerFunction={(e) => handleChange(e, id)}
              multiSelectOption={""}
              isMultiselectable={false}
              cssClass={"mb-1"}
            />
            <button
              className="column_controls"
              onClick={() => removeDropdown(id)}
            >
              -
            </button>
          </div>
          <ConditionalClauseRender
            key={id}
            id={id}
            renderState={selectedClause}
            tables={tables}
            config={config}
            dispatcher={dispatcher}
          />
        </div>
      ))}
      {/*prettier-ignore*/}
      <button className="clause_control" onClick={showClauseSelector}>Add Clause</button>
    </>
  );
}
