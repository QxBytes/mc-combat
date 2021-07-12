import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import * as a from "./calculations/armor";
import { Damage, DamageItem, find } from "./calculations/damage";
import * as d from "./calculations/damageTypes";
import * as f from "./calculations/effects";
import * as e from "./calculations/enchants";
import { Entity, removeSetup as removeEntity } from "./calculations/entity";

export interface matchState {
    setups: Entity[],
    damage: Damage,
    id: number,
    damages: DamageItem[]
}
const initialState : matchState = {
    setups: [
        {
        armor: [
            a.make(a.NETHERITE, a.HELMET, [e.copy(e.PROTECTION)]),
            a.make(a.NETHERITE, a.CHESTPLATE, [e.copy(e.PROTECTION)]),
            a.make(a.NETHERITE, a.LEGGINGS, [e.copy(e.PROTECTION)]),
            a.make(a.NETHERITE, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING)])
          ], 
        effects: [], 
        family: 'player' 
        },
    ],
    damage: {
        amount: 7,
        type: d.MELEE,
        ticks: 10
    },
    damages: [
    ],
    id: 99
}
export const activeSlice = createSlice( {
    name: 'active',
    initialState,
    reducers: {
        setType: (state, action: PayloadAction<{entity: number, type: string, slot: number}>) => {
            let p = action.payload;
            a.setType(state.setups[p.entity].armor[p.slot], p.type);
            //console.log("Type has been set: " + p.type);
            //console.log(p.slot);
            //console.log(state.setups[p.entity].armor[p.slot].armor);
            //console.log(state.setups[p.entity].armor[p.slot].toughness);
        },
        setEnchant: (state, action: PayloadAction<{entity: number, name: string, level: number, slot: number}>) => {
            let p = action.payload;
            if (p.name === e.NONE.key) return;
            e.setEnchantment(state.setups[p.entity].armor[p.slot].enchantments, 
                p.name, 
                p.level);
        },
        removeEnchant: (state, action: PayloadAction<{entity: number, name: string, slot: number}>) => {
            let p = action.payload;
            e.removeEnchant(state.setups[p.entity].armor[p.slot].enchantments, 
                p.name);
        },
        removeEffect: (state, action: PayloadAction<{entity: number, name: string}>) => {
            let p = action.payload;
            f.removeEffect(state.setups[p.entity].effects, p.name);
        },
        setEffect: (state, action: PayloadAction<{entity: number, name: string, level: number}>) => {
            let p = action.payload;
            f.setEffect(state.setups[p.entity].effects, p.name, p.level);
        },  
        setDamageType: (state, action: PayloadAction<string>) => {
            if (d.baseDamageType(action.payload) !== d.MELEE) {
                state.damage.ticks = 10;
            }
            state.damage.type = action.payload;
        },
        setDamage: (state, action: PayloadAction<number>) => {
            state.damage.amount = action.payload;
        },
        setDamageTicks: (state, action: PayloadAction<number>) => {
            state.damage.ticks = action.payload;
        },
        toggleDamage: (state, action: PayloadAction<number>) => {
            find(state.damages, action.payload).visible = !find(state.damages, action.payload).visible;
        },
        addDamageTimes: (state, action: PayloadAction<{id: number, change: number}>) => {
            let p = action.payload;
            find(state.damages, p.id).times += p.change;
            if (find(state.damages, p.id).times < 0) {
                find(state.damages, p.id).times = 0;
            }
        },
        removeSetup: (state, action: PayloadAction<number>) => {
            removeEntity(state.setups, action.payload);
        },
        addSetup: (state, action: PayloadAction<Entity>) => {
            state.setups.push(action.payload);
        },
        saveDamage: (state, action: PayloadAction<Damage>) => {
            state.id = state.id + 1;
            state.damages.push({dmg:action.payload, id:state.id+1, visible: true, times: 1});
        },
        //number is ID value!
        removeDamage: (state, action: PayloadAction<number>) => {
            for (let i = 0 ; i < state.damages.length ; i++) {
                if (state.damages[i].id === action.payload) {
                    state.damages.splice(i, 1);
                }
            }
        },
        moveDamage: (state, action: PayloadAction<{from: number, to: number}>) => {
            let p = action.payload;
            const moved = state.damages[p.from];
            state.damages.splice(p.from, 1);
            state.damages.splice(p.to, 0, moved);
        }
    }
});

export const {setType, setEnchant, removeEnchant, removeEffect, setEffect, setDamageType, setDamage,
    setDamageTicks, toggleDamage, addDamageTimes, removeSetup, addSetup, saveDamage, removeDamage, moveDamage} = activeSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectEntity = (state: RootState) => state.active.setups;
export const selectDamage = (state: RootState) => state.active.damage;
export const selectDamages = (state: RootState) => state.active.damages;

export default activeSlice.reducer;