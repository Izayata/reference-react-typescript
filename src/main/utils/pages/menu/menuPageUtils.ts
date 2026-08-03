export const MENU_CATEGORY = {
  SOUPS: 'SOUPS',
  MAIN_DISHES: 'MAIN_DISHES',
  DRINKS: 'DRINKS',
  DESSERTS: 'DESSERTS'
} as const

export type MenuCategory = typeof MENU_CATEGORY[keyof typeof MENU_CATEGORY]

interface MenuCategoryConfig {
  category: MenuCategory
  slug: string
  i18nKey: string
}

export const MENU_CATEGORIES: MenuCategoryConfig[] = [
  { category: MENU_CATEGORY.SOUPS, slug: 'soups', i18nKey: 'menu.soups' },
  { category: MENU_CATEGORY.MAIN_DISHES, slug: 'main-dishes', i18nKey: 'menu.mainDishes' },
  { category: MENU_CATEGORY.DRINKS, slug: 'drinks', i18nKey: 'menu.drinks' },
  { category: MENU_CATEGORY.DESSERTS, slug: 'desserts', i18nKey: 'menu.desserts' }
]

export function menuCategoryAnchorId(slug: string): string {
  return `menu-category-${slug}`
}

export function findMenuCategoryBySlug(slug: string | null): MenuCategoryConfig | undefined {
  return MENU_CATEGORIES.find(c => c.slug === slug)
}
