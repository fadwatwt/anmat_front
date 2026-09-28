import {
  Activity, Archive, Bill, Book, Briefcase, Building, Building3, Building4,
  Call, Camera, Card, Category, Chart, Cloud, Cpu, Direct, Flash, Gallery,
  Global, Graph, Health, Heart, Lamp, Messages1, Money, Monitor, Music,
  Notification, People, Personalcard, SafeHome, Security, SecurityUser,
  Setting, Shop, ShopAdd, Star, Ticket, Truck, User, Verify, Video, Wallet,
} from 'iconsax-react';

// Keep the set intentionally finite. Importing the iconsax namespace pulls the
// complete icon library into every industry-related route.
export const INDUSTRY_ICONS = {
  Activity, Archive, Bill, Book, Briefcase, Building, Building3, Building4,
  Call, Camera, Card, Category, Chart, Cloud, Cpu, Direct, Flash, Gallery,
  Global, Graph, Health, Heart, Lamp, Messages1, Money, Monitor, Music,
  Notification, People, Personalcard, SafeHome, Security, SecurityUser,
  Setting, Shop, ShopAdd, Star, Ticket, Truck, User, Verify, Video, Wallet,
};

export const getIndustryIcon = (name) => INDUSTRY_ICONS[name] || Category;
