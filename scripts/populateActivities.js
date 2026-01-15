// scripts/populateActivities.js
import fs from 'fs';
import Items from '@wfcd/items'; //if not getting new items, run npm update @wfcd/items
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const supabase = createClient(process.env.GATSBY_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const dailyActivities = [
  { category: "Dailies", name: "Sortie", id: "daily_sortie" },
  { category: "Dailies", name: "Incursions", id: "daily_incursions" },
  { category: "Dailies", name: "Duviri Harvest", id: "daily_duviri" },
  { category: "Dailies", name: "1999 Dating Sim", id: "daily_dating" },
  { category: "Dailies", name: "Nightwave Daily", id: "daily_nw-daily" },
  { category: "Dailies", name: "Focus Cap", id: "daily_focus" },
  { category: "Dailies", name: "Check Tenet Melees", id: "daily_tenet" },
  { category: "Dailies", name: "Check Coda Weapons", id: "daily_coda" },
];

const standingActivities = [
  { category: "Standing", name: "Pledged Syndicate", id: "daily_pledge" },
  { category: "Standing", name: "Ostron", id: "daily_ostron" },
  { category: "Standing", name: "The Quills", id: "daily_quills" },
  { category: "Standing", name: "Solaris United", id: "daily_solaris" },
  { category: "Standing", name: "Ventkids", id: "daily_ventkids" },
  { category: "Standing", name: "Vox Solaris", id: "daily_vox" },
  { category: "Standing", name: "Entrati", id: "daily_entrati" },
  { category: "Standing", name: "Necraloid", id: "daily_necraloid" },
  { category: "Standing", name: "Cavia", id: "daily_cavia" },
  { category: "Standing", name: "The Holdfasts", id: "daily_holdfasts" },
  { category: "Standing", name: "The Hex", id: "daily_hex" },
  { category: "Standing", name: "Cephalon Simaris", id: "daily_simaris" },
  { category: "Standing", name: "Conclave", id: "daily_conclave" },
];

const weeklyActivities = [
  { category: "Weeklies", name: "Trade in Riven Slivers", id: "weekly_slivers" },
  { category: "Weeklies", name: "Maroo Hunt", id: "weekly_maroo" },
  { category: "Weeklies", name: "Kahl Mission", id: "weekly_kahl" },
  { category: "Weeklies", name: "Archon Hunt", id: "weekly_archon" },
  { category: "Weeklies", name: "Netracells", id: "weekly_netracells" },
  { category: "Weeklies", name: "Deep Archimedea", id: "weekly_eda" },
  { category: "Weeklies", name: "Temporal Archimedea", id: "weekly_eta" },
  { category: "Weeklies", name: "1999 Calendar", id: "weekly_calendar" },
  { category: "Weeklies", name: "Nightwave Weekly", id: "weekly_nw" },
  { category: "Weeklies", name: "Circuit", id: "weekly_circuit" },
  { category: "Weeklies", name: "Steel Path Circuit", id: "weekly_sp-circuit" },
  { category: "Weeklies", name: "Trade in Steel Essence", id: "weekly_teshin" },
  { category: "Weeklies", name: "Buy Archon Shard from Bird 3", id: "weekly_bird3" },
  { category: "Weeklies", name: "Descendia", id: "weekly_descendia" }
];

const {dailiesData, dailiesError} = await supabase.from('activities').upsert(dailyActivities, {onConflict: 'id'});
if(dailiesError) {
  console.error("Error populating daily activities:", dailiesError);
} else {
  console.log("Daily activities populated/updated:", dailiesData);
}
const {standingsData, standingsError} = await supabase.from('activities').upsert(standingActivities, {onConflict: 'id'});
if(standingsError) {
  console.error("Error populating standing activities:", standingsError);
} else {
  console.log("Standing activities populated/updated:", standingsData);
}
const {weekliesData, weekliesError} = await supabase.from('activities').upsert(weeklyActivities, {onConflict: 'id'});
if(weekliesError) {
  console.error("Error populating weekly activities:", weekliesError);
} else {
  console.log("Weekly activities populated/updated:", weekliesData);
}