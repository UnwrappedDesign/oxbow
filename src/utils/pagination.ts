export const paginate = <T>(url: string, items: T[], currentPage: number = 1, pageSize: number = 10) => {
  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    total: items.length,
    lastPage: Math.ceil(items.length / pageSize),
    data: items.slice(offset, offset + pageSize),
    url: {
      next: items.length > offset + pageSize ? `${url}/${currentPage + 1}` : null,
      prev: currentPage > 1 ? `${url}/${currentPage - 1}` : null
    }
  };
}
