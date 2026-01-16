import React, {useEffect} from "react";
import { supabase } from "../lib/supabaseClient";
import LichWeaponsItem from "./lichWeaponsItem"

const LichWeaponsComponent = ({ type, user_id }) => {

    const [weapons, setWeapons] = React.useState([]);
    useEffect(() => {
        const fetchLichWeapons = async () => {
            const { data, error } = await supabase
                .from("items")
                .select("id, name, img_name, wikia_url")
                .eq("masterable", true)
                .ilike("name", `%${type}%`);
            if (error) {
                console.error("Error fetching lich weapons:", error);
            } else {
                setWeapons(data);
            }
            console.log(`${type} lich weapons fetched:`, data);
        };
        fetchLichWeapons();
    }, [type]);



    return(
        <div className="min-w-fit">
            <h3>{type}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 justify-start mx-auto">
                {weapons.map((weapon) => (
                    <LichWeaponsItem 
                        key={weapon.id} 
                        item_id={weapon.id} 
                        name={weapon.name} 
                        imageName={weapon.img_name} 
                        wiki={weapon.wikia_url} 
                        user_id={user_id} 
                    />
                ))}
            </div>
        </div>
    );
};

export default LichWeaponsComponent;