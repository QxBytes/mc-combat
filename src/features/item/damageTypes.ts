export const FIRE = 'Fire';
export const MELEE = 'Melee';
export const FALL = 'Fall';
export const EXPLOSION = 'Explosion';
export const PROJECTILE = 'Projectile';
export const MAGIC = 'Magic';

export const DAMAGE_ARRAY = [FIRE, MELEE, FALL, EXPLOSION, PROJECTILE, MAGIC];

export function baseDamageType(val: string) {
    for (let item of DAMAGE_ARRAY) {
        if (val.includes(item)) {
            return item;
        }
    }
    return "Standard Damage";
}