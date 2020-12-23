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
      const rsp = await fetch('/api/create-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          label,
        }),
      })
      const data = await rsp.json()
      return {
        id,
        ...data,
      }
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
  const getItemOrCreateNew = async (label) => {
    const existingItem = previousItems.find((item) => {
      return item.label === label
    })

    const itemInList = list.items.find((item) => item.label === label)
    if (itemInList != null) {
      updateQuantity(itemInList.quantity + 1, itemInList.id)
      setNewItemLabel('')
      return
    }

    try {
      // Create a new item if we're not adding an existing one to the list
      if (existingItem == null) {
        const newItem = await createItem(label, uuid())
        return newItem.id
      }
      return existingItem.id
    } catch (error) {
      console.error('Failed to create new item', error)
    }
  }
  const updateItemId = async (itemId, listItemId) => {
    const updatedListItems = listItems.map((item) => {
      if (item.id === listItemId) {
        return {
          ...item,
          itemId,
        }
      }
      return item
    })
    setListItems(updatedListItems)
    try {
      await fetch('/api/edit-list-item-ref', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          listItemId,
          itemId,
        }),
      })
    } catch (error) {
      console.error('Failed to update list item with new item ref', error)
    }
  }
  const updateQuantity = async (quantity, listItemId) => {
    const updatedListItems = listItems.map((item) => {
      if (item.id === listItemId) {
        return {
          ...item,
          quantity,
        }
      }
      return item
    })
    setListItems(updatedListItems)
    try {
      await fetch('/api/edit-list-item-quantity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          listItemId,
          quantity,
        }),
      })
    } catch (error) {
      console.error('Failed to update list item quantity', error)
    }
  }
  const removeItem = async (listItemId) => {
    const updatedListItems = listItems.filter((item) => item.id !== listItemId)
    setListItems(updatedListItems)
    try {
      await fetch('/api/remove-list-item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: list.id,
          listItemId,
        }),
      })
    } catch (error) {
      console.error('Failed to remove list item from list', error)
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedLabel = newItemLabel.trim()
    const existingItem = previousItems.find((item) => {
      return item.label === trimmedLabel
    })

    const itemInList = list.items.find((item) => item.label === trimmedLabel)
    if (itemInList != null) {
      updateQuantity(itemInList.quantity + 1, itemInList.id)
      setNewItemLabel('')
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
  const handleItemLabelChange = async (newLabel, listItemId) => {
    const itemId = await getItemOrCreateNew(newLabel)
    updateItemId(itemId, listItemId)
  }
  const handleQuantityChange = (quantity, listItemId) => {
    updateQuantity(quantity, listItemId)
  }
  const handleRemoveListItem = (listItemId) => {
    removeItem(listItemId)
  }

  return (
    <>
      <ul className={styles.list}>
        {listItems.map((item) => (
          <li key={item.id}>
            <ListItem
              item={item}
              onCompletedChange={(completed) =>
                handleCompletedToggle(completed, item.id)
              }
              onItemLabelChange={(newLabel) => {
                handleItemLabelChange(newLabel, item.id)
              }}
              onQuantityChange={(quantity) => {
                handleQuantityChange(quantity, item.id)
              }}
              handleRemoveListItem={() => {
                handleRemoveListItem(item.id)
              }}
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
    </>
  )
}
