
import { Weapon } from "../weapon/weapon";
import * as d from './damageTypes';
import * as e from './effects';

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
/*
export class Damage implements DamageType {
    //Required (How you implement an interface)
    constructor (public type : string) {
    }
    public getDamage() {
        return -404;
    }
}
*/
/*
export class SimpleDamage extends Damage {
    public amount : number;
    constructor( 
        amount : number,
        kind : string
    ) {
        super(kind);
        this.amount = amount;
    }
    public getDamage() {
        return this.amount;
    }
}
*/
/*
export class MeleeDamage extends Damage {
    constructor (
        public weapon : Weapon,
        public critical : boolean,
        public effects : Map<string,number>
        ) {
        
        super(d.MELEE)
    }
    public getDamage() {
        let crit = this.critical ? 1.5 : 1;
        return (this.weapon.getDamage() + 
            getStrengthBonus(this.effects.get(e.STRENGTH) || 0, d.MELEE)) * crit +
            this.weapon.getEnchantDamage();

    }
}
export class MagicDamage extends Damage {
    constructor (
        public level : number
    ) {
        super(d.MAGIC);
    }
    public getDamage() {
        return 3 * this.level;
    }
}
*/