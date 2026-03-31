import { fetchCanuckleArchive } from '$lib/canuckle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const archive = await fetchCanuckleArchive(30);

  return {
    archive
  };
};
