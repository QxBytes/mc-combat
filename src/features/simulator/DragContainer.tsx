import { FC, useState, useCallback } from 'react'
import { Card } from './DamageCard'
import update from 'immutability-helper'
import { useAppDispatch } from '../../app/hooks'
import { moveDamage, selectDamages } from '../item/activeSlice'
import { useSelector } from 'react-redux'
import { DamageItem } from '../item/damage'

const style = {
  width: 400,
}

export interface Item {
  id: number
  text: string
}


export const DragContainer: FC = () => {
    const dispatch = useAppDispatch();
    const damages = useSelector(selectDamages);

    const moveCard = 
      (dragIndex: number, hoverIndex: number) => {
        dispatch(moveDamage({from:dragIndex, to:hoverIndex}));
        /*
        const dragCard = cards[dragIndex]
        setCards(
          update(cards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragCard],
            ],
          }),
        )
        */
    }
    

    const renderCard = (card: DamageItem, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          visible={card.visible}
          times={card.times}
          id={card.id}
          damage={card.dmg}
          moveCard={moveCard}
        />
      )
    }

    return (
      <>
        <div className="container-top overflow-scroll">{damages.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  
}
