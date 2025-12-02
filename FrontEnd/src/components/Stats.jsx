import React from 'react'
import "../styles/stats.css"
import Count from './utilities/Count'

export default function Stats() {

  return (
    <section id='stats' className="section">

        <h2 className='section-title'>Statistiche Chiave 2024-2025</h2>
        <p className='section-subtitle'>Uno sguardo alle principali metriche del gender gap italiano</p>

        <div className='stats-grid'>

            <div className='stat-card'>
                <div className='stat-value'><Count from={0} to={85} duration={0.8} className="count-up-text" />°</div>
                <div className='stat-label'>Posizione dell'Italia nel Global Gender Gap Index 2025 su 148 paesi (punteggio: 0,704)</div>
            </div>
            <div className="stat-card">
                <div className="stat-value"><Count from={0} to={25} duration={0.8} className="count-up-text" />%</div>
                <div className="stat-label">Divario salariale medio: le donne guadagnano il 25% in meno degli uomini</div>
            </div>
            <div className="stat-card">
                <div className="stat-value"><Count from={0} to={42} duration={0.8} className="count-up-text" />%</div>
                <div className="stat-label">Gap salariale per giovani laureate: il più profondo dell'OCSE</div>
            </div>
            <div className="stat-card">
                <div className="stat-value"><Count from={0} to={85} duration={0.8} className="count-up-text" />%</div>
                <div className="stat-label">Tasso occupazione femminile (20-64 anni) vs 70,4% maschile</div>
            </div>
            <div className="stat-card">
                <div className="stat-value"><Count from={0} to={123} duration={0.8} className="count-up-text" /></div>
                <div className="stat-label">Anni necessari al ritmo attuale per raggiungere la parità globale</div>
            </div>
            <div className="stat-card">
                <div className="stat-value"><Count from={0} to={55} duration={0.8} className="count-up-text" />%</div>
                <div className="stat-label">Italia ultimo posto UE per tasso occupazione femminile</div>
            </div>
        </div>

    </section>
  )
}


