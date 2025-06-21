
/**
 * Genera un color basado en un string usando un hash como el temas
 */
export function stringToColor(string: string): string {
    let hash = 0;
    let i;
    
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    
    return color;
}

/**
 * Genera las propiedades del avatar basado en el nombre y apellido
 */
export function getAvatarProps(name: string) {
    const nameParts = name.trim().split(' ');
    let initials = '';
    
    // Obtiene la primera letra del nombre
    if (nameParts.length > 0 && nameParts[0]) {
        initials += nameParts[0][0] || '';
    }
    
    // Obtiene la primera letra del apellido
    if (nameParts.length > 1 && nameParts[1]) {
        initials += nameParts[1][0] || '';
    }
    
    return {
        sx: {
        bgcolor: stringToColor(name),
        },
        children: initials.toUpperCase(),
    };
}

/**
 * Genera las propiedades del avatar con estilos de colorcitos
 */
export function getConditionalAvatarProps(name: string, isDisabled: boolean = false) {
  const baseProps = getAvatarProps(name);
  
  return {
    ...baseProps,
    sx: {
      ...baseProps.sx,
      opacity: isDisabled ? 0.6 : 1,
    },
  };
}