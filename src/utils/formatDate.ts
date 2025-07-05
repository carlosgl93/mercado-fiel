export const formatDate = (dateString: Date | string, capitalize = false) => {
  const date = new Date(dateString);
  const now = new Date();

  const sameDay =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();

  if (sameDay) {
    return 'Hoy';
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const sameYesterday =
    yesterday.getDate() === date.getDate() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getFullYear() === date.getFullYear();

  if (sameYesterday) return 'Ayer';

  let formattedDate = date.toLocaleString('es-mx', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (capitalize) {
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};
