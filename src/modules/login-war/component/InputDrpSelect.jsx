import React from 'react';
import DropdownSelect from 'react-dropdown-select';

const InputDrpSelect = ({
    id,
    name,
    value,
    options = [],
    onChange,
    onBlur = null,
    onFocus = null,
    disabled = false,
    className,
    style,
    errorMessage,
    placeholder = "Select...",
    multiple = false,
    searchable,
    clearable = false,
    loading = false,
}) => {

    const getSelectedValues = (value) => {
        if (!value) return [];

        if (multiple && Array.isArray(value)) {
            return options.filter(option => value.includes(option.value));
        }

        if (!multiple && value) {
            const selectedOption = options.find(option => option.value == value);
            return selectedOption ? [selectedOption] : [];
        }

        return [];
    };

    // const handleChange = (selectedItems) => {
    //     if (onChange) {
    //         const newValue = multiple
    //             ? selectedItems.map(item => item.value)
    //             : selectedItems[0]?.value || '';

    //         const event = {
    //             target: {
    //                 name: name,
    //                 value: newValue
    //             }
    //         };
    //         onChange(event);
    //     }
    // };


    return (
        <>
            <DropdownSelect
                key={id}
                id={id}
                name={name}
                values={getSelectedValues(value)}
                options={options}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                loading={loading}
                searchable={searchable}
                clearable={clearable}
                multi={multiple}
                placeholder={placeholder}
                className={`form-select form-select-sm ${className}`}
                // color="#0d6efd"
                dropdownHandle={false}
            // dropdownHeight='0px'

            />

            {errorMessage && (
                <div className="required-input mt-1">
                    {errorMessage}
                </div>
            )}
        </>
    );
};

export default InputDrpSelect;