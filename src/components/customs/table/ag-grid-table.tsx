"use client";

import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AgGridTableProps<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: T[];
    columnDefs: ColDef<T>[];
    paginationPageSize?: number;
    paginationPageSizeSelector?: number[];
}

const AgGridTable = <T,>({
    rowData,
    columnDefs,
    paginationPageSize = 20,
    paginationPageSizeSelector = [20, 30],
}: AgGridTableProps<T>) => {
    const defaultColDef = useMemo(() => {
        return {
            filter: "agTextColumnFilter",
            floatingFilter: true,
        };
    }, []);

    const rowSelection: RowSelectionOptions = {
        mode: "multiRow",

        headerCheckbox: true,
    };

    const myTheme = themeQuartz.withParams({
        spacing: 10,
        browserColorScheme: "light",
        fontFamily: {
            googleFont: "inter",
        },
        headerFontSize: 14,
        iconSize: 16,
    });

    return (
        <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            selectionColumnDef={{
                pinned: "left",
            }}
            pagination={true}
            theme={myTheme}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
        />
    );
};

export default AgGridTable;
