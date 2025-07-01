import TableComponent from "./TableComponent";

const columns = [
  { label: "#", key: "id" },
  { label: "Name", key: "name" },
  { label: "Time Created", key: "date" },
];

const data = [
  {
    id: 1,
    name: "SELECT * FROM users",
    date: "2025-05-30",
  },
];

export default function QueryLog() {
  return (
    <div className="querylog_container">
      <TableComponent
        dataArray={data}
        columnsArray={columns}
        title="Query Log"
        message=""
      />
    </div>
  );
}
