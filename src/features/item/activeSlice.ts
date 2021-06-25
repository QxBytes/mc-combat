import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import { RootState } from "../../app/store";
import * as a from "./armor";
import * as e from "./enchants";
import { Entity } from "./entity";

export interface matchState {
    entity: Entity
}
const initialState : matchState = {
    entity: {
        armor: [
          a.make(a.NETHERITE, a.HELMET, [{key: "fire protection", value: 3}]),
          a.make(a.NETHERITE, a.CHESTPLATE, []),
          a.make(a.NETHERITE, a.LEGGINGS, []),
          a.make(a.NETHERITE, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING),
            e.copy(e.BLAST_PROTECTION), e.copy(e.PROJECTILE_PROTECTION), e.copy(e.FIRE_PROTECTION)])
        ], 
        effects: [], 
        family: 'player' 
    }
}
export const activeSlice = createSlice( {
    name: 'active',
    initialState,
    reducers: {
        setType: (state, action: PayloadAction<{type: string, slot: number}>) => {
            a.setType(state.entity.armor[action.payload.slot], action.payload.type);
            console.log(action.payload.type);
            console.log(action.payload.slot);
            console.log(state.entity.armor[action.payload.slot].armor);
            console.log(state.entity.armor[action.payload.slot].toughness);
        },
        setEnchant: (state, action: PayloadAction<{name: string, level: number, slot: number}>) => {
            e.setEnchantment(state.entity.armor[action.payload.slot].enchantments, 
                action.payload.name, 
                action.payload.level);
        },
        removeEnchant: (state, action: PayloadAction<{name: string, slot: number}>) => {
            e.removeEnchant(state.entity.armor[action.payload.slot].enchantments, 
                action.payload.name);
        }
    }
});

export const {setType, setEnchant, removeEnchant} = activeSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectEntity = (state: RootState) => state.active.entity;

export default activeSlice.reducer;