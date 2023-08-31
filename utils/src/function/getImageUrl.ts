export const getImageUrl = ({
  filePath = '',
  isPreset,
  type,
}: {
  filePath?: string;
  isPreset: boolean;
  type: string;
}): string => {
  if (filePath && filePath.includes('https')) {
    return filePath;
  }
  if (filePath === null || filePath === 'null') {
    return '';
  }
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  let str = '';
  if (isPreset) {
    str = `${supabaseUrl}/storage/v1/object/public/preset_images/${type}/${filePath}`;
  } else if (filePath) {
    str = `${supabaseUrl}/storage/v1/object/public/public_images/${filePath}`;
  }
  return str;
};
