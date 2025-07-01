import { useContext, useMemo } from "react";
import ColumnSelector from "./ColumnSelector";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import TableSelector from "./SQLBuilderSelectors/TableSelector";
import JoiningSuggestions from "./SQLBuilderSelectors/JoiningConditions";
import ClauseSelector from "./SQLBuilderSelectors/ClauseSelector";
import QueryExecutionPanel from "./SQLBuilderSelectors/QueryExecutionPanel";
import { HISContext } from "../../../his-utils/contextApi/HISContext";
import { executeSqlQuery } from "../../utils/CommonFunction";

export default function SQLBuilderTool() {
  const { dispatcher, dashboardState } = useDashboard();

  const clusterTables = dashboardState.mappedTables;

  //Prevents Wasted Renders
  const tables = useMemo(() => {
    return clusterTables.length ? clusterTables : ["NA"];
  }, [clusterTables]);

  console.log(dashboardState.columns);

  const columnsFromAPI = useMemo(() => {
    return dashboardState.columns;
  }, [dashboardState.columns]);

  const selectedTable = useMemo(() => {
    return dashboardState.selectedTable;
  }, [dashboardState.selectedTable]);

  return (
    <>
      <h5 className="sql_editor--text">Start Building SQL</h5>
      <div className="sql__container">
        <SQLBuilder>
          {/*prettier-ignore*/}
          <TableSelector dispatcher={dispatcher} tables={tables} columnsAPIData={columnsFromAPI} selectedValue={selectedTable}/>
          {/*prettier-ignore*/}
          <ClauseSelector />
        </SQLBuilder>
        <JoiningSuggestions />
      </div>
      <SQLEditorControls />
    </>
  );

  function SQLBuilder({ children }) {
    return (
      <div className="sql_editor-builder">
        <div className="sql_builder-editor">
          <h6 className="sql_identifiers">SELECT</h6>
          {/*prettier-ignore*/}
          <ColumnSelector isMultiselectable={true}/>
          <h6 className="sql_identifiers">FROM</h6>
          {children}
        </div>
      </div>
    );
  }

  function SQLEditorControls() {
    const sqlQuery = dashboardState.sqlQuery;
    const { setLoading } = useContext(HISContext);

    async function handleSQLExecution() {
      const sqlBuilderArray = [];
      //prettier-ignore
      document.querySelectorAll(".configuration_select").forEach((data) => sqlBuilderArray.push(data.value === "all" ? "*" : data.value));

      const sqlParserResult = sqlParser(sqlBuilderArray);
      dispatcher({ type: "SET/SQLQUERY", payload: sqlParserResult });
      setLoading(true);
      const response = await executeSqlQuery(sqlParserResult);
      setLoading(false);

      console.log(response);
      if (response.data) {
        const { columns, rows } = response.data;
        let arrayOfSelectedColumns = [];
        columns.map((data) => arrayOfSelectedColumns.push(data.key));
        dispatcher({ type: "FETCH/COLUMNS", payload: columns });
        dispatcher({ type: "FETCH/DATA", payload: rows });
        dispatcher({ type: "SET/SQLERROR", payload: "" });

        //prettier-ignore
        dispatcher({type: "SET/DASHBOARD-COLUMNS", payload: arrayOfSelectedColumns});
      } else {
        dispatcher({ type: "SET/SQLERROR", payload: response.message });
      }
    }

    return (
      <>
        <QueryExecutionPanel query={sqlQuery} />
        <div className="control_box">
          <button className="execute_button" onClick={handleSQLExecution}>
            Execute
          </button>
          <button className="clear_button">Link Parent Widgit</button>
        </div>
      </>
    );
  }
}

function sqlParser(tokens) {
  const clauseKeywords = [
    "WHERE",
    "ORDER BY",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
  ];

  const clauses = {
    SELECT: [],
    FROM: "",
    JOINS: [],
    WHERE: [],
    ORDERBY: [],
  };

  let current = "SELECT";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1] || "";
    const combined = `${token} ${nextToken}`.toUpperCase();

    // Check for 2-word clauses first
    if (clauseKeywords.includes(combined)) {
      current = combined;
      i++; // skip next token
      continue;
    }

    // Check for single-word clauses
    if (clauseKeywords.includes(token.toUpperCase())) {
      current = token.toUpperCase();
      continue;
    }

    // Assign tokens to the correct clause bucket
    switch (current) {
      case "SELECT":
        if (token.includes(".")) {
          clauses.FROM = token;
          current = null; // wait for a clause
        } else {
          clauses.SELECT.push(token);
        }
        break;

      case "INNER JOIN":
      case "LEFT JOIN":
      case "RIGHT JOIN": {
        const joinTable = token;
        const leftOn = tokens[i + 1];
        const rightOn = tokens[i + 2];
        if (leftOn && rightOn) {
          clauses.JOINS.push(
            `${current} ${joinTable} ON ${leftOn} = ${rightOn}`
          );
          i += 2; // Skip the next two tokens
        } else {
          clauses.JOINS.push(`${current} ${joinTable}`); // fallback if incomplete
        }
        current = null;
        break;
      }

      case "WHERE":
        clauses.WHERE.push(token);
        break;

      case "ORDER BY":
        clauses.ORDERBY.push(token);
        break;
    }
  }

  // --- Build query parts ---
  const selectPart = `SELECT ${clauses.SELECT.join(", ")}`;
  const fromPart = `FROM ${clauses.FROM}`;
  const joinParts = clauses.JOINS.join(" ");
  const wherePart = clauses.WHERE.length
    ? `WHERE ${convertConditions(clauses.WHERE)}`
    : "";
  const orderByPart = clauses.ORDERBY.length
    ? `ORDER BY ${clauses.ORDERBY.join(" ")}`
    : "";

  return [selectPart, fromPart, joinParts, wherePart, orderByPart]
    .filter(Boolean)
    .join(" ");
}

function convertConditions(conditions) {
  let result = [];
  for (let i = 0; i < conditions.length; i++) {
    const token = conditions[i].toUpperCase();
    if (token === "AND" || token === "OR") {
      result.push(token);
    } else {
      const column = conditions[i];
      const value = conditions[i + 1];
      if (value === undefined) break;
      result.push(`${column} = '${value}'`);
      i++; // Skip value token
    }
  }
  return result.join(" ");
}
