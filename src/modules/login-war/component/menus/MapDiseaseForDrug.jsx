import React, { useEffect, useState } from 'react';
import { fetchData } from '../../../../utils/ApiHooks';
import InputSelect from '../InputSelect';

const MapDiseaseForDrug = (props) => {
    const { diseaseCatDrpData, setValues, values, openPage } = props;

    const [disCat, setDisCat] = useState('');
    const [diseaseList, setDiseaseList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    // Temporarily checked items in the left panel before hitting "Add"
    const [tempCheckedIds, setTempCheckedIds] = useState([]);

    // Final selected state organized as key-value pairs:
    // { [categoryId]: { categoryName: "...", diseases: [ { diseaseId, diseaseName }, ... ] } }
    const [selectedGrouped, setSelectedGrouped] = useState(
        values?.mappedDiseases || {}
    );

    // Fetch API data when category changes
    useEffect(() => {
        if (disCat) {
            setLoading(true);
            fetchData(`/api/v1/disease/list?diseaseCategoryId=${disCat}&isValid=1`)
                ?.then((res) => {
                    if (res?.status === 1) {
                        setDiseaseList(res?.data || []);
                    } else {
                        setDiseaseList([]);
                    }
                })
                .catch((error) => console.error('Failed to fetch diseases:', error))
                .finally(() => setLoading(false));
        } else {
            setDiseaseList([]);
        }
        setTempCheckedIds([]);
        setSearchTerm('');
    }, [disCat]);

    // Sync state upward to parent component whenever selection changes
    useEffect(() => {
        if (setValues) {
            setValues((prev) => ({
                ...prev,
                mappedDiseases: selectedGrouped
            }));
        }
    }, [selectedGrouped, setValues]);

    // Current category name label helper
    const currentCategoryObj = diseaseCatDrpData?.find(
        (item) => String(item.value || item.id) === String(disCat)
    );
    const currentCategoryName = currentCategoryObj?.label || 'Selected Category';

    // Toggle individual checkbox on the left panel
    const handleTempCheck = (disease) => {
        setTempCheckedIds((prev) =>
            prev.includes(disease.diseaseId)
                ? prev.filter((id) => id !== disease.diseaseId)
                : [...prev, disease.diseaseId]
        );
    };

    // Check/Uncheck All in current category list
    const handleSelectAll = () => {
        const filteredIds = filteredDiseaseList?.map((d) => d.diseaseId);
        const allChecked = filteredIds?.every((id) => tempCheckedIds?.includes(id));

        if (allChecked) {
            setTempCheckedIds((prev) => prev?.filter((id) => !filteredIds?.includes(id)));
        } else {
            setTempCheckedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
        }
    };

    // Add checked diseases from left panel to selected state on right panel
    const handleAddDiseases = () => {
        if (!disCat || tempCheckedIds.length === 0) return;

        const itemsToAdd = diseaseList?.filter((d) =>
            tempCheckedIds?.includes(d.diseaseId)
        );

        setSelectedGrouped((prev) => {
            const existingCategory = prev[disCat] || {
                categoryName: currentCategoryName,
                diseases: [],
            };

            // Deduplicate items
            const existingIds = new Set(existingCategory?.diseases?.map((d) => d.diseaseId));
            const newUniqueDiseases = [
                ...existingCategory.diseases,
                ...itemsToAdd?.filter((item) => !existingIds?.has(item.diseaseId)),
            ];

            return {
                ...prev,
                [disCat]: {
                    categoryName: currentCategoryName,
                    diseases: newUniqueDiseases,
                },
            };
        });

        // Reset temporary checks after adding
        setTempCheckedIds([]);
    };

    // Remove single disease from selected list (right panel)
    const handleRemoveDisease = (catId, diseaseId) => {
        setSelectedGrouped((prev) => {
            const category = prev[catId];
            if (!category) return prev;

            const updatedDiseases = category.diseases.filter(
                (d) => d.diseaseId !== diseaseId
            );

            // If category has no diseases left, cleanup the category object
            if (updatedDiseases.length === 0) {
                const copy = { ...prev };
                delete copy[catId];
                return copy;
            }

            return {
                ...prev,
                [catId]: {
                    ...category,
                    diseases: updatedDiseases,
                },
            };
        });
    };

    // Clear an entire category group
    const handleClearCategoryGroup = (catId) => {
        setSelectedGrouped((prev) => {
            const copy = { ...prev };
            delete copy[catId];
            return copy;
        });
    };

    // Helper: check if disease is already added on the right side
    const isAlreadyAdded = (diseaseId) => {
        if (!disCat || !selectedGrouped[disCat]) return false;
        return selectedGrouped[disCat].diseases.some(
            (d) => d.diseaseId === diseaseId
        );
    };

    // Filter list by local search
    const filteredDiseaseList = diseaseList.filter((d) =>
        d.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="">
            {/* Category Dropdown Selection */}

            {openPage === "add" &&
                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label fix-label required-label">Disease Category :</label>
                    <div className="col-sm-6">
                        <InputSelect
                            id="diseaseCategory"
                            name="diseaseCategory"
                            placeholder="Choose a category..."
                            options={diseaseCatDrpData}
                            onChange={(e) => setDisCat(e?.target?.value)}
                            value={disCat}
                        />
                    </div>
                </div>
            }

            <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                <div className="px-1 text-primary fw-bold fs-13">
                    Drug Used for following Disease
                </div>
                <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
            </div>

            {/* Main Dual-Panel Layout */}
            <div className="row g-3">
                {/* Left Side: Available Diseases */}
                {openPage === "add" &&
                    <div className="col-md-5">
                        <div className="border rounded-3 h-100 bg-light-subtle d-flex flex-column">
                            <div className="p-2 border-bottom bg-white rounded-top-3 d-flex justify-content-between align-items-center">
                                <span className="fw-semibold text-dark">
                                    Available Diseases
                                </span>
                                {filteredDiseaseList.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm p-0 text-decoration-none"
                                        onClick={handleSelectAll}
                                    >
                                        Select All
                                    </button>
                                )}
                            </div>

                            {/* Search Filter */}
                            {disCat && (
                                <div className="p-2 border-bottom bg-white">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search diseases..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Checkbox List */}
                            <div className="p-2 flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                                {!disCat ? (
                                    <div className="text-center text-muted py-4 fs-7">
                                        Please select a category above to view diseases.
                                    </div>
                                ) : loading ? (
                                    <div className="text-center text-primary py-4">
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Loading diseases...
                                    </div>
                                ) : filteredDiseaseList.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        No diseases found for this category.
                                    </div>
                                ) : (
                                    filteredDiseaseList.map((dis) => {
                                        const added = isAlreadyAdded(dis.diseaseId);
                                        const isChecked = tempCheckedIds.includes(dis.diseaseId);

                                        return (
                                            <div
                                                className={`form-check py-2 rounded mb-1 d-flex align-items-center justify-content-between ${added ? 'bg-success-subtle text-muted' : 'hover-bg-light'
                                                    }`}
                                                key={dis.diseaseId}
                                            >
                                                <div>
                                                    <input
                                                        className="form-check-input me-2"
                                                        type="checkbox"
                                                        disabled={added}
                                                        checked={isChecked || added}
                                                        id={`disease_${dis.diseaseId}`}
                                                        onChange={() => handleTempCheck(dis)}
                                                    />
                                                    <label
                                                        className={`form-check-label user-select-none ${added ? 'text-decoration-line-through' : ''
                                                            }`}
                                                        htmlFor={`disease_${dis.diseaseId}`}
                                                    >
                                                        {dis.diseaseName}
                                                    </label>
                                                </div>
                                                {added && (
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                                        Added
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                }

                {/* Center Transfer Action */}
                {openPage === "add" &&
                    <div className="col-md-2 d-flex align-items-center justify-content-center my-md-0">
                        <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center gap-1"
                            onClick={handleAddDiseases}
                            disabled={!disCat || tempCheckedIds.length === 0}
                        >
                            Add Disease
                            <i className="fa fa-chevron-right ms-1 d-none d-md-inline"></i>
                        </button>
                    </div>
                }

                {/* Right Side: Selected Grouped Diseases */}
                <div className="col-md-5">
                    <div className="border rounded-3 h-100 bg-light-subtle d-flex flex-column">
                        <div className="p-2 border-bottom bg-white rounded-top-3 d-flex justify-content-between align-items-center">
                            <span className="fw-semibold text-dark">Mapped Diseases</span>
                            <span className="badge bg-primary rounded-pill">
                                {Object.values(selectedGrouped)?.reduce(
                                    (acc, cur) => acc + cur?.diseases?.length,
                                    0
                                )}{' '}
                                Items
                            </span>
                        </div>

                        <div className="p-3 flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                            {Object.keys(selectedGrouped).length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    No diseases selected yet.
                                </div>
                            ) : (
                                Object.entries(selectedGrouped)?.map(([catId, group]) => (
                                    <div key={catId} className="card border mb-3 shadow-sm">
                                        <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                                            <span className="fw-bold text-primary fs-7">
                                                {group?.categoryName}
                                            </span>
                                            {openPage === "add" &&
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm border-0 py-0 px-1"
                                                    title="Remove Category Group"
                                                    onClick={() => handleClearCategoryGroup(catId)}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>}
                                        </div>
                                        <div className="card-body p-2 bg-white">
                                            <div className="d-flex flex-wrap gap-1">
                                                {group?.diseases?.map((dis) => (
                                                    <span
                                                        key={dis?.diseaseId}
                                                        className="badge bg-light text-dark border d-flex align-items-center gap-1 p-2"
                                                    >
                                                        {dis?.diseaseName}
                                                        {openPage === "add" &&
                                                            <i
                                                                className="fa fa-times text-danger ms-1 cursor-pointer"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() =>
                                                                    handleRemoveDisease(catId, dis?.diseaseId)
                                                                }
                                                            ></i>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {openPage === "modify" &&
                            <span className="badge bg-info-subtle text-dark required-label fs-13 fw-medium text-start">
                                <i> To modify mapped disease, please visit Disease Drug Mapping Master.</i>
                            </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapDiseaseForDrug;