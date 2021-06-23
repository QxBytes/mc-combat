import { Item } from "./item";
import * as e from './enchants';
import * as d from './damageTypes';

export const LEATHER = 'leather';
export const CHAINMAIL = 'chainmail';
export const IRON = 'iron';
export const DIAMOND = 'diamond';
export const GOLDEN = 'golden';
export const NETHERITE = 'netherite';
export const TURTLE = 'turtle';
export const NONE = 'no';

export const HELMET = 'helmet';
export const CHESTPLATE = 'chestplate';
export const LEGGINGS = 'leggings';
export const BOOTS = 'boots';

export const MATERIAL_ARRAY = [LEATHER, CHAINMAIL, IRON, DIAMOND, GOLDEN, NETHERITE, TURTLE, NONE];

export const armor_data = new Map([
    [LEATHER, [1,3,2,1]],
    [CHAINMAIL, [2,5,4,1]],
    [IRON, [2,6,5,2]],
    [DIAMOND, [3,8,6,3]],
    [GOLDEN, [2,5,3,1]],
    [NETHERITE, [3,8,6,3]],
    [TURTLE, [2]],
    [NONE, [0,0,0,0]]
]);

export function make(type : string, piece : string, enchants: Map<string,number>) : Armor {
    if (piece !== BOOTS) {
        return new Armor(type, piece, enchants);
    } else {
        return new Boots(type, piece, enchants);
    }
}

export class Armor implements Item {
    public valid : Map<string, number>;
    public armor : number;
    public toughness : number;
    public enchantments: Map<string,number>;
    public type: string;
    public piece: string;
    public name: string;
    constructor (
        type: string,
        piece: string,
        enchantments: Map<string, number>
    ) {
        this.enchantments = enchantments;
        this.armor = 0;
        this.toughness = 0;
        this.type = type;
        this.piece = piece;
        this.name = "None";
        this.init(type, piece);

        this.valid = new Map([
            [e.PROTECTION, 4],
            [e.PROJECTILE_PROTECTION, 4],
            [e.FIRE_PROTECTION, 4],
            [e.BLAST_PROTECTION, 4]
        ]);
    }
    getEPF(type : string) : number {
        let val = 0;
        if (this.enchantments.has(e.FIRE_PROTECTION) &&
            type.includes(d.FIRE)) {
            val += 2 * this.enchantments.get(e.FIRE_PROTECTION)!;
        } 
        if (this.enchantments.has(e.BLAST_PROTECTION) &&
            type.includes(d.EXPLOSION)) {
            val += 2 * this.enchantments.get(e.BLAST_PROTECTION)!;
        } 
        if (this.enchantments.has(e.PROJECTILE_PROTECTION) &&
            type.includes(d.PROJECTILE)) {
            val += 2 * this.enchantments.get(e.PROJECTILE_PROTECTION)!;
        }
        
        if (this.enchantments.has(e.PROTECTION)) {
            val += this.enchantments.get(e.PROTECTION)!;
        }
        return val;
    }
    init(type: string, piece: string) {
        this.name = type + " " + piece;
        let tough = 0;
        if (type === DIAMOND) {
            tough = 2;
        }
        if (type === NETHERITE) {
            tough = 3;
        }
        if (piece === HELMET) {
            this.armor = armor_data.get(type)![0];
        }
        if (piece === CHESTPLATE) {
            this.armor = armor_data.get(type)![1];
        }
        if (piece === LEGGINGS) {
            this.armor = armor_data.get(type)![2];
        }
        if (piece === BOOTS) {
            this.armor = armor_data.get(type)![3];
        }
        this.toughness = tough;
    }
    setType(type: string) {
        this.init(type, this.piece);
    }
    setPiece(piece: string) {
        this.init(this.type, piece);
    }

}
export class Boots extends Armor {
    constructor (
        type: string,
        piece: string,
        enchantments : Map<string, number>
    ) {
        super(type, piece, enchantments);
        this.valid.set(e.FEATHER_FALLING, 4);
    }
    getEPF(type : string) : number {
        let val = super.getEPF(type);
        if (this.enchantments.has(e.FEATHER_FALLING) &&
            type.includes(d.FALL)) {
            val += 3 * this.enchantments.get(e.FEATHER_FALLING)!;
        }
        return val;
    }
}
export function getSetEPF(set : Armor[], type : string) : number {
    let epf = 0;
    set.forEach( (item) => {
        epf += item.getEPF(type);
    })
    return Math.min(epf, 20);
}
export function getSetArmor(set : Armor[]) : number {
    let total = 0;
    set.forEach( (item) => {
        total += item.armor;
    });
    return total;
}
export function getSetToughness(set : Armor[]) : number {
    let total = 0;
    set.forEach( (item) => {
        total += item.toughness;
    });
    return total;
}