import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const normas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/normas' }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().default(0),
  }),
});

export const collections = { normas };
