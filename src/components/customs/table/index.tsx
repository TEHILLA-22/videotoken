import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ReactNode } from "react";

interface ReusableTableProps {
    headers: string[];
    data: { [key: string]: ReactNode }[];
}

const ReusableTable: React.FC<ReusableTableProps> = ({ headers, data }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-[#F5F5F5]/25">
                    {headers.map((header, index) => (
                        <TableHead key={index} className="w-[100px] text-[#F5F5F5]/50">
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="border-[#F5F5F5]/25 py-2">
                        {Object.values(row).map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className={`font-medium  ${row.side === "Buy" && cellIndex === 0 ? "text-green-500" : row.side === "Sell" && cellIndex === 0 ? "text-red-500" : ""}`}>
                                {cell}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ReusableTable;
