import React, { useState, useEffect } from "react";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";
import { supabase } from "../lib/supabaseClient";

const ChecklistCard = ({
  item_id,
  name,
  imageName,
  wiki = [],
  isSelected,
  onSelectionChange,
  user_id
}) => {
  const [components, setComponents] = useState([]);



  /*const filteredComponents = ["Neurodes", "Detonite Injector", "Mutagen Mass", "Fieldron", "Thrax Plasm", 
    "Ferrite", "Entrati Lanthorn", "Fate Pearl", "Aggristone", "Kovnik", "Rune Marrow", "Silphsela", 
    "Cabochon Embolos", "Trapezium Xenorhast", "Efervon Sample", "HöLlvanian Pitchweave Fragment", 
    "Techrot Chitin", "Techrot Motherboard", "Maw Fang", "Saggen Pearl", "Yao Shrub", "Carbides", "Isos",
    "Nullstones", "Titanium", "Heart Noctrul", "Tepa Nodule", "Tromyzon Entroplasma", "Nitain Extract", 
    "Forma", "Ocular Stem-Root", "Scintillant", "Stellated Necrathene", "Connla Sprout", "Nacreous Pebble", 
    "Tasoma Extract", "Entrati Obols", "Necracoil", "Shrill Voca", "Repeller Systems", "Voidgel Orb", 
    "Voidplume Pinion", "Voidplume Quill", "Atmo Systems", "Echo Voca", "Auroxium Alloy", "Breath Of The Eidolon", 
    "Esher Devar", "Mawfish Bones", "Coprite Alloy", "Narmer Isoplast", "Radiant Zodian", 
    "Longwinder Lathe Coagulant", "Mytocardia Spore", "Star Amarast", "Fersteel Alloy", "Charamote Sagan Module", 
    "Thermal Sludge", "Venerdo Alloy", "Eidolon Shard", "Orokin Ducats", "Lua Thrax Plasm", "Intact Sentient Core", 
    "Gyromag Systems", "Devolved Namalon", "Parasitic Tethermaw", "Grokdrul", "Spinal Core Section", "Pathos Clamp", 
    "Cranial Foremount", "Dracroot", "Lamentus", "Eevani", "Hespazym Alloy", "Seriglass Shard", "Anomaly Shard", 
    "Exceptional Sentient Core", "Iradite", "Mortus Horn", "Purified Heciphron", "Tempered Bapholite", 
    "Eye-Eye Rotoblade", "Marquise Thyst", "Mirewinder Parallel Biode", "Sapcaddy Venedo Case", "Radian Sentirum", 
    "Recaster Neural Relay", "Star Crimzian", "Synathid Ecosynth Analyzer", "Gorgaricus Spore", "Goblite Tears", 
    "Travocyte Alloy", "Axidrol Alloy", "Scrap", "Smooth Phasmin", "Kriller Thermal Laser", "Marquise Veridos", 
    "Fish Scales", "Nistlepod", "Pyrotic Alloy", "Tear Azurite", "Condroc Wing", "Temporal Dust"
  ];*/

  useEffect(() => {
    const fetchParts = async () => {
      const {data: partsData, error: partsError} = await supabase.from("item_parts").select("id, item_id, item_name, part_name, quantity").eq("item_id", item_id);
      if(partsError){
        console.error("Error fetching item parts:", partsError);
        return;
      }
      const partsIDs = partsData.map((p) => p.id);

      const{data: userPartsData, error: userPartsError} = await supabase.from("user_item_parts").select("item_part_id, quantity").eq("user_id", user_id).in("item_part_id",partsIDs);
      if(userPartsError){
        console.error("Error fetching user data:", userPartsError);
        return;
      }
      const quantityMap = {};
      userPartsData.forEach((row) => {
        quantityMap[row.item_part_id] = row.quantity;
      })
      setComponents(partsData);
    }

    fetchParts();
  }, [item_id, user_id]);

  const handleCardClick = () => {
    onSelectionChange(name, !isSelected); // Update the selected state in the parent
  };

  const handleLinkClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        display: "flex",
        height: "75%",
        alignItems: "center",
        flex: "1 1 300px",
        maxWidth: "500px",
        minWidth: "300px",
        padding: "1rem",
        position: "relative",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        border: isSelected ? "3px solid #4caf50" : "3px solid #ccc",
        transition: "border 0.4s ease",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "24px",
            color: "#4caf50",
            zIndex: 1,
          }}
        >
          ✔
        </div>
      )}
  
      {/* Inner Content Wrapper with grayscale + dim */}
      <div
        style={{
          display: "flex",
          filter: isSelected ? "grayscale(80%) brightness(85%)" : "none",
          transition: "filter 0.4s ease",
        }}
      >
        {/* Image Section */}
        <div style={{ flexShrink: 0, marginRight: "1rem" }}>
          <img
            src={`https://cdn.warframestat.us/img/${imageName}`}
            alt={name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        </div>
  
        {/* Content Section */}
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            <a
              href={wiki}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
              onClick={handleLinkClick}
            >
              {name}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );  
};

export default ChecklistCard;
