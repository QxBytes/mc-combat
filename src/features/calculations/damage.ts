
import * as d from './damageTypes';

export interface Damage {
    amount: number,
    type: string,
    ticks: number
}
export interface DamageItem {
    dmg: Damage,
    id: number,
    visible: boolean,
    times: number
}
export function find(items: DamageItem[], id: number) {
    for (let i = 0 ; i < items.length ; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return items[0];
}
export function equals(dmg1: Damage, dmg2: Damage) {
    if (dmg1.amount === dmg2.amount &&
        dmg1.ticks === dmg2.ticks &&
        dmg1.type === dmg2.type) {
            return true;
    }
    return false;
}
export function defaultDamage() {
    return {amount: 7, type: d.MELEE, ticks: 10}
}
export function copy(dmg: Damage) {
    return {amount: dmg.amount, ticks: dmg.ticks, type: dmg.type}
}