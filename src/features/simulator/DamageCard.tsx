import { FC, useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'

import { XYCoord } from 'dnd-core'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import { useAppDispatch } from '../../app/hooks'
import { Damage } from '../item/damage'
import { removeSetup } from '../item/entity'
import Icon from '../item/Icons'
import { removeDamage, saveDamage, toggleDamage } from '../item/activeSlice'
const _ = require('lodash');

const style = {
  border: '1px dashed gray',
  padding: '0rem .51rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface CardProps {
  id: any
  visible: boolean
  damage: Damage
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const Card: FC<CardProps> = ({ id, visible, damage, index, moveCard }) => {
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div className="text-left vc" ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Row className="align-items-center">
      <Col>
      <Form.Check inline 
            className="vc" 
            label="" 
            type={'checkbox'}
            onChange={(e) => dispatch(toggleDamage(id))} 
            defaultChecked
            />
        <span className="vc m-0">{damage.type}</span>
      </Col>
      <Col className="text-right">
        
        <ButtonGroup className="text-right">
          <Button onClick={() => 
              dispatch(saveDamage(
                  _.cloneDeep(damage)
              ))}
          >
              <Icon val="content_copy" />
          </Button>
          <Button onClick={() => dispatch(removeDamage(id))}>
              <Icon val="close" />
          </Button>
        </ButtonGroup>
      </Col>
      </Row>
    </div>
  )
}
