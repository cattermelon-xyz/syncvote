export const createIdString = (title: String, id: String) => {
  let result = '';
  result = title.toLocaleLowerCase().replace(/([^\w ]|_)/g, '');
  result = result.split(' ').join('-');
  return `${result}-${id}`;
};

export const extractIdFromIdString = (idString: String | undefined) => {
  if (!idString) return -1;
  const id = idString?.split('-').pop();
  if (id === undefined) return -1;
  return parseInt(id, 10);
};
