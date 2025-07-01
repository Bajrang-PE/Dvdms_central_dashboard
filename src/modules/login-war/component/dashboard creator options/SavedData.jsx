import { useMemo } from "react";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import SavedWidgits from "./SavedWidgits";
import SavedTabs from "./SavedTabs";
import RadioOptions from "./RadioOptions";

//View Options
const options = [
  { value: "viewWidgits", label: "View Widgits" },
  { value: "viewTabs", label: "View Tabs" },
];

export default function SavedData() {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();
  const selectedState = dashboardState.dashboardState;

  //prettier-ignore
  const currentlySelectedOption =  selectedState === "" ? "viewWidgits" : selectedState;

  const ComputeActiveComponent = useMemo(() => {
    switch (currentlySelectedOption) {
      case "viewWidgits":
        return <SavedWidgits />;
      case "viewTabs":
        return <SavedTabs />;
      default:
        return null;
    }
  }, [currentlySelectedOption]);

  return (
    <>
      <RadioOptions options={options} defaultOption={currentlySelectedOption} />
      {ComputeActiveComponent}
    </>
  );
}
