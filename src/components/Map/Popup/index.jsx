import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Popup({ countyId, feature, everywhere_challenges }) {
  const [filteredCsv, setFilteredCsv] = useState(null);

  const handleFileUpload = (countyId) => {
    if (!countyId) return;
    const file = "/blitz-the-gap-map/priorityspecies_per_county_commonName.csv";
    if (!file) return;

    const results = [];
    let csvF = { fields: ["species_name", "english_name", "inat_class"] };
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      download: true,
      delimiter: ",",
      complete: (result) => {
        const filtered = result.data
          .filter((row) => row.DGUID === countyId)
          .map((row) => [row.sp, row.english_name, row.iNat_class]);
        csvF.data = filtered;
        const csv = Papa.unparse(csvF);
        setFilteredCsv(csv);
      },
    });
  };

  useEffect(() => {
    if (!filteredCsv) return;
    const blob = new Blob([filteredCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${feature.CDNAME.replace(
      " ",
      "_"
    )}_priority_species_list.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    U;
  }, [filteredCsv]);

  const chalist0 = feature.challenges + "," + everywhere_challenges.join(",");
  const challist = chalist0
    .replace("Birders, don't look up!", "Birders - don't look up!")
    .split(",")
    .map((challenge, index) => {
      return <li>{challenge}</li>;
    });

  return (
    <div>
      <div style={{ "text-align": "left" }}>
        <h3>{feature.CDNAME}</h3>
        <strong>Number of species</strong>: {feature.number_of_species}
        <br />
        <strong>Number of challenges</strong>:{" "}
        {parseInt(feature.number_of_challenges) + 3}
        <br />
        <strong>List of challenges</strong>: <ul>{challist}</ul>
      </div>
      {true && (
        <button
          onClick={() => handleFileUpload(feature.DGUID)}
          style={{ marginTop: "10px" }}
        >
          Download Priority <br />
          Species List (CSV)
        </button>
      )}
    </div>
  );
}
