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
        SUM(CASE WHEN tipo = 'immatricolati' THEN valore ELSE 0 END) as t_i,
        SUM(CASE WHEN tipo = 'laureati' THEN valore ELSE 0 END) as t_l,
        SUM(CASE WHEN tipo = 'dottorandi' THEN valore ELSE 0 END) as t_dn,
        SUM(CASE WHEN tipo = 'dottori' THEN valore ELSE 0 END) as t_di,
        SUM(CASE WHEN tipo = 'staff' THEN valore ELSE 0 END) as t_s
      FROM (
        SELECT 
          CASE 
            WHEN genere = 'M' THEN 'Uomini'
            WHEN genere = 'F' THEN 'Donne'
            ELSE genere
          END as genere,
          'immatricolati' as tipo,
          immatricolati as valore
        FROM immatricolati 
        WHERE UPPER(regione) = ?
        
        UNION ALL
        
        SELECT 
          CASE 
            WHEN genere = 'M' THEN 'Uomini'
            WHEN genere = 'F' THEN 'Donne'
            ELSE genere
          END as genere,
          'laureati' as tipo,
          laureati as valore
        FROM laureati 
        WHERE UPPER(regione) = ?
        
        UNION ALL
        
        SELECT 
          CASE 
            WHEN genere = 'M' THEN 'Uomini'
            WHEN genere = 'F' THEN 'Donne'
            ELSE genere
          END as genere,
          'dottorandi' as tipo,
          dottorandi as valore
        FROM dottorandi 
        WHERE UPPER(regione) = ?
        
        UNION ALL
        
        SELECT 
          CASE 
            WHEN genere = 'M' THEN 'Uomini'
            WHEN genere = 'F' THEN 'Donne'
            ELSE genere
          END as genere,
          'dottori' as tipo,
          dottori as valore
        FROM dottori 
        WHERE UPPER(regione) = ?
        
        UNION ALL
        
        SELECT 
          CASE 
            WHEN genere = 'M' THEN 'Uomini'
            WHEN genere = 'F' THEN 'Donne'
            ELSE genere
          END as genere,
          'staff' as tipo,
          numero_staff as valore
        FROM academic_staff 
        WHERE UPPER(regione) = ?
      ) combined
      GROUP BY genere
      ORDER BY genere
     `;

    const [results] = await db.query(query, [
      regione,
      regione,
      regione,
      regione,
      regione !== "VALLE D'AOSTA" ? regione.replace(/ /, "-") : "VALLE D'AOSTA",
    ]);

    // console.log({ donne: [results[0].t_i, results[0].t_l, results[0].t_dn, results[0].t_di, results[0].t_s]});
    // console.log({ uomini: [results[1].t_i, results[1].t_l, results[1].t_dn, results[1].t_di, results[1].t_s]});

    regione !== "VALLE D'AOSTA"
      ? res.json({
          donne: [
            results[0].t_i,
            results[0].t_l,
            results[0].t_dn,
            results[0].t_di,
            results[0].t_s,
          ],
          uomini: [
            results[1].t_i,
            results[1].t_l,
            results[1].t_dn,
            results[1].t_di,
            results[1].t_s,
          ],
        })
      : res.json({
          donne: [results[0].t_i, results[0].t_l, results[0].t_s],
          uomini: [results[1].t_i, results[1].t_l, results[1].t_s],
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getByYearICTS", async (req, res) => {
  try {
    let query = `
    SELECT 
      anno,
      genere,
      SUM(immatricolati) as totale
    FROM immatricolati
    WHERE ( desc_foet2013 LIKE '%ICT%')
      AND regione != 'ITALIA'
    GROUP BY anno, genere
    HAVING genere = 'F' OR genere = 'M'
    ORDER BY anno DESC;
    `;

    let [results] = await db.query(query);

    results = {
      donne: results.map((x) => x.genere === 'F' ? x.totale : null).filter((x) => x != null),
      uomini: results.map((x) => x.genere === 'M' ? x.totale : null).filter((x) => x != null)
    };
    

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
