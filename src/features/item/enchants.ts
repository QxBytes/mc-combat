import { Entry, getValue, remove, set, shallowCopy } from "./map";

export interface Enchantment extends Entry<string, number> {

}
export function makeEnchant(name: string, level: number) {
    return {key: name, value: level};
}
export function copy(e : Enchantment) {
    return shallowCopy(e);
}
export function hasEnchantment(e : Enchantment[], name : string) : boolean{
    return getEnchantment(e, name) ? true: false;
}
export function getEnchantment(e : Enchantment[], name : string) : number {
    return getValue(e, name, 0);
}
export function setEnchantment(e: Enchantment[], name: string, level: number) {
    set(e, name, level);
}
export function removeEnchant(e: Enchantment[], name: string) {
    remove(e, name);
}
export const PROTECTION = {key:'protection', value: 4};
export const PROJECTILE_PROTECTION = {key:'projectile protection', value: 4};
export const BLAST_PROTECTION = {key: 'blast protection', value: 4};
export const FIRE_PROTECTION = {key: 'fire protection', value: 4};
export const FEATHER_FALLING = {key: 'feather falling', value: 4};

export const SHARPNESS = {key: 'sharpness', value: 5};

export const NONE = {key: "None", value: 5};

export const ENCHANT_ARRAY = [NONE, PROTECTION, PROJECTILE_PROTECTION, BLAST_PROTECTION, 
    FIRE_PROTECTION, FEATHER_FALLING, SHARPNESS];