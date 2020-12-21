import { ShoppingList as ShoppingListT } from './types'
import styles from './ShoppingList.module.scss'
import ListItem from '../ListItem'
import { ListItem as ListItemT } from '../ListItem/types'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'

type Props = {
  list: ShoppingListT
  previousItems: Array<{ id: string; addedOn: string; label: string }>
}

export default function ShoppingList({ list, previousItems }: Props) {
  const [newItemLabel, setNewItemLabel] = useState<string>('')
  const [listItems, setListItems] = useState<ListItemT[]>(list.items)
  const toggleItemCompleted = async (completed, listItemId) => {
    const updatedListItems = listItems.map((item) => {
      if (item.id === listItemId) {
        return {
          ...item,
          completed,
        }
      }
      return item
    })
    setListItems(updatedListItems)
    try {
      await fetch('/api/toggle-list-item', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          completed,
          listItemId,
        }),
      })
    } catch (error) {
      console.error('Failed to toggle completed state', error)
    }
  }
  const createItem = async (label, id) => {
    try {
      await fetch('/api/create-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          label,
        }),
      })
    } catch (error) {
      throw error
    }
  }
  const addItemToList = async (itemId) => {
    const newItem = {
      id: uuid(),
      completed: false,
      quantity: 1,
      itemId,
    }

    await fetch('/api/add-item-to-list', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listId: list.id, item: newItem }),
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedLabel = newItemLabel.trim()
    const existingItem = previousItems.find((item) => {
      return item.label === trimmedLabel
    })

    const itemInList = list.items.find((item) => item.label === trimmedLabel)
    if (itemInList != null) {
      // Up quantity of existing item instead of adding new item
      console.warn(
        'TODO: Build upping quantity when trying to add existing item again',
      )
      return
    }

    const newItemId = existingItem?.id ?? uuid()
    setListItems([
      ...listItems,
      {
        id: newItemId,
        label: trimmedLabel,
        addedOn: new Date().toISOString(),
        completed: false,
        quantity: 1,
      },
    ])
    setNewItemLabel('')

    try {
      // Create a new item if we're not adding an existing one to the list
      if (existingItem == null) {
        await createItem(trimmedLabel, newItemId)
      }

      // Make request to add new item to list
      await addItemToList(newItemId)
    } catch (error) {
      console.error('Failed to add new item to list', error)
    }
  }
  const handleCompletedToggle = (completed, listItemId) => {
    toggleItemCompleted(completed, listItemId)
  }

  // const allItems = [...list.items, ...addedItems]

  return (
    <>
      <ul className={styles.list}>
        {listItems.map((item) => (
          <li key={item.id}>
            <ListItem
              item={item}
              onChange={(completed) =>
                handleCompletedToggle(completed, item.id)
              }
            />
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-item-label"></label>
        <input
          type="text"
          id="new-item-label"
          name="new-item-label"
          onChange={(event) => setNewItemLabel(event.currentTarget.value)}
          value={newItemLabel}
        />
        <button type="submit">Add</button>
      </form>
      <br />
      {/* <button type="button" onClick={() => addItem('abc-123')}>
        Add
      </button> */}
    </>
  )
}
