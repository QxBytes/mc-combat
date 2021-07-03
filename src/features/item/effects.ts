
import { Entry, get, getValue, set } from "./map";

export const RESISTANCE = 'resistance';
export const STRENGTH = 'strength';
export const WEAKNESS = 'weakness';
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