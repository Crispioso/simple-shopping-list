import { ListItem as ListItemT } from './types'

type Props = {
  item: ListItemT
}

export default function ListItem({ item }: Props) {
  return <>{item.label}</>
}
