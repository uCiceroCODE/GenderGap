const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Gender gap per regione - singola query
router.get("/getByRegion", async (req, res) => {
  try {
    // console.log(req.query.regione);
    // console.log(req);

    const regione = req.query.regione.toUpperCase();

    if (!regione) {
      return res.status(400).json({ error: "Parametro regione mancante" });
    }

    // all
    let query = `
     SELECT 
    genere,
    SUM(CASE WHEN tipo = 'immatricolati' THEN valore ELSE 0 END) AS t_i,
    SUM(CASE WHEN tipo = 'laureati'      THEN valore ELSE 0 END) AS t_l,
    SUM(CASE WHEN tipo = 'staff'         THEN valore ELSE 0 END) AS t_s
    FROM (
    -- IMMATRICOLATI
    SELECT 
        CASE 
            WHEN i.genere = 'M' THEN 'Uomini'
            WHEN i.genere = 'F' THEN 'Donne'
            ELSE i.genere
        END AS genere,
        'immatricolati' AS tipo,
        i.n_immatricolati AS valore
    FROM immatricolati i
    JOIN atenei a ON a.ateneo_cod = i.ateneo_cod
    WHERE UPPER(a.regione) = ? AND cod_foet2013 = '06'

    UNION ALL

    -- LAUREATI
    SELECT 
        CASE 
            WHEN l.genere = 'M' THEN 'Uomini'
            WHEN l.genere = 'F' THEN 'Donne'
            ELSE l.genere
        END AS genere,
        'laureati' AS tipo,
        l.n_laureati AS valore
    FROM laureati l
    JOIN atenei a ON a.ateneo_cod = l.ateneo_cod
    WHERE UPPER(a.regione) = ? AND cod_foet2013 = '06'

    UNION ALL

    -- STAFF ACCADEMICO
    SELECT 
        CASE 
            WHEN s.genere = 'M' THEN 'Uomini'
            WHEN s.genere = 'F' THEN 'Donne'
            ELSE s.genere
        END AS genere,
        'staff' AS tipo,
        s.n_staff AS valore
    FROM academic_staff s
    JOIN atenei a ON a.ateneo_cod = s.ateneo_cod
    WHERE UPPER(a.regione) = ? AND cod_sd IN ('01', '09')
) AS combined
GROUP BY genere
ORDER BY genere;

     `;

    const [results] = await db.query(query, [regione, regione, regione]);

    // console.log({ donne: [results[0].t_i, results[0].t_l, results[0].t_dn, results[0].t_di, results[0].t_s]});
    // console.log({ uomini: [results[1].t_i, results[1].t_l, results[1].t_dn, results[1].t_di, results[1].t_s]});

    res.json({
      uomini: [results[0].t_i, results[0].t_l, results[0].t_s],
      donne: [results[1].t_i, results[1].t_l, results[1].t_s],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getByYearICTS", async (req, res) => {
  try {
    let query_i = `
    SELECT 
      anno,
      genere,
      SUM(n_immatricolati) as totale
    FROM immatricolati
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let query_l = `
    SELECT 
      anno,
      genere,
      SUM(n_laureati) as totale
    FROM laureati
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let query_d = `
    SELECT 
      anno,
      genere,
      SUM(n_dottorandi) as totale
    FROM dottorandi
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let query_dn = `
    SELECT 
      anno,
      genere,
      SUM(n_dottori) as totale
    FROM dottori
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let query_a = `
    SELECT 
      anno,
      genere,
      SUM(n_staff) as totale
    FROM academic_staff
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let [results_i] = await db.query(query_i);
    let [results_l] = await db.query(query_l);
    let [results_d] = await db.query(query_d);
    let [results_dn] = await db.query(query_dn);
    let [results_a] = await db.query(query_a);

    const results = [
      {
        donne: results_i
          .map((x) => (x.genere === "F" ? x.totale : null))
          .filter((x) => x != null),
        uomini: results_i
          .map((x) => (x.genere === "M" ? x.totale : null))
          .filter((x) => x != null),
        text: "Immatricolati",
      },
      {
        donne: results_l
          .map((x) => (x.genere === "F" ? x.totale : null))
          .filter((x) => x != null),
        uomini: results_l
          .map((x) => (x.genere === "M" ? x.totale : null))
          .filter((x) => x != null),
        text: "Laureati",
      },
      {
        donne: results_d
          .map((x) => (x.genere === "F" ? x.totale : null))
          .filter((x) => x != null),
        uomini: results_d
          .map((x) => (x.genere === "M" ? x.totale : null))
          .filter((x) => x != null),
        text: "Dottorandi",
      },
      {
        donne: results_dn
          .map((x) => (x.genere === "F" ? x.totale : null))
          .filter((x) => x != null),
        uomini: results_dn
          .map((x) => (x.genere === "M" ? x.totale : null))
          .filter((x) => x != null),
        text: "Dottori",
      },
      {
        donne: results_a
          .map((x) => (x.genere === "F" ? x.totale : null))
          .filter((x) => x != null),
        uomini: results_a
          .map((x) => (x.genere === "M" ? x.totale : null))
          .filter((x) => x != null),
        text: "Professori e Ricercatori",
      },
    ];

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getWomenPer", async (req, res) => {
  try {
    let query_i = `
    SELECT 
    anno,cod_foet2013,
    ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN n_immatricolati ELSE 0 END) / 
          NULLIF(SUM(n_immatricolati), 0), 2) AS perc_donne_stem
    FROM immatricolati
    GROUP BY anno, cod_foet2013
    ORDER BY anno;

    `;

    let query_l = `
    SELECT 
    anno,cod_foet2013,
    ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN n_laureati ELSE 0 END) / 
          NULLIF(SUM(n_laureati), 0), 2) AS perc_donne_stem
    FROM laureati
    GROUP BY anno, cod_foet2013 
    ORDER BY anno;
    `;

    let query_d = `
   SELECT 
    anno,cod_foet2013,
    ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN n_dottorandi ELSE 0 END) / 
          NULLIF(SUM(n_dottorandi), 0), 2) AS perc_donne_stem
    FROM dottorandi
    GROUP BY anno, cod_foet2013
    ORDER BY anno;
    `;

    let query_dn = `
    SELECT 
    anno,cod_foet2013,
    ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN n_dottori ELSE 0 END) / 
          NULLIF(SUM(n_dottori), 0), 2) AS perc_donne_stem
    FROM dottori
    GROUP BY anno, cod_foet2013
    ORDER BY anno;
    `;

    let query_a = `
    SELECT 
    anno,cod_sd,
    ROUND(100.0 * SUM(CASE WHEN genere = 'F' THEN n_staff ELSE 0 END) / 
          NULLIF(SUM(n_staff), 0), 2) AS perc_donne_stem
    FROM academic_staff
    GROUP BY anno, cod_sd
    ORDER BY anno;
    `;

    let [results_i] = await db.query(query_i);
    let [results_l] = await db.query(query_l);
    let [results_d] = await db.query(query_d);
    let [results_dn] = await db.query(query_dn);
    let [results_a] = await db.query(query_a);

    const results = {
      immatricolati: results_i,

      laureati: results_l,

      dottoranti: results_d,

      dottori: results_dn,

      staff: results_a,
    };
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
