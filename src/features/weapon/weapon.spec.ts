import * as a from '../item/armor';
import * as w from './weapon';

describe('weapon damage calculator', () => {
    const weapon1 = w.makeWeapon(w.AXE, a.DIAMOND, w.getTicks(1), true, 0, 0);
    const weapon2 = w.makeWeapon(w.SWORD, a.NETHERITE, w.getTicks(.40), true, 2, 2);
    const weapon3 = w.makeWeapon(w.TRIDENT, a.DIAMOND, w.getTicks(.05), false, 5, 0);
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
    });
    it('should return the correct damage', () => {
        expect(w.getDamageMultiplier(weapon3)).toBeCloseTo(.2054);
        expect(w.getEnchantModifier(weapon3)).toBeCloseTo(.2475);
        expect(w.getDamage(weapon3)).toBeCloseTo(2.0961);
    });
});