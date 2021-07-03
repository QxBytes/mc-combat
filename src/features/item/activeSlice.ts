import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import { RootState } from "../../app/store";
import * as a from "./armor";
import * as e from "./enchants";
import * as d from "./damageTypes";
import { Entity, MAX_SETUPS, removeSetup as removeEntity } from "./entity";
import { Damage } from "./damage";
import { defaultWeapon, Weapon } from "../weapon/weapon";

export interface matchState {
    setups: Entity[],
    damage: Damage
}
const initialState : matchState = {
    setups: [
        {
        armor: [
            a.make(a.NETHERITE, a.HELMET, [{key: "fire protection", value: 3}]),
            a.make(a.NETHERITE, a.CHESTPLATE, [{key: "blast protection", value: 2}, e.copy(e.PROJECTILE_PROTECTION)]),
            a.make(a.NETHERITE, a.LEGGINGS, [{key: "projectile protection", value: 1}]),
            a.make(a.NETHERITE, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING),
              e.copy(e.BLAST_PROTECTION), e.copy(e.PROJECTILE_PROTECTION), e.copy(e.FIRE_PROTECTION)])
          ], 
        effects: [], 
        family: 'player' 
        },
        {
            armor: [
                a.make(a.GOLDEN, a.HELMET, [{key: "fire protection", value: 3}]),
                a.make(a.GOLDEN, a.CHESTPLATE, [{key: "blast protection", value: 2}, e.copy(e.PROJECTILE_PROTECTION)]),
                a.make(a.GOLDEN, a.LEGGINGS, [{key: "projectile protection", value: 1}]),
                a.make(a.GOLDEN, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING),
                  e.copy(e.BLAST_PROTECTION), e.copy(e.PROJECTILE_PROTECTION), e.copy(e.FIRE_PROTECTION)])
              ], 
            effects: [], 
            family: 'player' 
        }
    ],
    damage: {
        amount: 18,
        type: d.MELEE
    }
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
        setDamageType: (state, action: PayloadAction<string>) => {
            state.damage.type = action.payload;
        },
        setDamage: (state, action: PayloadAction<number>) => {
            state.damage.amount = action.payload;
        },
        removeSetup: (state, action: PayloadAction<number>) => {
            removeEntity(state.setups, action.payload);
        },
        addSetup: (state, action: PayloadAction<Entity>) => {
            state.setups.push(action.payload);
        }
    }
});

export const {setType, setEnchant, removeEnchant, setDamageType, setDamage,
    removeSetup, addSetup} = activeSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectEntity = (state: RootState) => state.active.setups;
export const selectDamage = (state: RootState) => state.active.damage;

export default activeSlice.reducer;