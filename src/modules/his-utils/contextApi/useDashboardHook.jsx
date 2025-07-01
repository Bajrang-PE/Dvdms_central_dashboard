import { useContext } from "react";
import { DashboardContext } from "./DashboardConfigContext";

export default function useDashboard() {
  return useContext(DashboardContext);
}
