const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/getByFilter", async (req, res) => {
  try {
    const { year, regione, classe, genere } = req.query;

    console.log(year, regione, classe, genere);
    
    
   
    const tables = {
      '1': 'immatricolati', 
      '2': 'laureati', 
      '3': 'dottorandi', 
      '4': 'dottori', 
      '5': 'academic_staff'
    };

    if (!tables[classe]) {
      return res.status(400).json({ error: "Classe deve essere 1-5" });
    }

 
    let query = `
      SELECT 
        i.anno,
        a.ateneo_nome,
        a.regione,
        i.genere,
        i.n_${tables[classe]} as count,
        ROUND(i.n_${tables[classe]} * 100.0 / 
          SUM(i.n_${tables[classe]}) OVER(PARTITION BY i.genere), 2) as perc_genere
      FROM ${tables[classe]} i
      JOIN atenei a ON i.ateneo_cod = a.ateneo_cod
      WHERE 1=1
    `;

    const params = [];

    // Filtro ANNO
    if (year && year !== 'ALL') {
      query += ` AND i.anno = ?`;
      params.push(year);
    }

    // Filtro REGIONE
    if (regione && regione !== 'ALL') {
      query += ` AND a.regione = ?`;
      params.push(regione);
    }

    // Filtro GENERE
    if (genere && genere !== 'ALL') {
      query += ` AND i.genere = ?`;
      params.push(genere);
    }

    query += ` ORDER BY a.ateneo_nome, i.genere`;

    console.log("Query:", query, params); // Debug
    const [results] = await db.query(query, params);

    // Aggrega per grafici (opzionale)
    const summary = results.reduce((acc, row) => {
      const key = `${row.genere}_${row.regione || 'ALL'}`;
      acc[key] = (acc[key] || 0) + row.count;
      return acc;
    }, {});

    res.json({
      data: results,
      summary,
      totalRecords: results.length,
      filters: { year, regione, classe, genere }
    });

  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
