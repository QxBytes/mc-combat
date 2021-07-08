
import { NONE } from "./enchants";
import { Entry, exclusion, get, getValue, remove, set } from "../utility/map";

export const RESISTANCE = {key: 'resistance', value: 4};
export const HEALTH_BOOST = {key: 'health boost', value: 4};
export const ABSORPTION = {key: 'absorption', value: 4};
export const STRENGTH = {key: 'strength', value: 2};
export const WEAKNESS = {key: 'weakness', value: 1};

export const EFFECTS = [RESISTANCE, HEALTH_BOOST, ABSORPTION, STRENGTH, WEAKNESS, NONE];
export const ENTITY_EFFECTS = [RESISTANCE, HEALTH_BOOST, ABSORPTION, NONE];

export const WEAPON_EFFECTS = [STRENGTH, WEAKNESS, NONE];

export interface Effect extends Entry<string, number> {
    
}
export function makeEffect(type: string, level: number) {
    return {key: type, value: level};
}
export function setEffect(e: Effect[], type: string, value: number) {
    return set(e, type, value);
}
export function getEffect(e: Effect[], type: string ) {
    return get(e, type);
}
export function getEffectLevel(e: Effect[], type: string) {
    return getValue(e, type, 0);
}
export function removeEffect(e: Effect[], type: string) {
    remove(e, type);
}
export function excludeEffect(e: Effect[], other: Effect[]) {
    return exclusion(e, other);
}