import useDashboard from "../../../../his-utils/contextApi/useDashboardHook";

export default function JoiningSuggestions() {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();

  let joiningCondition;
  switch (dashboardState.joinConditions.length) {
    case 0:
      joiningCondition = ["Not Applicable"];
      break;
    default:
      joiningCondition = dashboardState.joinConditions;
  }

  const suggestedJoins = groupColumns(joiningCondition);

  return (
    <div className="sql_suggestions">
      <h6 className="sql_suggestions--text">Suggested Joins</h6>
      {Object.entries(suggestedJoins).length === 0 ? (
        <p className="sql_suggestions--para">No common columns found.</p>
      ) : (
        <ul className="sql_suggestions--list">
          {Object.entries(suggestedJoins).map(([pair, cols]) => (
            <li key={pair} className="sql_suggestions--item">
              <br />
              <strong>{pair}</strong>
              <br /> ON {cols.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function groupColumns(cols) {
  // 1) Build column → [tables...] map
  const colToTables = cols.reduce((acc, full) => {
    const [table, col] = full.split(".");
    acc[col] = acc[col] || [];
    if (!acc[col].includes(table)) acc[col].push(table);
    return acc;
  }, {});

  // 2) Filter to only “common” columns (appearing in >1 table)
  const commonCols = Object.fromEntries(
    //eslint-disable-next-line
    Object.entries(colToTables).filter(([col, tables]) => tables.length > 1)
  );

  // 3) Build table-pair → [shared columns...] map
  const pairToCols = {};
  for (const [col, tables] of Object.entries(commonCols)) {
    for (let i = 0; i < tables.length; i++) {
      for (let j = i + 1; j < tables.length; j++) {
        // sort so “A&B” and “B&A” don’t become two keys
        const pairKey = [tables[i], tables[j]].sort().join(" & ");
        pairToCols[pairKey] = pairToCols[pairKey] || [];
        pairToCols[pairKey].push(col);
      }
    }
  }

  return pairToCols;
}
