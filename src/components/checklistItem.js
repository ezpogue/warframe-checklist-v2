import React, { useState, useEffect, useRef } from "react";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";
import { supabase } from "../lib/supabaseClient";
import {debounce} from "lodash";

const ChecklistCard = React.memo(({
  item_id,
  name,
  imageName,
  wiki = [],
  isSelected,
  onSelectionChange,
  user_id
}) => {
  const [components, setComponents] = useState([]);



  const excluded = ["Neurodes", "Detonite Injector", "Mutagen Mass", "Fieldron", "Thrax Plasm", 
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
    "Fish Scales", "Nistlepod", "Pyrotic Alloy", "Tear Azurite", "Condroc Wing", "Temporal Dust", "Dull Button",
    "Kuva", "Alloy Plate", "Nano Spores", "Orokin Cell", "Argon Crystal", "Morphics", "Neural Sensors", "Control Module",
    "Tellurium", "Kuaka Spinal Claw", "Cetus Wisp", "Maprico", "Cuthol Tendrils", "Seram Beetle Shell", "Murkray Liver",
    "Norg Brain"
  ];

  useEffect(() => {
    if (!user_id) return;
    //console.log("Fetching parts for item_id:", item_id);
    const fetchParts = async () => {
      const {data: partsData, error: partsError} = await supabase.from("item_parts").select("part_id, item_id, item_name, part_name, quantity").eq("item_id", item_id);
      if(partsError){
        console.error("Error fetching item parts:", partsError);
        return;
      }
      //console.log("Parts data fetched:", partsData);
      const partsIDs = partsData.map((p) => p.part_id);

      const{data: userPartsData, error: userPartsError} = await supabase.from("user_item_parts").select("item_id, part_id, quantity").eq("user_id", user_id).eq("item_id", item_id).in("part_id",partsIDs);
      if(userPartsError){
        console.error("Error fetching user data:", userPartsError);
        return;
      }
      const quantityMap = {};
      userPartsData.forEach((row) => {
        quantityMap[row.part_id] = row.quantity;
      })
      setComponents(partsData.map(p =>{
        const ownedQuantity = quantityMap[p.part_id] || 0;
        const checksArray = Array.from({ length: p.quantity }, (_, index) => index < ownedQuantity);
        return { ...p, max_quantity: p.quantity, quantity: ownedQuantity, checks: checksArray}
      }));
    }

    fetchParts();
  }, [item_id, user_id]);

  const filteredComponents = components.filter(comp => !excluded.includes(comp.part_name) && comp.max_quantity < 3);
  //console.log("components:", components);
  //console.log("filtered:", filteredComponents);



  const pendingUpdates = useRef([]);
  const debouncedUpdate = useRef(
    debounce(async () => {
      if (pendingUpdates.current.length === 0) return;
  
      const updates = [...pendingUpdates.current];
      pendingUpdates.current = [];
  
      try {
        for (const update of updates) {
          const { user_id, item_id, part_id, quantity } = update;
          //console.log("Updating item:", update);
          const { data, error } = await supabase
            .from("user_item_parts")
            .update({ quantity })
            .eq("user_id", user_id)
            .eq("item_id", item_id)
            .eq("part_id", part_id);
  
          if (error) console.error("Error updating user item:", error);
          //else console.log("Updated user item:", data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }, 500)
  ).current;

  const handleCardClick = () => {
    onSelectionChange(name, !isSelected); // Update the selected state in the parent
  };

  const handleLinkClick = (event) => {
    event.stopPropagation();
  };

  const handleCheckboxToggle = (comp, index) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.part_id !== comp.part_id) return c;

        const newChecks = [...c.checks];
        newChecks[index] = !newChecks[index];

        const newQuantity = newChecks.filter(Boolean).length;

        pendingUpdates.current.push({
          user_id,
          item_id: item_id,
          part_id: c.part_id,
          quantity: newQuantity
        });

        debouncedUpdate();

        return {
          ...c,
          checks: newChecks,
          quantity: newQuantity
        };
      })
    );
  };



  return (
    <div
      onClick={handleCardClick}
      className={`flex items-center flex-1 min-w-[320px] max-w-[500px] p-4 rounded-lg shadow-md bg-white relative h-full  
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
          {filteredComponents.length > 1 &&filteredComponents.map((comp) => (
            <div key={comp.part_id} className="mb-2 flex items-center gap-3">
              <div className="flex gap-2">
              {comp.checks.map((checked, index) => {
                return (
                  <label className="inline-flex items-center p-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <input
                      key={index}
                      type="checkbox"
                      className="scale-150 cursor-pointer"
                      checked={checked}
                      onChange={() => handleCheckboxToggle(comp, index)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                );
              })}
              </div>
              <div className="text-sm font-medium whitespace-nowrap">
                {comp.part_name}
              </div>     
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
});

export default ChecklistCard;
