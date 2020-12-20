import { ShoppingList as ShoppingListT } from './types'
import styles from './ShoppingList.module.scss'
import ListItem from '../ListItem'

type Props = {
  list: ShoppingListT
}

export default function ShoppingList({ list }: Props) {
  return (
    <ul className={styles.list}>
      {list.items.map((item) => (
        <li key={item.id}>
          <ListItem item={item} />
        </li>
      ))}
    </ul>
  )
}
