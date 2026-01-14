import React, { useState, useEffect } from "react";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";
import { supabase } from "../lib/supabaseClient";
import {debounce} from "lodash";

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
    "Fish Scales", "Nistlepod", "Pyrotic Alloy", "Tear Azurite", "Condroc Wing", "Temporal Dust", "Dull Button"
  ];*/

  useEffect(() => {
    if (!user_id) return;
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
      className={`flex items-center flex-1 min-w-[300px] max-w-[500px] p-4 rounded-lg shadow-md bg-white relative 
        ${isSelected ? 'border-4 border-green-500' : 'border-4 border-gray-300'}
        transition-all duration-400 ease-linear
        transform hover:scale-[1.02] hover:shadow-lg cursor-pointer`}
    >
      {isSelected && (
        <div
          className="absolute top-2.5 right-2.5 text-2xl text-green-500 z-10"
        >
          ✔
        </div>
      )}
  
      {/* Inner Content Wrapper with grayscale + dim */}
      <div
        className={`flex transition-filter duration-400 ease-linear
          ${isSelected ? 'filter grayscale brightness-75' : ''}`}
      >
        {/* Image Section */}
        <div className="flex-shrink-0 mr-4">
          <img
            src={`https://cdn.warframestat.us/img/${imageName}`}
            alt={name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>
  
        {/* Content Section */}
        <div>
          <h3
            className="m-0 mb-2 word-wrap break-word overflow-wrap break-word whitespace-normal"
          >
            <a
              href={wiki}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-gray-900 no-underline transition transform duration-200 ease-in-out hover:scale-105 hover:text-black"
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
