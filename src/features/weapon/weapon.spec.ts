import * as a from '../calculations/armor';
import { Entity } from '../calculations/entity';
import { takeDamage } from '../utility/maths';

import * as w from './weapon';

describe('weapon damage calculator', () => {
    const weapon1 = w.makeWeapon(w.AXE, a.DIAMOND, w.getTicks(1), true, 0, 0, 0 );
    const weapon2 = w.makeWeapon(w.AXE, a.NETHERITE, w.getTicks(.40), true, 5, 2, 0);
    const weapon3 = w.makeWeapon(w.TRIDENT, a.DIAMOND, w.getTicks(.05), false, 5, 0, 0);
    const weapon4 = w.makeWeapon(w.SWORD, w.WOODEN, 30, false, 0, 0, 0);
    const weapon5 = w.makeWeapon(w.SWORD, a.NETHERITE, 10, false, 5, 0, 0);
    const weapon6 = w.makeWeapon(w.SHOVEL, a.NETHERITE, w.getTicks(.5), false, 1, 2, 1);
    
    const entity1: Entity = {
        armor: [
            a.make(a.NONE, a.HELMET, []), 
            a.make(a.LEATHER, a.CHESTPLATE, []), 
            a.make(a.LEATHER, a.LEGGINGS, []), 
            a.make(a.LEATHER, a.BOOTS, [])],
        effects: [],
        family: 'player'
    }
    it('should return the correct damage as a critical fully charged axe', () => {
      expect(w.getDamage(weapon1)).toBeCloseTo(13.5);
    });
    it('should have the correct multiplier factors', () => {
        expect(w.getDamageMultiplier(weapon2)).toBeCloseTo(.3445);
        expect(w.getEnchantModifier(weapon2)).toBeCloseTo(1.275);//how much enchant damage is done
    });
    it('should return the correct damage', () => {
        //13.212 (tested) hp left
        expect(w.getStrengthBonus(weapon2)).toBeCloseTo(6);
        expect(w.getDamage(weapon2)).toBeCloseTo(6.787);

        expect(takeDamage({amount: w.getDamage(weapon4), type: "melee", ticks: 10}, entity1)).toBeCloseTo(3.36);
    });
    it('should return the correct damage for a partial hit', () => {
        expect(w.getDamage(weapon5)).toBeCloseTo(8.64);
    })
    it('should return the correct damage with a non-sharpness compatible weapon', () => {
        expect(w.getDamageMultiplier(weapon3)).toBeCloseTo(.2054);
        expect(w.getEnchantModifier(weapon3)).toBeCloseTo(0);
        expect(w.getDamage(weapon3)).toBeCloseTo(1.8486);
    });
    it ('should return the correct damage with weakness and strength', () => {
        expect(w.getDamage(weapon6)).toBeCloseTo(3.574);
    });
});