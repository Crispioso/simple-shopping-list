import { useEffect, useState } from 'react'
import { ListItem as ListItemT } from './types'
import cx from 'classnames'
import styles from './ListItem.module.scss'

type Props = {
  item: ListItemT
  onCompletedChange: (checked: boolean) => void
  onItemLabelChange: (itemLabel: string) => void
  onQuantityChange: (quantity: number) => void
  handleRemoveListItem: () => void
}

export default function ListItem({
  item,
  onCompletedChange,
  onItemLabelChange,
  onQuantityChange,
  handleRemoveListItem,
}: Props) {
  const [label, setLabel] = useState(item.label)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const completedInputName = `item-completed-${item.id}`
  const labelInputName = `item-label-${item.id}`
  const { quantity, completed } = item

  return (
    <>
      <input
        type="checkbox"
        checked={completed}
        onChange={(event) => onCompletedChange(event.currentTarget.checked)}
        id={completedInputName}
        name={completedInputName}
      />
      <label
        htmlFor={completedInputName}
        className={cx({ [styles['hidden-label']]: isEditingLabel })}
      >
        {label ?? item.label}
      </label>
      {isEditingLabel && (
        <>
          <label
            htmlFor={labelInputName}
            className={cx({ [styles['hidden-label']]: isEditingLabel })}
          >
            New item name
          </label>
          <input
            type="text"
            id={labelInputName}
            name={labelInputName}
            onChange={(event) => setLabel(event.currentTarget.value)}
            value={label}
          />
        </>
      )}
      {quantity > 1 && (
        <>
          <span>
            {' '}
            <button onClick={() => onQuantityChange(quantity - 1)}>-</button> x
            {quantity}
          </span>
        </>
      )}
      <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
      {isEditingLabel ? (
        <button
          type="button"
          onClick={() => {
            setIsEditingLabel(false)
            if (label.trim() !== item.label) {
              onItemLabelChange(label)
            }
          }}
        >
          Save
        </button>
      ) : (
        <button type="button" onClick={() => setIsEditingLabel(true)}>
          Edit
        </button>
      )}
      <button onClick={() => handleRemoveListItem()}>Remove</button>
    </>
  )
}
