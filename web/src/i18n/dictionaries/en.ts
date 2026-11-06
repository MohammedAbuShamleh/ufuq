import { ar, type Dictionary } from './ar'

/**
 * English. Until its copy is written this repeats the Arabic, so /en renders
 * and every key is in place; the type keeps the two dictionaries the same shape.
 */
export const en: Dictionary = {
  ...ar,
}
