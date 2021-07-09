import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { moveDamage, selectDamages } from '../item/activeSlice'
import { DamageItem } from '../item/calculations/damage'
import { Card } from './DamageCard'

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
        <div className="container-bottom overflow-scroll">
            <Row noGutters>
                <Col>
                    <h5 className="text-left bottom-border p-1">Drag to reorder</h5>
                </Col>
            </Row>
          {damages.map((card, i) => renderCard(card, i))}
        </div>
      </>
    )
  
}
