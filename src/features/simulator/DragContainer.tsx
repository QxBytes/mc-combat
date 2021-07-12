import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { moveDamage, selectDamages } from '../activeSlice'
import { DamageItem } from '../calculations/damage'
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
                  { damages.length > 0 ?
                    <h5 className="text-left bottom-border p-1">Drag to reorder</h5> :
                    <h5 className="text-left p-1 muted">
                      Click "Add to simulator" in one of the calculators above to get started.
                    </h5>
                  }
                </Col>
            </Row>
          {damages.map((card: DamageItem, i: number) => renderCard(card, i))}
        </div>
      </>
    )
  
}
