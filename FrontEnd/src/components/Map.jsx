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
      } else {
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
            <p>Possiamo notare che in tutti gli atenei delle varie regioni italiane, c'è una grande differenza tra il numero di uomini che sono nel mondo del settore ICT rispetto alle donne</p>
            <p>I dati seguenti vanno dal 2013 al 2023 per gli Immatricolati e per i Laureati mentre dal 2012 al 2024 per i professori</p>
      </div>


    </div>
  );
};

export default Map;
