// scripts/fetchItems.js
import fs from 'fs';
import Items from '@wfcd/items'; //if not getting new items, run npm update @wfcd/items
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const supabase = createClient(process.env.GATSBY_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function mapItem(item) {
  return {
    id: item.uniqueName,
    name: item.name,
    img_name: item.imageName,
    category: (item.productCategory === "SentinelWeapons") ? "SentinelWeapons" : item.category,
    product_category: item.productCategory,
    wikia_url: item.wikiaUrl,
    masterable: item.masterable
  };
}

function mapItemParts(item, part) {
  return{
    part_id: part.uniqueName,
    item_id: item.uniqueName,
    item_name: item.name,
    part_name: part.name,
    quantity: part.itemCount
  }
}

const versionFile = './.wfcd_version';

const getCurrentPackageVersion = () => {
  const pkg = JSON.parse(fs.readFileSync('./node_modules/@wfcd/items/package.json', 'utf-8'));
  return pkg.version;
};

const lastVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf-8') : null;
const currentVersion = getCurrentPackageVersion();

if (lastVersion === currentVersion) {
  console.log('✅ @wfcd/items is up-to-date, no update needed');
}

console.log(`🔄 Updating items: ${lastVersion || 'none'} -> ${currentVersion}`);



const categories = {
  warframes: item => item.category === 'Warframes',
  weapons: item => ['Primary', 'Secondary', 'Melee'].includes(item.category) && !['SentinelWeapons'].includes(item.productCategory),
  companions: item => ['Sentinels', 'SentinelWeapons', 'Pets'].includes(item.category) || ( ['Primary', 'Secondary', 'Melee'].includes(item.category) && ['SentinelWeapons'].includes(item.productCategory)),
  archwing: item => ['Arch-Gun', 'Arch-Melee', 'Archwing'].includes(item.category),
  misc: item => ['Misc'].includes(item.category),
};

(async () => {
  try {
    const options = {
      category: ['Warframes', 'Primary', 'Secondary', 'Melee', 'Misc', 'Sentinels', 'SentinelWeapons', 'Pets', 'Arch-Gun', 'Arch-Melee', 'Archwing'],
    };


    const itemsInstance = await new Items({ ...options, refresh: true });
    
    const allItems = itemsInstance;

    fs.mkdirSync('./src/data', { recursive: true });

    for (const [category, filterFn] of Object.entries(categories)) {
      const filtered = allItems.filter(filterFn);
      const {data, error} = await supabase.from('items').upsert(filtered.map(mapItem), { onConflict: ['id'] });
      if (error) console.error(`❌ Failed to upsert ${category}:`, error); 
      else console.log(`✅ Upserted ${data?.length ?? filtered.length} ${category} to Supabase`);
      
      const allParts = [];
      for (const item of filtered){
        if (!item.components) continue;
        for (const part of item.components){
          allParts.push(mapItemParts(item, part));
        }
      }
      const dedupedItemParts = new Map();
      for (const part of allParts){
        const key = `${part.part_id}::${part.item_id}`;
        if (dedupedItemParts.has(key)) {
          dedupedItemParts.get(key).quantity += part.quantity;
        } else {
          dedupedItemParts.set(key, { ...part });
        }
      }
      const dedupedPartsArray = Array.from(dedupedItemParts.values());
      const{data2, error2} = await supabase.from('item_parts').upsert(dedupedPartsArray, {onConflict: ['part_id', 'item_id']});
      if(error2) console.error(`❌ Failed to upsert ${category} parts:`, error);
      else console.log(`✅ Upserted ${data2?.length ?? filtered.length} ${category} parts to Supabase`);
      console.log(`${category} completed`);
      
    }
    fs.writeFileSync(versionFile, currentVersion);
  } catch (error) {
    console.error('❌ Failed to fetch Warframe items:', error);
    process.exit(1);
  }
})();