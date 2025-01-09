import { IconButton, InputBase, Paper } from "@mui/material";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || "",
  );

  const debouncedSetSearchParams = debounce((value) => {
    setSearchParams(value ? { search: value } : {});
  }, 500);

  useEffect(() => {
    debouncedSetSearchParams(inputValue);
    return () => {
      debouncedSetSearchParams.cancel();
    };
  }, [inputValue, debouncedSetSearchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInputValue(e.currentTarget.value);
  };

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Wyszukaj produkty"
        inputProps={{ "aria-label": "search products" }}
        value={inputValue}
        onChange={handleInputChange}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    </Paper>
  );
}

export default Search;
