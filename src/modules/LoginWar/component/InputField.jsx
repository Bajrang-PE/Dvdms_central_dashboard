import React from 'react';

const InputField = ({
    id,
    name,
    value,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    disabled,
    maxLength,
    required,
    readOnly,
    className,
    style,
    errorMessage,
    type,
    onClick,
    acceptType

}) => {
    return (
        <>
            <input
                type={type ? type : "text"}
                id={id}
                name={name}
                value={acceptType === "number"  ? value?.toString().replace(/[^0-9]/g, '') : value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                maxLength={maxLength}
                required={required}
                readOnly={readOnly}
                className={`form-control form-control-sm ${className}`}
                style={style}
                autoComplete='off'
                onClick={onClick}
            />
            {errorMessage &&
                <div className="required-input">
                    {errorMessage}
                </div>
            }
        </>
    );
};

export default InputField;