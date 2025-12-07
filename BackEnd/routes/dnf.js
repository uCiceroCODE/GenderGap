const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/getData", async (req, res) => {
  try {
    const { year, genere, azienda } = req.query;

    // console.log(year, genere, azienda);
    // console.log(req.query, req.originalUrl);

    if (!year || !genere || !azienda) {
      return res.status(400).json({
        error: "Parametri mancanti",
        required: ["year", "genere", "azienda"],
        received: { year, genere, azienda },
      });
    }

    if (year.toUpperCase() == "ALL") {
      if (azienda.toUpperCase() == "ALL") {
        if (genere.toUpperCase() == "ALL") {
          let query = `
          SELECT 
          anno, nome, 
          SUM(n_uomini) as n_uomini,
          SUM(n_donne) as n_donne,
          ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_uomini,
          ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_donne
          FROM azienda_ict 
          GROUP BY anno, nome
          ORDER BY anno;`;

          const [results] = await db.query(query);

          let anni = [];
          let aziende = [];

          let response = [];

          results.map((x) => {
            !anni.includes(x.anno) && anni.push(x.anno);
            !aziende.includes(x.nome) && aziende.push(x.nome);
          });

          aziende.map((x) => {
            let accM = 0;
            let accF = 0;
            let accPM = 0;
            let accPF = 0;
            let n = 0;

            results.map((y) => {
              if (y.nome == x) {
                n++;
                accM += parseInt(y.n_uomini);
                accF += parseInt(y.n_donne);
                accPM += parseFloat(y.p_uomini);
                accPF += parseFloat(y.p_donne);
              }
            });

            response.push({
              nome: x,
              n_uomini: accM,
              n_donne: accF,
              p_uomini: n > 0 && (accPM / n).toFixed(2),
              p_donne: n > 0 && (accPF / n).toFixed(2),
            });

            // console.log(n, accM, accF, accPM / n, accPF / n);
          });

          // console.log(response);
          res.json({ response });
        } else {
          let query = `SELECT 
        anno, nome, 
        ${
          genere.toUpperCase() == "M"
            ? "SUM(n_uomini) as n_data,"
            : "SUM(n_donne) as n_data,"
        }
        ${
          genere.toUpperCase() == "M"
            ? "ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
            : "ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
        }
        FROM azienda_ict
        GROUP BY anno, nome
        ORDER BY anno;`;

          // console.log(query);

          const [results] = await db.query(query);

          let anni = [];
          let aziende = [];

          let response = [];

          results.map((x) => {
            !anni.includes(x.anno) && anni.push(x.anno);
            !aziende.includes(x.nome) && aziende.push(x.nome);
          });

          aziende.map((x) => {
            let accData = 0;
            let accPData = 0;
            let n = 0;

            results.map((y) => {
              if (y.nome == x) {
                n++;
                accData += parseInt(y.n_data);
                accPData += parseFloat(y.p_data);
              }
            });

            response.push({
              nome: x,
              n_data: accData,
              p_data: n > 0 && (accPData / n).toFixed(2),
            });
          });

          // console.log(response);
          res.json({ response });
        }
      } else {
        if (genere.toUpperCase() == "ALL") {
          let query = `
          SELECT 
          anno, nome, 
          SUM(n_uomini) as n_uomini,
          SUM(n_donne) as n_donne,
          ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_uomini,
          ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_donne
          FROM azienda_ict WHERE nome = '${azienda}' 
          GROUP BY anno 
          ORDER BY anno;`;

          console.log(query);

          const [results] = await db.query(query);

          let anni = [];

          let accM = [];
          let accF = [];
          let accPM = [];
          let accPF = [];

          results.map((x) => {
            !anni.includes(x.anno) && anni.push(x.anno);
            accM.push(parseInt(x.n_uomini));
            accF.push(parseInt(x.n_donne));
            accPM.push(parseFloat(x.p_uomini).toFixed(2));
            accPF.push(parseFloat(x.p_donne).toFixed(2));
          });

          // console.log(response);
          res.json({
            nome: azienda,
            anni: anni,
            n_uomini: accM,
            n_donne: accF,
            p_uomini: accPM,
            p_donne: accPF,
          });
        } else {
          let query = `SELECT 
        anno, nome, 
        ${
          genere.toUpperCase() == "M"
            ? "SUM(n_uomini) as n_data,"
            : "SUM(n_donne) as n_data,"
        }
        ${
          genere.toUpperCase() == "M"
            ? "ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
            : "ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
        }
        FROM azienda_ict WHERE nome = '${azienda}' 
        GROUP BY anno, nome
        ORDER BY anno;`;

          // console.log(query);

          const [results] = await db.query(query);

          let anni = [];

          let accData = [];
          let accPdata = [];

          results.map((x) => {
            !anni.includes(x.anno) && anni.push(x.anno);
            accData.push(parseInt(x.n_data));
            accPdata.push(parseFloat(x.p_data).toFixed(2));
          });

          // console.log(response);
          res.json({
            nome: azienda,
            anni: anni,
            n_data: accData,
            p_data: accPdata,
          });
        }
      }
    } else {
      if (genere.toUpperCase() == "ALL") {
        let query = `
        SELECT 
        anno, nome, 
        SUM(n_uomini) as n_uomini,
        SUM(n_donne) as n_donne,
        ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_uomini,
        ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_donne
        FROM azienda_ict WHERE anno = ? ${
          azienda.toUpperCase() != "ALL" ? ` AND nome = '${azienda}'` : ""
        }
        GROUP BY anno, nome
        ORDER BY anno;`;

        const [results] = await db.query(query, year);

        res.json({ results });
      } else {
        let query = `
        SELECT 
        anno, nome, 
        ${
          genere.toUpperCase() == "M"
            ? "SUM(n_uomini) as n_data,"
            : "SUM(n_donne) as n_data,"
        }
        ${
          genere.toUpperCase() == "M"
            ? "ROUND(SUM(n_uomini) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
            : "ROUND(SUM(n_donne) * 100.0 / (SUM(n_uomini) + SUM(n_donne)), 2) as p_data"
        }
        FROM azienda_ict WHERE anno = ? ${
          azienda.toUpperCase() != "ALL" ? ` AND nome = '${azienda}'` : ""
        }
        GROUP BY anno, nome
        ORDER BY anno;`;

        const [results] = await db.query(query, year);

        res.json(results );
      }
    }

    // console.log(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
