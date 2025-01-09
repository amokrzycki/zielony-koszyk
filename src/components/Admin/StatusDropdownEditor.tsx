import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { PolishOrderStatuses } from "../../enums/PolishOrderStatuses.ts";

const STATUS_OPTIONS: PolishOrderStatuses[] = [
  PolishOrderStatuses.NOWE,
  PolishOrderStatuses.W_TRAKCIE_REALIZACJI,
  PolishOrderStatuses.OCZEKIWANIE_NA_POTWIERDZENIE,
  PolishOrderStatuses.W_TRAKCIE_REALIZACJI,
  PolishOrderStatuses.DO_WYSYLKI,
  PolishOrderStatuses.DOSTARCZONE,
  PolishOrderStatuses.WYSYLKA,
  PolishOrderStatuses.ZAKONCZONE,
];

const StatusDropdownEditor = (props: GridRenderEditCellParams) => {
  const { id, field, value, api } = props;

  const handleChange = (event: SelectChangeEvent) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
  };

  return (
    <Select
      value={value || STATUS_OPTIONS[0]}
      onChange={handleChange}
      autoFocus
      size="small"
      sx={{ width: "100%" }}
    >
      {STATUS_OPTIONS.map((statusValue) => (
        <MenuItem key={statusValue} value={statusValue}>
          {statusValue}
        </MenuItem>
      ))}
    </Select>
  );
};

export default StatusDropdownEditor;
