import React, { use, useState } from "react";
import LichWeaponsLegendComponent from "./lichWeaponsLegendComponent";
import LichWeaponsComponent from "./lichWeaponsComponent";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";
import clsx from "clsx";
import { useTheme } from "../lib/themeProvider.js";

const LichWeaponsTab = ({ user_id }) => {
    const theme = useTheme();
    const [hideFinished, setHideFinished] = usePersistentLocalStorage("hideFinished", false);
    if(!user_id) return(null);

    const getCheckBoxStyles = () => clsx(
        'scale-150 mr-2',{
          'accent-void-accent': theme === 'void',
          'accent-corpus-accent': theme === 'corpus',
          'accent-grineer-accent': theme === 'grineer',
          'accent-orokin-accent': theme === 'orokin',
          'accent-dark-accent': theme === 'dark',
          'accent-classic-accent': theme === 'classic',
        }
      );
    
    return(
        <div className="m-4">
            <div className="flex justify-between items-start mt-4 gap-2">
                <div className="flex-3">
                    <div className="flex flex-col justify-center items-center mt-4">
                        <LichWeaponsLegendComponent></LichWeaponsLegendComponent>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hideFinished}
                                onChange={(e) => setHideFinished(e.target.checked)}
                                className={getCheckBoxStyles()}
                            />
                            Hide Finished
                        </label>
                    </div>
                </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Kuva" user_id={user_id} hideFinished={hideFinished}></LichWeaponsComponent>
                    </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Tenet" user_id={user_id} hideFinished={hideFinished}></LichWeaponsComponent>
                </div>
                <div className="flex-5">
                    <LichWeaponsComponent type="Coda" user_id={user_id} hideFinished={hideFinished}></LichWeaponsComponent>
                </div>
            </div>
        </div>
    );
}

export default LichWeaponsTab;