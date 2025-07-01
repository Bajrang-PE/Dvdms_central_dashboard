export default function Dropdown({
  values,
  handlerFunction,
  dropDownName,
  isMultiselectable,
  multiSelectOption,
  cssClass,
  selectedValue, // used to control dropdown
}) {
  return (
    <div className={cssClass}>
      <h5>{dropDownName}</h5>
      <select
        className="configuration_select"
        value={selectedValue}
        onChange={handlerFunction}
      >
        {isMultiselectable && <option value="all">{multiSelectOption}</option>}
        {values.map((schema) => (
          <option key={schema} value={schema}>
            {schema}
          </option>
        ))}
      </select>
    </div>
  );
}
