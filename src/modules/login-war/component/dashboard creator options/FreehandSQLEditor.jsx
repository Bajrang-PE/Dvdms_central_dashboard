import { useContext, useRef } from "react";
import Editor from "@monaco-editor/react";
import SQLExecutionButton from "./SQLBuilderSelectors/SQLExecutionButton";
import { executeSqlQuery } from "../../utils/CommonFunction";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import { HISContext } from "../../../his-utils/contextApi/HISContext";

export default function FreehandSQLEditor() {
  const editorRef = useRef(null);
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();
  const { setLoading } = useContext(HISContext);

  // Function called when the Monaco Editor mounts
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  async function handleExecute() {
    if (editorRef.current) {
      setLoading(true);
      const query = editorRef.current.getValue();
      console.log("SQL Query Entered:", query);

      dispatcher({ type: "SET/SQLQUERY", payload: query });

      const response = await executeSqlQuery(query);
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
      setTimeout(() => {
        window.scrollTo({
          top: window.scrollY + 500,
          behavior: "smooth",
        });
      }, 0);
    }
  }

  return (
    <>
      <h5 className="sql_editor--text">
        No need to map tables, Simply write and execute your query here
      </h5>
      <div className="sql__container">
        <div className="sql_editor-freehand">
          <Editor
            height="200px"
            defaultLanguage="sql"
            defaultValue="SELECT * FROM users;"
            theme="light"
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
      <SQLExecutionButton
        handlerFunction={handleExecute}
        buttonText={"Execute"}
      />
    </>
  );
}
