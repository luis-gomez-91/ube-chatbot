// utils/userHelpers.ts

export interface UserData {
  id?: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  provider?: string;
}

/**
 * Obtiene el nombre completo del usuario según el proveedor
 */
export const getFullName = (userData: UserData | null, authProvider: string = 'drf'): string => {
  if (!userData) return 'Usuario';

  // Google y Facebook
  if (authProvider === 'google' || authProvider === 'facebook') {
    if (userData.user_metadata?.full_name) {
      return userData.user_metadata.full_name;
    }
    return userData.email || 'Usuario';
  }

  // DRF
  if (authProvider === 'ube') {
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return userData.name || userData.email || 'Usuario';
  }

  return userData.name || userData.email || 'Usuario';
};

/**
 * Obtiene solo el primer nombre del usuario
 */
export const getFirstName = (userData: UserData | null, authProvider: string = 'drf'): string => {
  const fullName = getFullName(userData, authProvider);
  return fullName.split(' ')[0] || 'Usuario';
};

/**
 * Obtiene el email del usuario
 */
export const getUserEmail = (userData: UserData | null): string => {
  return userData?.email || 'Sin email';
};

/**
 * Obtiene la foto de perfil (solo para Google/Facebook)
 */
export const getUserAvatar = (userData: UserData | null, authProvider: string = 'drf'): string | null => {
  if (authProvider === 'google' || authProvider === 'facebook') {
    return userData?.user_metadata?.avatar_url || null;
  }
  return null;
};