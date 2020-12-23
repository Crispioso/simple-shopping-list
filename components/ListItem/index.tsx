import { useState } from 'react'
import { ListItem as ListItemT } from './types'
import cx from 'classnames'
import styles from './ListItem.module.scss'

type Props = {
  item: ListItemT
  onCompletedChange: (checked: boolean) => void
  onItemLabelChange: (itemLabel: string) => void
}

export default function ListItem({
  item,
  onCompletedChange,
  onItemLabelChange,
}: Props) {
  const [label, setLabel] = useState(item.label)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const completedInputName = `item-completed-${item.id}`
  const labelInputName = `item-label-${item.id}`

  return (
    <>
      <input
        type="checkbox"
        checked={item.completed}
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
    </>
  )
}
