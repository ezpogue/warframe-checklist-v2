import {useEffect, useState} from "react";

function usePersistentLocalStorage(key, defaultValue={}){
    const [hasLoaded, setHasLoaded] = useState(false);
    const [value, setValue] = useState(defaultValue);

    useEffect (() => {
        try{
            const stored = localStorage.getItem(key);
            if(stored){
                setValue(JSON.parse(stored));
            }
        }
        catch(err){
            console.warn(`Failed to parse localStorage key "${key}"`, err);
        }
        finally{
            setHasLoaded(true);
        }
    }, [key]);

    useEffect(() => {
        if(hasLoaded){
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value, hasLoaded]);

    return [value, setValue];
}

export default usePersistentLocalStorage;