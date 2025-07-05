/**;
 *
 * @param recurrency: string
 * @returns  Returns the proper spanish recurrency text
 *
 */

export function getRecurrencyText(recurrency: Recurrency, nPerRecurrency?: number) {
  if (nPerRecurrency) {
    switch (recurrency) {
      case 'one-off':
        return 'Una vez';
      case 'weekly':
        return `${nPerRecurrency} veces por semana`;
      case 'monthly':
        return `${nPerRecurrency} veces por mes`;
      default:
        return '';
    }
  }
  switch (recurrency) {
    case 'one-off':
      return 'Una vez';
    case 'weekly':
      return 'Semanalmente';
    case 'monthly':
      return 'Mensualmente';
    default:
      return '';
  }
}

export type Recurrency = 'one-off' | 'weekly' | 'monthly';
