import React from 'react';
import {
  Home, Zap, BookOpen, GraduationCap, Users, Settings, Building2, Plane,
  ShoppingCart, Trophy, ShieldCheck, Mail, Store, Globe, FileText, CheckSquare,
  Calculator, Calendar, Palette, Layers, Link as LinkIcon, ExternalLink, Folder,
  Tag, Briefcase, Star, HelpCircle, Heart, Compass, PhoneCall, CreditCard,
  Lock, UserCheck, Image as ImageIcon, Wrench, Package, Key, Film, LayoutDashboard,
  LucideProps
} from 'lucide-react';

export const ICON_CATALOG: Record<string, React.FC<LucideProps>> = {
  Home,
  Zap,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  Building2,
  Plane,
  ShoppingCart,
  Trophy,
  ShieldCheck,
  Mail,
  Store,
  Globe,
  FileText,
  CheckSquare,
  Calculator,
  Calendar,
  Palette,
  Layers,
  Link: LinkIcon,
  ExternalLink,
  Folder,
  Tag,
  Briefcase,
  Star,
  HelpCircle,
  Heart,
  Compass,
  PhoneCall,
  CreditCard,
  Lock,
  UserCheck,
  Image: ImageIcon,
  Wrench,
  Package,
  Key,
  Film,
  Dashboard: LayoutDashboard,
};

interface ShortcutIconProps extends LucideProps {
  name?: string;
  className?: string;
}

export const ShortcutIcon: React.FC<ShortcutIconProps> = ({ name, className = 'w-5 h-5', ...props }) => {
  if (!name) {
    return <LinkIcon className={className} {...props} />;
  }

  const Component = ICON_CATALOG[name];
  if (Component) {
    return <Component className={className} {...props} />;
  }

  // If icon name is unknown, render fallback LinkIcon
  return <LinkIcon className={className} {...props} />;
};

export default ShortcutIcon;
