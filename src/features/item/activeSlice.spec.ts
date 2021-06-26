import * as a from './armor';
import * as e from './enchants';
import * as d from './damageTypes'
import { takeDamage } from './maths';

describe('counter reducer', () => {
    const player = {
        armor: [
          a.make(a.NETHERITE, a.HELMET, [{key: "fire protection", value: 3}]),
          a.make(a.NETHERITE, a.CHESTPLATE, [{key: "blast protection", value: 2}]),
          a.make(a.NETHERITE, a.LEGGINGS, [{key: "projectile protection", value: 1}]),
          a.make(a.NETHERITE, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING),
            e.copy(e.BLAST_PROTECTION), e.copy(e.PROJECTILE_PROTECTION), e.copy(e.FIRE_PROTECTION)])
        ], 
        effects: [], 
        family: 'player' 
    }
    it('should return the correct damage dealt with feather falling', () => {
        //epf: 16
      expect(takeDamage({amount: 25, type: d.FALL}, player)).toBeCloseTo(9);
    });
    it('should return the correct damage dealt with melee', () => {
        //epf: 4
      expect(takeDamage({amount: 25, type: d.MELEE}, player)).toBeCloseTo(8.4);
    });
    it('should return the correct damage dealt with fire', () => {
        //epf: 10
        expect(takeDamage({amount: 25, type: d.FIRE}, player)).toBeCloseTo(7);
      });
    it('should return the correct damage dealt with explosions', () => {
        //epf: 16
        expect(takeDamage({amount: 25, type: d.EXPLOSION}, player)).toBeCloseTo(3.6);
    });
});