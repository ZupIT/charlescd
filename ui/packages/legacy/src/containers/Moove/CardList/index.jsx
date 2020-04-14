import React, { useState, useEffect } from 'react'
import map from 'lodash/map'
import Translate from 'components/Translate'
import { COLORS } from 'core/assets/themes'
import LegoIcon from 'core/assets/svg/lego.svg'
import { StyledCardList } from './styled'


const CardList = ({ list, onSelectItem }) => {
  const [items, setItems] = useState(list)

  useEffect(() => {
    setItems(list)
  }, [list])

  const isCurrentItem = (mapItem, currentItem) => {
    const selectItem = () => ({ ...mapItem, selected: !mapItem?.selected })

    return mapItem.id === currentItem.id ? selectItem(mapItem) : mapItem
  }

  const handleOnClick = (item) => {
    const mapItems = map(items, currentItem => isCurrentItem(currentItem, item))

    setItems(mapItems)
    onSelectItem(mapItems)
  }

  const renderCard = (props) => {
    const { icon, color, id, name, selected } = props

    return (
      <StyledCardList.Card.Wrapper
        key={id}
        selected={selected}
        onClick={() => handleOnClick(props)}
      >
        <StyledCardList.Card.Icon
          color={color || COLORS.COLOR_NERO}
          selected={selected}
        >
          { icon || <LegoIcon /> }
        </StyledCardList.Card.Icon>
        <StyledCardList.Card.Title selected={selected}>
          <Translate id={name} />
        </StyledCardList.Card.Title>
      </StyledCardList.Card.Wrapper>
    )
  }

  return (
    <StyledCardList.Wrapper>
      {map(items, renderCard)}
    </StyledCardList.Wrapper>
  )
}

export default CardList
