import { useMemo } from 'react';

const useReportColumns = (originalColumns) => {
    const reportColumns = useMemo(() => {
        if (!originalColumns || originalColumns.length === 0) return [];

        console.log('originalColumns', originalColumns)

        return [
            {
                name: 'S.No',
                selector: (row, index) => index + 1,
                width: '8%',
                sortable: true,
            },
            ...(originalColumns[0]?.name?.type === 'input'
                ? originalColumns.slice(1)
                : originalColumns),
            //    originalColumns[0]?.name?.type === 'input' ? ...originalColumns.slice(1) : originalColumns, 
        ];
    }, [originalColumns]);

    return reportColumns;
};

export default useReportColumns;
