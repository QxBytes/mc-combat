import { useEffect } from "react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCount, incrementByAmount } from "../counter/counterSlice";
import { Entity } from "./entity";
import * as a from "./armor";
import { takeDamage } from "./maths";
import * as d from "./damageTypes";
import * as e from "./enchants";

export function Active() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  useEffect( () => {
    /*
    let player : Entity = {
      armor: [
        a.make(a.NETHERITE, a.HELMET, [e.makeEnchant(e.FIRE_PROTECTION.key, 4)]),
        a.make(a.NETHERITE, a.CHESTPLATE, []),
        a.make(a.NETHERITE, a.LEGGINGS, []),
        a.make(a.NETHERITE, a.BOOTS, [e.copy(e.PROTECTION), e.copy(e.FEATHER_FALLING),
          e.copy(e.BLAST_PROTECTION), e.copy(e.PROJECTILE_PROTECTION), e.copy(e.FIRE_PROTECTION)])
      ], 
      effects: [], 
      family: 'player' 
    };
    let dmg = {amount: 25, type: d.FALL};
    console.log("Taken: " + takeDamage(dmg, player));
    */
  })
  return (
    <div>
      <div>
        <span>CUSTOM {count}</span>
        <button
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
      </div>
    </div>
  );
}