import { useMemo } from 'react';

interface SortProps {
  by: string;
  type: 'asc' | 'des';
}

interface DataItem {
  title: string;
  [key: string]: any;
}

export function useFilteredData(data: DataItem[], options: SortProps) {
  return useMemo(() => {
    let filtered = [...data];
    if (options.by !== '') {
      switch (options.by) {
        case 'Name':
          filtered.sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          );
          break;
        case 'Last created':
          filtered.sort((a, b) => {
            console.log('hehe');
            if (a.versions && b.versions) {
              return (
                new Date(b.versions[0].created_at).getTime() -
                new Date(a.versions[0].created_at).getTime()
              );
            }
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          break;
        case 'Last modified':
          filtered.sort((a, b) => {
            if (a.versions && b.versions) {
              return (
                new Date(b.versions[0].last_updated).getTime() -
                new Date(a.versions[0].last_updated).getTime()
              );
            }
            return (
              new Date(b.last_updated).getTime() -
              new Date(a.last_updated).getTime()
            );
          });
          break;
        default:
          break;
      }
    }
    if (options.type === 'des') {
      filtered.reverse();
    }
    return filtered;
  }, [data, options]);
}
