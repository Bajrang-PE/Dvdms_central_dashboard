import CanvasJSReact from "@canvasjs/react-charts";

const { CanvasJSChart } = CanvasJSReact;
export default function StandaloneChart({ optionsFunction }) {
  return (
    <div className="chart__container">
      <CanvasJSChart options={optionsFunction} />
    </div>
  );
}
