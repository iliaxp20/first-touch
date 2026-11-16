import React from 'react';
import { TopAppBar } from './TopAppBar';

interface NavbarProps {
  activeRole?: 'COACH' | 'STUDENT' | 'PLAYER' | 'PARENT';
  userName?: string;
  isProfileComplete?: boolean;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  return <TopAppBar maxWidthClass="max-w-5xl" />;
};
