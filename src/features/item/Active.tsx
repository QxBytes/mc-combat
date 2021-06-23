import { useEffect } from "react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCount, incrementByAmount } from "../counter/counterSlice";
import { SimpleDamage } from "./damage";
import { Entity } from "./entity";
import * as a from "./armor";
import { takeDamage } from "./maths";
import * as d from "./damageTypes";

export function Active() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  useEffect( () => {
    let player = new Entity(
      [
        a.make(a.NETHERITE, a.HELMET, new Map([["fire protection",3]])),
        a.make(a.NETHERITE, a.CHESTPLATE, new Map()),
        a.make(a.NETHERITE, a.LEGGINGS, new Map()),
        a.make(a.NETHERITE, a.BOOTS, new Map([["protection",4],["feather falling",4]])),
      ], new Map(), 'player' );
    let dmg = new SimpleDamage(25, d.FALL);
    console.log("Taken: " + takeDamage(dmg, player));
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