const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/getByFilter", async (req, res) => {
  try {
    const { year, regione, classe, genere } = req.query;

    // console.log(year, regione, classe, genere);
    // console.log(req.query);
    
    
    const tables = {
      1: "immatricolati",
      2: "laureati",
      3: "dottorandi",
      4: "dottori",
      5: "staff",
    };

    let queryTail = "";
    let regionCheck = false;
    let yearCheck = false;
    let genderCheck = false;

    if (regione.toUpperCase() !== "ALL") {
      queryTail += ` JOIN atenei AS a ON tb.ateneo_cod = a.ateneo_cod
                  WHERE UPPER(a.regione) = '${regione.toUpperCase()}' AND tb.ateneo_cod != 'TTTTT'`;
      regionCheck = true;
    }

    if (year.toUpperCase() !== "ALL") {
      if (!regionCheck) {
        queryTail += ` WHERE tb.anno = '${year}' AND tb.ateneo_cod != 'TTTTT'`;
        yearCheck = true;
      } else if (regionCheck) {
        queryTail += ` AND tb.anno = '${year}'`;
        yearCheck = true;
      }
    }

    if (genere.toUpperCase() !== "ALL") {
      if (!regionCheck && !yearCheck) {
        queryTail += ` WHERE tb.genere = '${genere}' AND tb.ateneo_cod != 'TTTTT'`;
        genderCheck = true;
      } else if (regionCheck && yearCheck) {
        queryTail += ` AND tb.genere = '${genere}'`;
        genderCheck = true;
      }
    }

    queryTail += ` GROUP BY tb.anno ORDER BY tb.anno;`;

    // console.log(queryTail);

    let query = "";

    // console.log(classe);
    
    if (classe != undefined && classe != 'ALL') {
      query = `
      SELECT 
        anno,
        SUM(CASE WHEN genere = 'F' THEN tb.n_${
          tables[classe]
        } ELSE 0 END) AS donne,
        SUM(CASE WHEN genere = 'M' THEN tb.n_${
          tables[classe]
        } ELSE 0 END) AS uomini,
        SUM(tb.n_${tables[classe]}) AS totale,
        ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN tb.n_${
          tables[classe]
        } ELSE 0 END) / 
              NULLIF(SUM(n_${tables[classe]}), 0), 2) AS perc_donne,
        ROUND(100.0 * SUM(CASE WHEN genere = 'M' THEN tb.n_${
          tables[classe]
        } ELSE 0 END) / 
              NULLIF(SUM(n_${tables[classe]}), 0), 2) AS perc_uomini
        FROM ${
          tables[classe].toUpperCase() == "STAFF"
            ? "academic_staff"
            : tables[classe]
        } AS tb
      `;

      query += queryTail;

      // console.log("Query:", query, params);
      const [results] = await db.query(query);

      res.json({
        data: results,
        totalRecords: results.length,
        filters: { year, regione, classe, genere },
      });
    } else {
      const tempRes = [];
      let totalRecords = 0;

      await Promise.all(
        Object.entries(tables).map(async ([key, value]) => {
          // console.log(value);
          

          query = `
        SELECT 
          anno,
          SUM(CASE WHEN genere = 'F' THEN tb.n_${value} ELSE 0 END) AS donne,
          SUM(CASE WHEN genere = 'M' THEN tb.n_${value} ELSE 0 END) AS uomini,
          SUM(tb.n_${value}) AS totale,
          ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN tb.n_${value} ELSE 0 END) / 
                NULLIF(SUM(n_${value}), 0), 2) AS perc_donne,
          ROUND(100.0 * SUM(CASE WHEN genere = 'M' THEN tb.n_${
            value
          } ELSE 0 END) / 
              NULLIF(SUM(n_${value}), 0), 2) AS perc_uomini
          FROM ${
            value.toUpperCase() == "STAFF" ? "academic_staff" : value
          } AS tb
      `;

          query += queryTail;

          // console.log(query);
          

          const [results] = await db.query(query);

          totalRecords += results.length;
          let accM = 0
          let accF = 0
          let accPM = 0
          let accPF = 0
          let n = 0
          let anni = []
          results.map((x, idx) => {
            n = idx
            accM += parseInt(x.uomini)
            accF += parseInt(x.donne)
            accPF += parseFloat(x.perc_donne)
            accPM += parseFloat(x.perc_uomini)
            anni.push(x.anno)
          })
          // console.log(accM, accF, accPM/n, accPF/n, n, anni);
          
          let commit = {
            anni: anni,
            uomini: accM,
            donne: accF,
            perc_uomini: (accPM/n).toFixed(2),
            perc_donne: (accPF/n).toFixed(2),
          }

          tempRes.push({data:commit, type:key});
        })
      );
      // console.log(tempRes);

      
      res.json({
        data: [...tempRes],
        totalRecords: totalRecords,
        filters: { year, regione, classe, genere },
      });
    }
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
