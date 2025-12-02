// Map.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import italiaGeojson from "../../../public/it.json";
import "leaflet/dist/leaflet.css";
import '../../styles/map.css'
import MapChart from "./MapChart";
import Dropdown from "../utilities/Dropdown";



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

  const options = [
    { value: "2013", label: "2013" },
    { value: "2014", label: "2014" },
    { value: "2015", label: "2015" },
    { value: "2016", label: "2016" },
    { value: "2017", label: "2017" },
    { value: "2018", label: "2018" },
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023 " },
  ]

  return (
    <div>
    
    
    
    <div className="map-main-container">

      <div className="filter-map-container">
        <Dropdown options={options} df={'ALL'} title={"Seleziona l'anno di visualizzazione:"}/>
      </div>
    


    <div className="content-map-container">

    
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
            <p>La mappa mostra come in tutte le regioni italiane il <b>Gender Gap</b> nel settore ICT si amplifichi 
              lungo la carriera accademica: le donne sono già minoranza tra gli immatricolati e 
              diventano ancora più sottorappresentate tra laureati e soprattutto tra professori e ricercatori, 
              segno di barriere strutturali e culturali che ostacolano la progressione femminile nel digitale</p>
      </div>
      
      </div>


    </div>
  );
};

export default Map;
