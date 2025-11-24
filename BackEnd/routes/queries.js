const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Gender gap per regione - singola query
router.get('/getImmbByRegion', async (req, res) => {
  try {    
    console.log(req.query.regione);
    
    const regione = req.query.regione.toUpperCase();
    
    if (!regione) {
      return res.status(400).json({ error: 'Parametro regione mancante' });
    }
    
    let query = `
      SELECT 
        genere,
        SUM(CASE WHEN tipo = 'immatricolati' THEN valore ELSE 0 END) as total_immatricolati,
        SUM(CASE WHEN tipo = 'laureati' THEN valore ELSE 0 END) as total_laureati,
        SUM(CASE WHEN tipo = 'dottorandi' THEN valore ELSE 0 END) as total_dottorandi,
        SUM(CASE WHEN tipo = 'dottori' THEN valore ELSE 0 END) as total_dottori,
        SUM(CASE WHEN tipo = 'staff' THEN valore ELSE 0 END) as total_numero_staff
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
        
    const [results] = await db.query(query, [regione, regione, regione, regione, regione]);
    res.json(results);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
