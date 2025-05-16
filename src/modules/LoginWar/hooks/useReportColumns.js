import { useMemo } from 'react';

const useReportColumns = (originalColumns) => {
    const reportColumns = useMemo(() => {
        if (!originalColumns || originalColumns.length === 0) return [];

        return [
            {
                name: 'S.No',
                selector: (row, index) => index + 1,
                width: '8%',
                sortable: true,
            },
            ...originalColumns.slice(1), 
        ];
    }, [originalColumns]);

    return reportColumns;
};

export default useReportColumns;
