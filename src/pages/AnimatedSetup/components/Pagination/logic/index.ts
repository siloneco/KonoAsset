export const convertTabToIndex = (tab: 'appearance' | 'path' | 'details') => {
  switch (tab) {
    case 'appearance':
      return 1
    case 'path':
      return 2
    case 'details':
      return 3
  }
}
