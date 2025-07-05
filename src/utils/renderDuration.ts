export const renderDuration = (durationInMinutes: string | number) => {
  const duration = Number(durationInMinutes);
  if (duration < 60) {
    return `${duration} minutos`;
  } else {
    const durationInHours = duration / 60;
    return `${durationInHours} hora${durationInHours > 1 ? 's' : ''}`;
  }
};
