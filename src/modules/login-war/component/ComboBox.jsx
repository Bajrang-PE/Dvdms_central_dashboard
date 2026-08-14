import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
} from 'react';

import './ComboBox.css';

export const ComboBox = ({
    options = [],
    value = null,
    onChange,
    isMulti = false,
    isSearchable = true,
    placeholder = 'Select option...',
    itemHeight = 38,
    dropdownHeight = 260,
    disabled = false,
    overscan = 5,
    renderOption,
    renderValue,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [scrollTop, setScrollTop] = useState(0);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const containerRef = useRef(null);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    // FIX #1: Sync scroll state and reset scroll position whenever dropdown opens
    useEffect(() => {
        if (isOpen) {
            setScrollTop(0);
            setFocusedIndex(-1);
            if (listRef.current) {
                listRef.current.scrollTop = 0;
            }
        }
    }, [isOpen]);

    // Reset scroll when searching
    useEffect(() => {
        setScrollTop(0);
        setFocusedIndex(-1);
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    // Normalize selected values into an array
    const selectedValues = useMemo(() => {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    }, [value]);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;
        const query = searchTerm.toLowerCase();
        return options.filter((opt) =>
            String(opt.label).toLowerCase().includes(query)
        );
    }, [options, searchTerm]);

    // Virtualization calculations
    const totalHeight = filteredOptions.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        filteredOptions.length,
        Math.ceil((scrollTop + dropdownHeight) / itemHeight) + overscan
    );
    const visibleOptions = filteredOptions.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard scroll synchronization
    const scrollToFocused = useCallback(
        (index) => {
            if (!listRef.current) return;
            const itemTop = index * itemHeight;
            const itemBottom = itemTop + itemHeight;
            const currentScrollTop = listRef.current.scrollTop;
            const currentScrollBottom = currentScrollTop + dropdownHeight;

            if (itemTop < currentScrollTop) {
                listRef.current.scrollTop = itemTop;
            } else if (itemBottom > currentScrollBottom) {
                listRef.current.scrollTop = itemBottom - dropdownHeight;
            }
        },
        [itemHeight, dropdownHeight]
    );

    const toggleOption = useCallback(
        (option) => {
            if (option.disabled) return;

            if (isMulti) {
                const isAlreadySelected = selectedValues.some(
                    (v) => v.value === option.value
                );
                let updated;
                if (isAlreadySelected) {
                    updated = selectedValues.filter((v) => v.value !== option.value);
                } else {
                    updated = [...selectedValues, option];
                }
                onChange?.(updated);
            } else {
                onChange?.(option);
                setIsOpen(false);
            }
        },
        [isMulti, selectedValues, onChange]
    );

    const removeSingleValue = (e, optionToRemove) => {
        e.stopPropagation();
        if (!isMulti) return;
        const updated = selectedValues.filter((v) => v.value !== optionToRemove.value);
        onChange?.(updated);
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        onChange?.(isMulti ? [] : null);
        setSearchTerm('');
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        if (!isOpen) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
                    scrollToFocused(next);
                    return next;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
                    scrollToFocused(next);
                    return next;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                    toggleOption(filteredOptions[focusedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            case 'Tab':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const handleScroll = (e) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            className={`v-combobox ${disabled ? 'v-combobox-disabled' : ''} ${className}`}
            style={{ position: 'relative', width: '100%', outline: 'none' }}
        >
            {/* Control Box Header */}
            <div
                className="v-combobox-control"
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
            >
                <div className="v-combobox-value-container">
                    {renderValue ? (
                        renderValue(isMulti ? selectedValues : selectedValues[0])
                    ) : selectedValues.length > 0 ? (
                        isMulti ? (
                            <div className="v-combobox-chips">
                                {selectedValues.map((opt) => (
                                    <span key={opt.value} className="v-combobox-chip" title={opt.label}>
                                        <span className="v-combobox-chip-text">{opt.label}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => removeSingleValue(e, opt)}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="v-combobox-single-val" title={selectedValues[0].label}>
                                {selectedValues[0].label}
                            </span>
                        )
                    ) : (
                        <span className="v-combobox-placeholder">{placeholder}</span>
                    )}
                </div>

                <div className="v-combobox-actions">
                    {selectedValues.length > 0 && !disabled && (
                        <button
                            type="button"
                            className="v-combobox-clear"
                            onClick={handleClearAll}
                            title="Clear selection"
                        >
                            &times;
                        </button>
                    )}
                    <span className={`v-combobox-arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="v-combobox-dropdown">
                    {isSearchable && (
                        <div className="v-combobox-search-box">
                            <input
                                ref={inputRef}
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div
                        ref={listRef}
                        className="v-combobox-viewport"
                        style={{ height: `${dropdownHeight}px`, overflowY: 'auto' }}
                        onScroll={handleScroll}
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="v-combobox-no-options">No options found</div>
                        ) : (
                            <div
                                style={{
                                    height: `${totalHeight}px`,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        transform: `translateY(${offsetY}px)`,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                    }}
                                >
                                    {visibleOptions.map((option, idx) => {
                                        const actualIndex = startIndex + idx;
                                        const isSelected = selectedValues.some(
                                            (v) => v.value === option.value
                                        );
                                        const isFocused = actualIndex === focusedIndex;

                                        return (
                                            <div
                                                key={option.value}
                                                style={{
                                                    height: `${itemHeight}px`,
                                                }}
                                                className={`v-combobox-option ${isSelected ? 'selected' : ''
                                                    } ${isFocused ? 'focused' : ''} ${option.disabled ? 'disabled' : ''
                                                    }`}
                                                onClick={() => toggleOption(option)}
                                                onMouseEnter={() => setFocusedIndex(actualIndex)}
                                                title={option.label}
                                            >
                                                {renderOption ? (
                                                    renderOption(option, isSelected)
                                                ) : (
                                                    <div className="v-combobox-option-content">
                                                        {isMulti && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                readOnly
                                                                tabIndex={-1}
                                                            />
                                                        )}
                                                        <span className="v-combobox-label">
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};