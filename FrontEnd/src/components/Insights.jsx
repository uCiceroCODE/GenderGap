import React from 'react'
import "../styles/insights.css"
import { motion } from 'framer-motion'

export default function Insights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
    <section id="insights" class="section">

        <h2 className="section-title">Approfondimenti Strategici [riempimento]</h2>
        <p className="section-subtitle">Fattori chiave e raccomandazioni per colmare il divario</p>

        <div className="insights-grid">

            <div className="insight-card">
                <div className="insight-title">📚 L'Istruzione come Leva</div>
                <div className="insight-text">Le donne sono più istruite degli uomini, ma la loro partecipazione al mercato del lavoro rimane bassa. L'istruzione rappresenta il fattore protettivo più importante, specialmente per le madri lavoratrici.</div>
            </div>

            <div className="insight-card">
                <div className="insight-title">💼 Rappresentanza Dirigenziale</div>
                <div className="insight-text">Solo il 38,8% dei ruoli dirigenziali è occupato da donne. Nel settore tecnologico e IT la situazione è ancora più critica. Politiche di inclusione mirata sono urgenti.</div>
            </div>

            <div className="insight-card">
                <div className="insight-title">⏰ Carico Domestico</div>
                <div className="insight-text">Una donna su cinque rinuncia alla carriera dopo la maternità. Il carico domestico e di cura rimane prevalentemente femminile, limitando le opportunità economiche.</div>
            </div>

            <div className="insight-card">
                <div className="insight-title">🔬 STEM e Digitale</div>
                <div className="insight-text">Nel Cloud Computing le donne rappresentano il 14%, in Ingegneria il 20%, in Data Science e AI il 32%. Investimenti in educazione STEM sono critici.</div>
            </div>

            <div className="insight-card">
                <div className="insight-title">🌍 Contesto Globale</div>
                <div className="insight-text">I paesi nordici (Islanda, Finlandia, Norvegia) hanno colmato oltre il 90% del divario. L'Italia rimane tra gli ultimi in Europa, con ampi margini di miglioramento.</div>
            </div>

            <div className="insight-card">
                <div className="insight-title">💰 Autonomia Finanziaria</div>
                <div className="insight-text">Una percentuale rilevante di donne è priva di autonomia finanziaria. Il gap salariale lungo tutto l'arco della carriera perpetua questa disparità strutturale.</div>
            </div>

        </div>

    </section>
    </motion.div>
  )
}
