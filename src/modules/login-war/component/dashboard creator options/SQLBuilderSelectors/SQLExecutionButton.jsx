export default function SQLExecutionButton({ handlerFunction, buttonText }) {
  return (
    <div className="control_box">
      <button className="execute_button" onClick={handlerFunction}>
        {buttonText}
      </button>
    </div>
  );
}
