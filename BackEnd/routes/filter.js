const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/getByFilter", async (req, res) => {
  try {
    const { year, regione, classe, genere, settore } = req.query;

    // console.log(year, regione, classe, genere, settore);
    // console.log(req.query);

    // Input validation - prevent crashes from missing parameters
    if (!year || !regione || !genere || !settore) {
      return res.status(400).json({
        error: "Parametri mancanti",
        required: ["year", "regione", "genere", "settore"],
        received: { year, regione, genere, settore },
      });
    }

    const tables = {
      1: "immatricolati",
      2: "laureati",
      3: "dottorandi",
      4: "dottori",
      5: "staff",
    };

    let queryTail = "";
    let queryParams = []; // Array to hold parameterized values
    let sectorCheck = settore.toUpperCase() != "ALL";
    let regionCheck = false;
    let yearCheck = false;
    let genderCheck = false;

    // Using ? placeholders instead of string interpolation to prevent SQL injection
    if (regione.toUpperCase() !== "ALL") {
      queryTail += ` JOIN atenei AS a ON tb.ateneo_cod = a.ateneo_cod
                  WHERE UPPER(a.regione) = UPPER(?) AND tb.ateneo_cod != 'TTTTT'`;
      queryParams.push(regione);
      regionCheck = true;
    }

    if (year.toUpperCase() !== "ALL") {
      if (!regionCheck) {
        queryTail += ` WHERE tb.anno = ? AND tb.ateneo_cod != 'TTTTT'`;
        queryParams.push(year);
        yearCheck = true;
      } else if (regionCheck) {
        queryTail += ` AND tb.anno = ?`;
        queryParams.push(year);
        yearCheck = true;
      }
    }

    if (genere.toUpperCase() !== "ALL") {
      if (!regionCheck && !yearCheck) {
        queryTail += ` WHERE tb.genere = ? AND tb.ateneo_cod != 'TTTTT'`;
        queryParams.push(genere);
        genderCheck = true;
      } else if (regionCheck && yearCheck) {
        queryTail += ` AND tb.genere = ?`;
        queryParams.push(genere);
        genderCheck = true;
      }
    }

    // console.log(queryTail);

    let query = "";

    // console.log(classe);

    if (classe != undefined && classe != "ALL") {
      if (year.toUpperCase() != "ALL" && regione == "ALL" ) {

        // console.log("here");
        

        query = `
      SELECT 
        anno, a.regione,
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
         JOIN atenei AS a ON tb.ateneo_cod = a.ateneo_cod
                  WHERE tb.ateneo_cod != 'TTTTT' 
      `;


        if (sectorCheck && !genderCheck && !yearCheck && !regionCheck) {
          query += `${
            tables[classe].toUpperCase() == "STAFF"
              ? settore == 1
                ? " WHERE cod_sd IN ('01','09')"
                : ""
              : " WHERE cod_foet2013 = '06'"
          }`;
        } else if (sectorCheck) {
          query += `${
            tables[classe].toUpperCase() == "STAFF"
              ? settore == 1
                ? " AND cod_sd IN ('01','09')"
                : ""
              : " AND cod_foet2013 = '06'"
          }`;
        }

        query += queryTail.replace("WHERE", "AND");
        query += ` GROUP BY tb.anno, a.regione ORDER BY tb.anno;`;
        

        // console.log("Query:", query, queryParams);
        const [results] = await db.query(query, queryParams);

          let accM = [];
          let accF = [];
          let accPM = [];
          let accPF = [];
          let n = 0;
          let regioni = [];
          results.map((x) => {
            n++;
            accM.push(x.uomini);
            accF.push(x.donne);
            accPF.push(x.perc_donne);
            accPM.push(x.perc_uomini);
            regioni.push(x.regione);
          });

          // console.log(accM, accF, accPM, accPF, n, regioni);

        res.json({
          data: {
            uomini:accM,
            donne:accF,
            perc_donne:accPF,
            perc_uomini:accPM,
            regioni: regioni,
          },
          totalRecords: results.length,
          filters: { year, regione, classe, genere },
        });
      } else {

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

      let thisCheck = false
          if(!genderCheck && !regionCheck && !yearCheck){
            query += ` WHERE tb.ateneo_cod != 'TTTTT' `;
            thisCheck = true
          }

        if (sectorCheck && !genderCheck && !yearCheck && !regionCheck && !thisCheck) {
          query += `${
            tables[classe].toUpperCase() == "STAFF"
              ? settore == 1
                ? " WHERE cod_sd IN ('01','09')"
                : ""
              : " WHERE cod_foet2013 = '06'"
          }`;
        } else if (sectorCheck) {
          query += `${
            tables[classe].toUpperCase() == "STAFF"
              ? settore == 1
                ? " AND cod_sd IN ('01','09')"
                : ""
              : " AND cod_foet2013 = '06'"
          }`;
        }

        
        query += ` GROUP BY tb.anno ORDER BY tb.anno;`;

        // console.log("Query:", query, queryParams);
        const [results] = await db.query(query, queryParams);

        res.json({
          data: results,
          totalRecords: results.length,
          filters: { year, regione, classe, genere },
        });
      }
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
          ROUND(100.0 * SUM(CASE WHEN genere = 'M' THEN tb.n_${value} ELSE 0 END) / 
              NULLIF(SUM(n_${value}), 0), 2) AS perc_uomini
          FROM ${
            value.toUpperCase() == "STAFF" ? "academic_staff" : value
          } AS tb
      `;


      query += queryTail;
        
          let thisCheck = false
          if(!genderCheck && !regionCheck && !yearCheck){
            query += ` WHERE tb.ateneo_cod != 'TTTTT' `;
            thisCheck = true
          }

                    if (sectorCheck && !genderCheck && !yearCheck && !regionCheck && !thisCheck ) {
            query += `${
              value.toUpperCase() == "STAFF"
                ? settore == 1
                  ? " WHERE cod_sd IN ('01','09')"
                  : ""
                : " WHERE cod_foet2013 = '06'"
            }`;
          } else if (sectorCheck) {
            query += `${
              value.toUpperCase() == "STAFF"
                ? settore == 1
                  ? " AND cod_sd IN ('01','09')"
                  : ""
                : " AND cod_foet2013 = '06'"
            }`;
          }
            

          query += ` GROUP BY tb.anno ORDER BY tb.anno;`;
          // console.log(query);

          
          // console.log(query);
          

          const [results] = await db.query(query, queryParams);

          totalRecords += results.length;
          let accM = 0;
          let accF = 0;
          let accPM = 0;
          let accPF = 0;
          let n = 0;
          let anni = [];
          results.map((x, idx) => {
            n = idx;
            accM += parseInt(x.uomini);
            accF += parseInt(x.donne);
            accPF += parseFloat(x.perc_donne);
            accPM += parseFloat(x.perc_uomini);
            anni.push(x.anno);
          });
          // console.log(accM, accF, accPM/n, accPF/n, n, anni);

          // Prevent division by zero - use 0 if no results
          let commit = {
            anni: anni,
            uomini: accM,
            donne: accF,
            perc_uomini: n > 0 ? (accPM / n).toFixed(2) : "0.00",
            perc_donne: n > 0 ? (accPF / n).toFixed(2) : "0.00",
          };

          // console.log(commit, key);
          // console.log("-------------------------");
          
          
          tempRes.push({ data: commit, type: key });
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
