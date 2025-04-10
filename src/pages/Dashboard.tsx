import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import ExtendedSearch from "./ExtendedSearch";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const MemoizedTableCell = memo(({ 
  rowIndex, 
  colIndex, 
  content, 
  isSelected, 
  onClick 
}: {
  rowIndex: number;
  colIndex: number;
  content: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <TableCell
      id={`cell-${rowIndex}-${colIndex}`}
      onClick={onClick}
      sx={{ 
        border: '1px solid #999',
        padding: '8px',
        textAlign: 'center',
        fontSize: '12px',
        backgroundColor: isSelected ? '#1565c0' : 'inherit',
        color: isSelected ? 'white' : 'inherit',
      }}
    >
      {content}
    </TableCell>
  );
});

const MemoizedTableRow = memo(({ 
  row, 
  rowIndex, 
  columns, 
  selectedCell, 
  setSelectedCell 
}: {
  row: any;
  rowIndex: number;
  columns: string[];
  selectedCell: { row: number; col: number };
  setSelectedCell: (cell: { row: number; col: number }) => void;
}) => {
  const towInfo = row.towdrive?.[0] || {};
  const invoice = row.invoices?.[0] || {};
  const isRowSelected = selectedCell.row === rowIndex;

  return (
    <TableRow sx={{ 
      '&:hover': { backgroundColor: '#f5f5f5' },
      position: 'relative'
    }}>
      <TableCell
        sx={{
          width: '24px',
          padding: 0,
          border: '1px solid #999',
          position: 'relative',
          '&::before': isRowSelected ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid black',
          } : {}
        }}
      />

      {columns.map((_, colIndex) => {
        let cellContent = '';
        switch(colIndex) {
          case 0: cellContent = row.dispnum; break;
          case 1: cellContent = row.towdate ? new Date(row.towdate).toLocaleDateString() : ''; break;
          case 2: cellContent = row.towedfrom; break;
          case 3: cellContent = row.towedto; break;
          case 4: cellContent = row.licensenum; break;
          case 5: cellContent = row.licensest; break;
          case 6: cellContent = row.vin; break;
          case 7: cellContent = row.yearcar; break;
          case 8: cellContent = row.makecar; break;
          case 9: cellContent = row.modelcar; break;
          case 10: cellContent = row.colorcar; break;
          case 11: cellContent = towInfo.driver || ''; break;
          case 12: cellContent = towInfo.trucknum || ''; break;
          case 13: cellContent = towInfo.towtagnum || ''; break;
          case 14: cellContent = invoice.invoicenum || ''; break;
          case 15: cellContent = invoice.total ? `$${invoice.total.toFixed(2)}` : ''; break;
          case 16: cellContent = invoice.totalpaid ? `$${invoice.totalpaid.toFixed(2)}` : ''; break;
          case 17: cellContent = invoice.curbalance ? `$${invoice.curbalance.toFixed(2)}` : ''; break;
          case 18: cellContent = invoice.paytype || ''; break;
        }

        return (
          <MemoizedTableCell
            key={colIndex}
            rowIndex={rowIndex}
            colIndex={colIndex}
            content={cellContent}
            isSelected={selectedCell.row === rowIndex && selectedCell.col === colIndex}
            onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
          />
        );
      })}
    </TableRow>
  );
});

const Dashboard = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const tableRef = useRef<HTMLDivElement>(null);
  const selectedCellRef = useRef<{ row: number; col: number }>({ row: 0, col: 0 });

  const handleSearchResults = useCallback((results: any[]) => {
    setSearchResults(results);
    setSelectedCell({ row: 0, col: 0 });
    setSearchOpen(false);
  }, []);

  const columns = useMemo(() => [
    'Dispatch #', 'Tow Date', 'Towed From', 'Towed To', 'License #', 'State',
    'VIN', 'Year', 'Make', 'Model', 'Color', 'Driver', 'Truck #', 'Tag #',
    'Invoice #', 'Total', 'Paid', 'Balance', 'Payment'
  ], []);

  // Immediate scroll effect
  const scrollToCell = useCallback((row: number, col: number) => {
    if (tableRef.current) {
      const cellElement = document.getElementById(`cell-${row}-${col}`);
      if (cellElement) {
        // First do an immediate scroll
        cellElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        });
        
        // Then do a smooth scroll if we're still not perfectly aligned
        requestAnimationFrame(() => {
          const container = tableRef.current;
          const cellRect = cellElement.getBoundingClientRect();
          const containerRect = container?.getBoundingClientRect();
          
          if (container && containerRect) {
            if (cellRect.top < containerRect.top || cellRect.bottom > containerRect.bottom) {
              cellElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
              });
            }
          }
        });
      }
    }
  }, []);

  // Keyboard navigation with immediate response
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (searchResults.length === 0) return;

      const { row, col } = selectedCellRef.current;
      const maxRow = searchResults.length - 1;
      const maxCol = columns.length - 1;

      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (row < maxRow) newRow = row + 1;
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) newRow = row - 1;
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (col < maxCol) newCol = col + 1;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) newCol = col - 1;
          break;
        case 'Home':
          e.preventDefault();
          newRow = 0;
          newCol = 0;
          break;
        case 'End':
          e.preventDefault();
          newRow = maxRow;
          newCol = maxCol;
          break;
        case 'Enter':
          e.preventDefault();
          break;
        default:
          return;
      }

      if (newRow !== row || newCol !== col) {
        selectedCellRef.current = { row: newRow, col: newCol };
        setSelectedCell({ row: newRow, col: newCol });
        scrollToCell(newRow, newCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, columns, scrollToCell]);

  // Sync ref with state
  useEffect(() => {
    selectedCellRef.current = selectedCell;
  }, [selectedCell]);

  return (
    <Box p={3} sx={{ backgroundColor: '#f0f0f0' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Button 
          variant="contained" 
          onClick={() => setSearchOpen(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Open Extended Search
        </Button>
      </Box>

      <ExtendedSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearchResults={handleSearchResults}
      />

      <Paper elevation={0} sx={{ 
        mt: 4,
        border: '2px solid #999',
        borderRadius: '0px',
        overflow: 'hidden'
      }}>
        <div ref={tableRef} style={{ 
          overflowX: 'auto', 
          maxHeight: '70vh', 
          overflowY: 'auto',
        }}>
          <Table sx={{ 
            minWidth: 1500, 
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
          }}>
            <TableHead sx={{ 
              position: 'sticky', 
              top: 0, 
              zIndex: 1, 
              backgroundColor: '#e0e0e0'
            }}>
              <TableRow>
                <TableCell 
                  sx={{ 
                    width: '24px',
                    padding: 0,
                    border: '1px solid #999',
                    backgroundColor: '#e0e0e0'
                  }}
                />
                {columns.map((header, colIndex) => (
                  <TableCell 
                    key={colIndex} 
                    sx={{ 
                      border: '1px solid #999',
                      padding: '8px',
                      fontWeight: 'bold',
                      backgroundColor: '#e0e0e0',
                      width: "160px",
                      textAlign: 'center',
                      fontSize: '12px'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ 
                    border: '1px solid #999',
                    padding: '16px',
                    fontSize: '12px'
                  }}>
                    No search results found. Click "Open Extended Search" to begin.
                  </TableCell>
                </TableRow>
              ) : (
                searchResults.map((row, rowIndex) => (
                  <MemoizedTableRow
                    key={rowIndex}
                    row={row}
                    rowIndex={rowIndex}
                    columns={columns}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </Box>
  );
};

export default Dashboard;