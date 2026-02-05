import { schedule } from '@netlify/functions';
import Items from '@wfcd/items';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  return {
    part_id: part.uniqueName,
    item_id: item.uniqueName,
    item_name: item.name,
    part_name: part.name,
    quantity: part.itemCount
  };
}

const categories = {
  warframes: item => item.category === 'Warframes',
  weapons: item => ['Primary', 'Secondary', 'Melee'].includes(item.category) && !['SentinelWeapons'].includes(item.productCategory),
  companions: item => ['Sentinels', 'SentinelWeapons', 'Pets'].includes(item.category) || (['Primary', 'Secondary', 'Melee'].includes(item.category) && ['SentinelWeapons'].includes(item.productCategory)),
  archwing: item => ['Arch-Gun', 'Arch-Melee', 'Archwing'].includes(item.category),
  misc: item => ['Misc'].includes(item.category),
};

const handler = async (event, context) => {
  try {
    console.log('🔄 Fetching Warframe items...');
    
    const options = {
      category: ['Warframes', 'Primary', 'Secondary', 'Melee', 'Misc', 'Sentinels', 'SentinelWeapons', 'Pets', 'Arch-Gun', 'Arch-Melee', 'Archwing'],
    };

    const itemsInstance = await new Items({ ...options, refresh: true });
    const allItems = itemsInstance;

    for (const [category, filterFn] of Object.entries(categories)) {
      const filtered = allItems.filter(filterFn);
      
      const { data, error } = await supabase
        .from('items')
        .upsert(filtered.map(mapItem), { onConflict: ['id'] });
      
      if (error) {
        console.error(`❌ Failed to upsert ${category}:`, error);
      } else {
        console.log(`✅ Upserted ${data?.length ?? filtered.length} ${category} to Supabase`);
      }
      
      const allParts = [];
      for (const item of filtered) {
        if (!item.components) continue;
        for (const part of item.components) {
          allParts.push(mapItemParts(item, part));
        }
      }
      
      const dedupedItemParts = new Map();
      for (const part of allParts) {
        const key = `${part.part_id}::${part.item_id}`;
        if (dedupedItemParts.has(key)) {
          dedupedItemParts.get(key).quantity += part.quantity;
        } else {
          dedupedItemParts.set(key, { ...part });
        }
      }
      
      const dedupedPartsArray = Array.from(dedupedItemParts.values());
      const { data2, error2 } = await supabase
        .from('item_parts')
        .upsert(dedupedPartsArray, { onConflict: ['part_id', 'item_id'] });
      
      if (error2) {
        console.error(`❌ Failed to upsert ${category} parts:`, error2);
      } else {
        console.log(`✅ Upserted ${data2?.length ?? dedupedPartsArray.length} ${category} parts to Supabase`);
      }
      
      console.log(`${category} completed`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Items fetched and updated successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('❌ Failed to fetch Warframe items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Runs daily at midnight UTC
export default schedule("0 0 * * *", handler);