import React, { use, useState } from "react";
import LichWeaponsLegendComponent from "./lichWeaponsLegendComponent";
import LichWeaponsComponent from "./lichWeaponsComponent";

const LichWeaponsTab = ({ user_id }) => {
    if(!user_id) return(null);
    return(
        <div className="m-4">
            <div className="flex justify-between items-start mt-4 gap-2">
                <div className="flex-3">
                    <div className="flex justify-center items-center mt-4">
                        <LichWeaponsLegendComponent></LichWeaponsLegendComponent>
                    </div>
                </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Kuva" user_id={user_id}></LichWeaponsComponent>
                    </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Tenet" user_id={user_id}></LichWeaponsComponent>
                </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Coda" user_id={user_id}></LichWeaponsComponent>
                </div>
            </div>
        </div>
    );
}

export default LichWeaponsTab;