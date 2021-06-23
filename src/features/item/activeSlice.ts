import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as a from "./armor";
import { Entity } from "./entity";
import { MeleeWeapon, Weapon } from "./weapon";

export interface matchState {
    entity: Entity
}
const initialState : matchState = {
    entity: new Entity(
        [a.make(a.NONE, a.HELMET, new Map()),
        a.make(a.IRON, a.CHESTPLATE, new Map()),
        a.make(a.NETHERITE, a.LEGGINGS, new Map()),
        a.make(a.DIAMOND, a.BOOTS, new Map())],
        new Map(),
        "player")
};
export const activeSlice = createSlice( {
    name: 'active',
    initialState,
    reducers: {
        setType: (state, action: PayloadAction<{type: string, slot: number}>) => {
            console.log("called");
            state.entity.armor[action.payload.slot].setType(action.payload.type);
            console.log(action.payload.type);
            console.log(action.payload.slot);
        }
    }

});

export const {setType} = activeSlice.actions;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectEntity = (state: RootState) => state.active.entity;

export default activeSlice.reducer;