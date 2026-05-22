import { useMemo } from 'react';

export const useEmotionTheme = (emotion) => {
  return useMemo(() => {
    switch (emotion) {
      case 'calm':
        return {
          background: 'bg-blue-50',
          cardBackground: 'bg-white',
          text: 'text-gray-800',
          accent: 'bg-blue-500',
          spacing: 'relaxed',
          fontSize: 'normal',
          borderRadius: 'rounded',
          animations: true,
        };
      
      case 'stressed':
        return {
          background: 'bg-gray-100',
          cardBackground: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-purple-500',
          spacing: 'relaxed',
          fontSize: 'large',
          borderRadius: 'rounded',
          animations: true,
        };
      
      case 'happy':
        return {
          background: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          cardBackground: 'bg-white',
          text: 'text-gray-800',
          accent: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          spacing: 'normal',
          fontSize: 'normal',
          borderRadius: 'rounded',
          animations: false,
        };
      
      case 'focused':
        return {
          background: 'bg-slate-900',
          cardBackground: 'bg-slate-800',
          text: 'text-gray-100',
          accent: 'bg-emerald-500',
          spacing: 'compact',
          fontSize: 'normal',
          borderRadius: 'sharp',
          animations: false, 
        };
      
      case 'tired':
        return {
          background: 'bg-amber-50',
          cardBackground: 'bg-white',
          text: 'text-gray-700',
          accent: 'bg-amber-500',
          spacing: 'relaxed',
          fontSize: 'large',
          borderRadius: 'rounded',
          animations: false,
        };
      
      case 'confused':
        return {
          background: 'bg-indigo-50',
          cardBackground: 'bg-white',
          text: 'text-gray-800',
          accent: 'bg-indigo-500',
          spacing: 'relaxed',
          fontSize: 'large',
          borderRadius: 'normal',
          animations: true,
        };
      
      default:
        return {
          background: 'bg-white',
          cardBackground: 'bg-gray-50',
          text: 'text-gray-800',
          accent: 'bg-blue-500',
          spacing: 'normal',
          fontSize: 'normal',
          borderRadius: 'normal',
          animations: true,
        };
    }
  }, [emotion]);
};
