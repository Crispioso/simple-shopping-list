import { ListItem } from '../ListItem/types'

export type ShoppingList = {
  id: string
  completedOn: string
  createdOn: string
  archivedOn: string
  items: Array<ListItem>
}
