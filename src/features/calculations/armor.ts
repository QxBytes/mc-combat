import * as d from './damageTypes';
import * as e from './enchants';
import { Enchantment, getEnchantment, hasEnchantment } from "./enchants";
import { Item } from "./item";

export const LEATHER = 'Leather';
export const CHAINMAIL = 'Chainmail';
export const IRON = 'Iron';
export const DIAMOND = 'Diamond';
export const GOLDEN = 'Gold';
export const NETHERITE = 'Netherite';
export const TURTLE = 'Turtle';
export const NONE = 'Unequipped';
export const ELYTRA = 'Elytra';

export const HELMET = 'Helmet';
export const CHESTPLATE = 'Chestplate';
export const LEGGINGS = 'Leggings';
export const BOOTS = 'Boots';
export const MATERIAL_ARRAY = 
    [
    [NETHERITE, DIAMOND, IRON, CHAINMAIL, GOLDEN, LEATHER, TURTLE, NONE],
    [NETHERITE, DIAMOND, IRON, CHAINMAIL, GOLDEN, LEATHER, ELYTRA, NONE],
    [NETHERITE, DIAMOND, IRON, CHAINMAIL, GOLDEN, LEATHER, NONE],
    [NETHERITE, DIAMOND, IRON, CHAINMAIL, GOLDEN, LEATHER, NONE]
];
export const PIECE_ARRAY =
    [
        HELMET, CHESTPLATE, LEGGINGS, BOOTS
    ];
export const armor_data = new Map([
    [LEATHER, [1,3,2,1]],
    [CHAINMAIL, [2,5,4,1]],
    [IRON, [2,6,5,2]],
    [DIAMOND, [3,8,6,3]],
    [GOLDEN, [2,5,3,1]],
    [NETHERITE, [3,8,6,3]],
    [TURTLE, [2]],
    [ELYTRA, [0,0,0,0]],
    [NONE, [0,0,0,0]]
]);
export interface Armor extends Item{
    armor: number,
    toughness: number,
    type: string,
    piece: string,
    valid: Enchantment[]
}
export function make(type : string, piece : string, enchants: Enchantment[]) : Armor {
    let temp: Armor = {
        name: "",
        enchantments: enchants,
        armor: 0,
        toughness: 0,
        type: type,
        piece: piece,
        valid: getValid(piece)
    }
    setType(temp, type);
    return temp;
}
export function getValid(piece : string) {
    let valids : Enchantment[] = [];
    if (piece === BOOTS) {
        valids.push(e.copy(e.FEATHER_FALLING));
    }
    valids.push(e.copy(e.PROJECTILE_PROTECTION));
    valids.push(e.copy(e.PROTECTION));
    valids.push(e.copy(e.BLAST_PROTECTION));
    valids.push(e.copy(e.FIRE_PROTECTION));
    return valids;
}
export function getLeft(piece: string, alreadyApplied: Enchantment[] ) {
    let left : string[] = [e.NONE.key];
    let applied = alreadyApplied.map((ench) => ench.key);
    for (let str of getValid(piece).map((ench) => ench.key)) {
        if (!applied.includes(str)) {
            left.push(str);
        }
    }
    return left;
}
export function preset(a: Armor, type: string, piece: string) {
    a.name = type + " " + piece;
    let tough = getTough(type);
    
    if (piece === HELMET) {
        a.armor = armor_data.get(type)![0];
    }
    if (piece === CHESTPLATE) {
        a.armor = armor_data.get(type)![1];
    }
    if (piece === LEGGINGS) {
        a.armor = armor_data.get(type)![2];
    }
    if (piece === BOOTS) {
        a.armor = armor_data.get(type)![3];
    }
    a.toughness = tough;
}
export function setType(a: Armor, type: string) {
    a.type = type;
    preset(a, type, a.piece);
}
export function getTough(type: string) {
    if (type === DIAMOND) {
        return 2;
    }
    if (type === NETHERITE) {
        return 3;
    }
    return 0;
}

export function getEPF(a : Armor, type : string) : number {
    let val = 0;
    if (hasEnchantment(a.enchantments,e.FIRE_PROTECTION.key) &&
        type.includes(d.FIRE)) {
        val += 2 * getEnchantment(a.enchantments, e.FIRE_PROTECTION.key)!;
    } 
    if (hasEnchantment(a.enchantments, e.BLAST_PROTECTION.key) &&
        type.includes(d.EXPLOSION)) {
        val += 2 * getEnchantment(a.enchantments, e.BLAST_PROTECTION.key)!;
    } 
    if (hasEnchantment(a.enchantments, e.PROJECTILE_PROTECTION.key) &&
        type.includes(d.PROJECTILE)) {
        val += 2 * getEnchantment(a.enchantments, e.PROJECTILE_PROTECTION.key)!;
    }
    if (hasEnchantment(a.enchantments, e.PROTECTION.key)) {
        val += getEnchantment(a.enchantments, e.PROTECTION.key)!;
    }
    if (hasEnchantment(a.enchantments, e.FEATHER_FALLING.key) &&
            type.includes(d.FALL)) {
        val += 3 * getEnchantment(a.enchantments, e.FEATHER_FALLING.key)!;
    }
    //console.log("EPF: " + val);
    return val;
}

export function getSetEPF(set : Armor[], type : string) : number {
    let epf = 0;
    set.forEach( (item) => {
        epf += getEPF(item, type);
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
export function invalidEnchants(piece: Armor) : boolean {
    let limit = 2;
    if (hasEnchantment(piece.enchantments, e.FEATHER_FALLING.key)) {
        limit += 1;
    }
    return piece.enchantments.length >= limit;
}