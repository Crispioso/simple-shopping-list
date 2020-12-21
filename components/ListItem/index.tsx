import { ListItem as ListItemT } from './types'

type Props = {
  item: ListItemT
  onChange: (checked: boolean) => void
}

export default function ListItem({ item, onChange }: Props) {
  const name = `item-completed-${item.id}`
  return (
    <>
      <label htmlFor={name}>{item.label}</label>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={(event) => onChange(event.currentTarget.checked)}
        id={name}
        name={name}
      />
    </>
  )
}
