import { IMAGE_BASE_URL } from './constants'

export function mapItems(items: Array<any>) {
  return items.map((item: any) => {
    return {
      id: item.id,
      title: item.title,
      imageURL: `${IMAGE_BASE_URL}${item.image}`,
    }
  })
}
