const MAPA: Record<string, string> = {
  á: 'a', à: 'a', ä: 'a', â: 'a', ã: 'a',
  é: 'e', è: 'e', ë: 'e', ê: 'e', ẽ: 'e',
  í: 'i', ì: 'i', ï: 'i', î: 'i', ĩ: 'i',
  ó: 'o', ò: 'o', ö: 'o', ô: 'o', õ: 'o',
  ú: 'u', ù: 'u', ü: 'u', û: 'u', ũ: 'u',
  ñ: 'n', ỹ: 'y',
};

// Debe coincidir con tf_normalizar() del servidor.
export function normalizar(texto: string): string {
  const base = texto.toLowerCase().replace(/[\u0300-\u036f]/g, '');
  let salida = '';
  for (const caracter of base) {
    salida += MAPA[caracter] ?? caracter;
  }
  return salida.replace(/[^a-z0-9]/g, '');
}

export function empiezaConLetra(palabra: string, letra: string): boolean {
  const limpia = normalizar(palabra);
  return limpia.length >= 2 && limpia.charAt(0) === letra.toLowerCase();
}

export function limpiar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}
