export const categories = [
  { id: 'calma', name: 'Calma' },
  { id: 'ansiedad', name: 'Ansiedad' },
  { id: 'amor', name: 'Amor propio' },
  { id: 'energia', name: 'Energía' },
  { id: 'exito', name: 'Éxito' },
];

export function getCategoryName(categoryId) {
  return categories.find((category) => category.id === categoryId)?.name ?? 'Calma';
}
