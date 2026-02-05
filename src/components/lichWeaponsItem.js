import React, {useState, useEffect, useCallback} from "react";
import { useTheme } from "../lib/themeProvider";
import clsx from "clsx";
import { supabase } from "../lib/supabaseClient";
import {debounce} from "lodash";

const LichWeaponsItem = ({ item_id, name, imageName, wiki, user_id, hideFinished }) => {
    const { theme } = useTheme();
    const [fusions, setFusions] = useState(10);

    useEffect(() => {
        const fetchUserLichWeapons = async () => {
            const { data, error } = await supabase
                .from("user_lich_weapons")
                .select("fusions_remaining")
                .eq("user_id", user_id)
                .eq("item_id", item_id)
                .single();
            if (error) {
                console.error("Error fetching user lich weapon fusions:", error);
            } else {
                setFusions(data?.fusions_remaining ?? 10);
            }
        };
        fetchUserLichWeapons();
    }, [user_id, item_id]);


    const getLichItemStyles = (theme) => clsx(
        'flex items-center p-3 pr-4 m-0.5 rounded-lg shadow cursor-default relative flex-1 border-4 transition duration-400 ease-in-out min-w-fit', {
            'hidden': hideFinished && fusions === 0,
            'bg-void-card border-void-border text-void-text': theme === 'void' && fusions !== 0,
            'bg-void-card border-void-accent text-void-text': theme === 'void' && fusions === 0,
            'bg-corpus-card border-corpus-border text-corpus-text': theme === 'corpus' && fusions !== 0,
            'bg-corpus-card border-corpus-accent text-corpus-text': theme === 'corpus' && fusions === 0,
            'bg-grineer-card border-grineer-border text-grineer-text': theme === 'grineer' && fusions !== 0,
            'bg-grineer-card border-grineer-accent text-grineer-text': theme === 'grineer' && fusions === 0,    
            'bg-orokin-card border-orokin-border text-orokin-text': theme === 'orokin' && fusions !== 0,
            'bg-orokin-card border-orokin-accent text-orokin-text': theme === 'orokin' && fusions === 0,
            'bg-dark-card border-dark-border text-dark-text': theme === 'dark' && fusions !== 0,
            'bg-dark-card border-dark-accent text-dark-text': theme === 'dark' && fusions === 0,
            'bg-classic-card border-classic-border text-classic-text': theme === 'classic' && fusions !== 0,
            'bg-classic-card border-classic-accent text-classic-text': theme === 'classic' && fusions === 0,
        }
    )
    const getCardCheckStyles = (theme) => clsx(
    'absolute top-2.5 right-2.5 text-2xl z-10 transition duration-400 ease-in-out',{
        'opacity-0 pointer-events-none': fusions !== 0,
        'opacity-100': fusions === 0,
        'text-void-accent': theme === 'void',
        'text-corpus-accent': theme === 'corpus',
        'text-grineer-accent': theme === 'grineer',
        'text-orokin-accent': theme === 'orokin',
        'text-dark-accent': theme === 'dark',
        'text-classic-accent': theme === 'classic',
    }
    );

    const getButtonStyles = (theme) => clsx(
        'w-6 h-6 rounded-full bg-opacity-50 hover:bg-opacity-75 transition border-2 flex items-center justify-center',{
            'border-void-accent': theme === 'void',
            'border-corpus-accent': theme === 'corpus',
            'border-grineer-accent': theme === 'grineer',
            'border-orokin-accent': theme === 'orokin',
            'border-dark-accent': theme === 'dark',
            'border-classic-accent': theme === 'classic',
        }
    );

    const updateQueueRef = React.useRef(null);

    const debouncedBatchUpdate = useCallback(
        debounce(async () => {
            if (updateQueueRef.current !== null) {
                const { error } = await supabase
                    .from("user_lich_weapons")
                    .update({ fusions_remaining: updateQueueRef.current })
                    .eq("user_id", user_id)
                    .eq("item_id", item_id);
                if (error) {
                    console.error("Error updating user lich weapon fusions:", error);
                }
            }
        }, 300),
        [user_id, item_id]
    );

    const handleIncrement = () => setFusions(prev => {
        const newFusions = Math.min(10, prev + 1);
        updateQueueRef.current = newFusions;
        debouncedBatchUpdate();
        return newFusions;
    });

    const handleDecrement = () => setFusions(prev => {
        const newFusions = Math.max(0, prev - 1);
        updateQueueRef.current = newFusions;
        debouncedBatchUpdate();
        return newFusions;
    });

    return(
       <div className={getLichItemStyles(theme)}>
            <div
            className={getCardCheckStyles(theme)}
            >
            ✔
            </div>
            <div className="flex gap-2 items-center">
                <img src={`https://cdn.warframestat.us/img/${imageName}`} alt={name} className="w-10 h-10 object-cover rounded-lg justify-center cursor-default"/>
                <div>
                    <h4 className="text-sm cursor-default font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        <a
                        href={wiki}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block no-underline transition transform duration-200 ease-in-out hover:scale-105 "
                        >
                            {name}
                        </a>
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                        <button 
                            onClick={handleDecrement}
                            className={getButtonStyles(theme)}
                        >
                            -
                        </button>
                        <span className="text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis"><strong>{fusions}</strong><br/> fusions left</span>
                        <button 
                            onClick={handleIncrement}
                            className={getButtonStyles(theme)}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
       </div> 
    );
}

export default LichWeaponsItem;