// Map.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, useMap, AttributionControl } from "react-leaflet";
import L from "leaflet";
import italiaGeojson from "../../public/it.json";
import "leaflet/dist/leaflet.css";
import '../styles/map.css'
import MapChart from "./MapChart";



const ResizeMap = () => {
  const map = useMap({});
  
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};


const LimitMap = () => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [36.6, 6.6],    // Sud-Ovest (Sicilia)
      [47.1, 18.5]    // Nord-Est (Friuli)
    );

    map.setMaxBounds(bounds);
    map.dragging.disable();
    map.scrollWheelZoom.disable();    
    map.doubleClickZoom.disable();
    
    return () => {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    };
  }, [map]);

  return null;
};


const Map = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [geoJsonRef, setGeoJsonRef] = useState(null);


  // Effetto per aggiornare gli stili quando cambia la selezione
  useEffect(() => {
    if (geoJsonRef) {
      geoJsonRef.eachLayer((layer) => {
        const regionName = layer.feature.properties.name || layer.feature.properties.NAME || "Sconosciuta";
        
        if (selectedRegion?.name === regionName) {
          layer.setStyle({
            fillColor: "#eb1902",
            weight: 2,
            opacity: 1,
            fillOpacity: 1
          });
          layer.bringToFront();
        } else {
          layer.setStyle({
            fillColor: "#ffffff",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          });
        }
      });
    }
  }, [selectedRegion, geoJsonRef]);

  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.name || feature.properties.NAME || "Sconosciuta";
    
    layer.on("click", () => {
      if (selectedRegion?.name === regionName) {
        setSelectedRegion({name: 'Italia' });
      } else if(regionName.toUpperCase() != "VALLE D'AOSTA" ){
        setSelectedRegion({
          name: regionName,
          properties: feature.properties,
          geometry: feature.geometry
        });
      }
    });
    
    layer.on("mouseover", () => {
      // Hover solo se NON è selezionata
      if (selectedRegion?.name !== regionName) {
        layer.setStyle({
          fillColor: "#eb1902",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        });
      }
      layer.bringToFront();
    });

    layer.on("mouseout", () => {
      // Ripristina lo stile solo se NON è selezionata
      if (selectedRegion?.name !== regionName) {
        layer.setStyle({
          fillColor: "#ffffff",
          weight: 1,
          opacity: 1,
          fillOpacity:1
        });
      }
    });
  };

  const style = {
    fillColor: "#ffffff",
    weight: 1,
    opacity: 1,
    color: "#0033ff",
    fillOpacity: 1
  };

  return (
    <div>
    
    
    
    <div className="map-main-container">

      <div className="map-container">
        <div className="map-header">
          <h2>Mappa Interattiva Italia</h2>
        </div>

        <div className="map-content">
          <div className="map-wrapper">
            { italiaGeojson ? (
              <MapContainer 
                center={[41.8719, 12.5674]} 
                zoom={5}
                style={{ width: "100%", height: "100%" , backgroundColor:'transparent'}}
                zoomControl={false}
              >
                <GeoJSON 
                  key={"G"+selectedRegion?.name}
                  ref={setGeoJsonRef}
                  data={italiaGeojson} 
                  style={style} 
                  onEachFeature={onEachFeature} 
                />
                <ResizeMap />
                <LimitMap />
              </MapContainer>
            ) : (
              <div className="map-placeholder">Errore nel caricamento della mappa</div>
            )}
          </div>
        </div>
      </div>


            <MapChart region={selectedRegion && selectedRegion}/> 
     

      </div>


      <div className="map-description">
            <p>Tutte le regioni italiane mostrano un andamento identico e preoccupante nel settore ICT, caratterizzato da tre livelli di formazione che presentano uno squilibrio di genere chiamo <b>Digital Gender Gap</b> sempre più marcato man mano che si sale nella scala accademica e professionale.</p>
            <p>L'andamento identico in tutte le regioni evidenzia come il digital gender gap nel settore ICT sia un fenomeno sistemico radicato nella cultura italiana, 
              non circoscritto a specifiche aree geografiche. Il passaggio dagli immatricolati ai laureati ai professori mostra un progressivo restringimento della presenza femminile, 
              suggerendo che le donne affrontano ostacoli crescenti nel progredire all'interno dell'ecosistema accademico e professionale del settore tecnologico. 
              Per invertire questa tendenza, sono necessarie iniziative strutturali a livello nazionale che affrontino gli stereotipi di genere, promuovano modelli positivi femminili nel settore, 
              e incentivino la partecipazione delle ragazze fin dai livelli scolastici primari.</p>
              <p>Possiamo notare che nei professori e nei ricercatori c'è quasi sempre un numero di uomini 3 o piu volte grande rispetto al numero di donne, mentre per gli immatricolati e lauerati il valore sale fino ad essere persino 6 o piu volte grande, questo ci indica che il Digital Gender Gap in quella zona e molto grave</p>
      </div>


    </div>
  );
};

export default Map;
