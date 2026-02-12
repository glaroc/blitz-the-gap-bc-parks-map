import React, { useState, useEffect, useRef } from "react";
import { GetStac } from "../helpers/api";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function IOHeader(props: any) {
  const { setSelectedLayer } = props;
  const [collectionForm, setCollectionForm] = useState(<></>);
  const [collection, setCollection] = useState("");
  const [BG, setBG] = useState("");
  const ref = useRef();

  const handleCollectionChange = (e: any) => {
    setCollection(e.target.value);
  };
  useEffect(() => {
    GetStac("/collections", {}).then((res: any) => {
      const items = res.data.collections.map((c: any) => (
        <MenuItem value={c.id}>{c.title}</MenuItem>
      ));
      const form = (
        <FormControl fullWidth size="small">
          <Select
            labelId="collection-select"
            id="collection-select"
            label="Collection"
            value={collection}
            onChange={handleCollectionChange}
            sx={{ backgroundColor: "white" }}
          >
            {items}
          </Select>
        </FormControl>
      );
      setCollectionForm(form);
    });
  }, []);

  return (
    <Grid
      container
      sx={{
        height: "65px",
        background: "#424242",
        width: "100%",
        padding: "10px",
      }}
    >
      <Grid item xs={2} sx={{ marginLeft: "25px" }}>
        {collectionForm}
      </Grid>
    </Grid>
  );
}
