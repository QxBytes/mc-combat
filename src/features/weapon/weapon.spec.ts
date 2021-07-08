import * as a from '../item/calculations/armor';
import { Entity } from '../item/calculations/entity';
import { takeDamage } from '../item/utility/maths';
import * as w from './weapon';

describe('weapon damage calculator', () => {
    const weapon1 = w.makeWeapon(w.AXE, a.DIAMOND, w.getTicks(1), true, 0, 0, 0 );
    const weapon2 = w.makeWeapon(w.SWORD, a.NETHERITE, w.getTicks(.40), true, 2, 2, 0);
    const weapon3 = w.makeWeapon(w.TRIDENT, a.DIAMOND, w.getTicks(.05), false, 5, 0, 0);
    const weapon4 = w.makeWeapon(w.SWORD, w.WOODEN, 30, false, 0, 0, 0);
    const weapon5 = w.makeWeapon(w.SWORD, a.NETHERITE, 10, false, 5, 0, 0);
    
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
        expect(w.getDamageMultiplier(weapon2)).toBeCloseTo(.5699);
        expect(w.getEnchantModifier(weapon2)).toBeCloseTo(1.02);
    });
    it('should return the correct damage', () => {
        expect(w.getStrengthBonus(weapon2)).toBeCloseTo(6);
        expect(w.getDamage(weapon2)).toBeCloseTo(11.5792);

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
});