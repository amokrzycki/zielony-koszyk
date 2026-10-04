import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";

interface AdminTableToolbarProps {
  selectedCount?: number;
  onDeleteSelected?: () => void;
  addAction?: { label: string; icon?: ReactNode; onClick: () => void };
  extra?: ReactNode;
}

function AdminTableToolbar({ selectedCount = 0, onDeleteSelected, addAction, extra }: AdminTableToolbarProps) {
  return (
    <GridToolbarContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%", py: 1 }}>
        {addAction && (
          <Button onClick={addAction.onClick} variant="contained" startIcon={addAction.icon}>
            {addAction.label}
          </Button>
        )}
        {extra}
        <Box sx={{ flex: 1 }} />
        {selectedCount > 0 && onDeleteSelected && (
          <Button color="error" variant="outlined" startIcon={<DeleteOutline />} onClick={onDeleteSelected}>
            Usuń zaznaczone ({selectedCount})
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={300} />
      </Box>
    </GridToolbarContainer>
  );
}

export default AdminTableToolbar;
