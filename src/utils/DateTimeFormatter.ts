export const FormatDate = (date: string) => {
  const dateObj = new Date(date);
  return `${dateObj.getDate()}-${
    dateObj.getMonth() + 1
  }-${dateObj.getFullYear()}`;
};

export const FormatDateTime = (date: string) => {
  const dateObj = new Date(date);
  return `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
};
