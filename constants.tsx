import React from 'react';
import { NavLink, Feature, FeaturedProduct, FaqItem, Industry } from './types';
import {
  DiamondIcon,
  ShieldIcon,
  GlobeIcon,
  ChatIcon,
  CasinoIcon,
  FinanceIcon,
  EcommerceIcon,
  GamingIcon,
  DatingIcon,
  RealEstateIcon
} from './components/IconComponents';

export const navLinks: NavLink[] = [
  { name: 'Agency Services', href: '#agency-services' },
  { name: 'BM Products', href: '#products' },
  { name: 'Why Choose Us', href: '#why-us' },
  { name: 'FAQ', href: '#faq' },
];

export const whyChooseUsFeatures: Feature[] = [
  {
    icon: <DiamondIcon />,
    title: 'High-Quality Accounts',
    description: 'We provide stable, verified BM accounts ready for large-scale campaigns.'
  },
  {
    icon: <ShieldIcon />,
    title: 'Reliable Warranty',
    description: 'Clear warranty policies, including 1-for-1 replacements, ensure your investment is secure.'
  },
  {
    icon: <GlobeIcon />,
    title: 'Global Solutions',
    description: 'Our services have no geographical limits, serving clients worldwide across all industries.'
  },
  {
    icon: <ChatIcon />,
    title: '24/7 Expert Support',
    description: 'Our team is always available to consult, answer questions, and resolve any issues you may have.'
  }
];

export const featuredProducts: FeaturedProduct[] = [
    {
        title: 'BM Limit 250',
        subtitle: 'Economic Choice',
        features: ['$250 Spending Limit', 'Easy to Get Started', 'Reputable Warranty'],
        buttonText: 'View Details',
        buttonVariant: 'secondary',
    },
    {
        title: 'BM2500 Nolimit',
        subtitle: 'Superior Performance',
        features: ['No Spending Limit (Nolimit)', 'High Efficiency', 'Constantly Updated'],
        buttonText: 'Buy Now',
        buttonVariant: 'primary',
        highlight: true,
    },
    {
        title: 'BM VBM (Info US)',
        subtitle: 'Ultimate Solution',
        features: ['Nolimit & VBM US', 'Customizable Info', '7-Day Warranty'],
        buttonText: 'Request Consultation',
        buttonVariant: 'tertiary',
    }
];

export const faqItems: FaqItem[] = [
  {
    question: 'How long does it take to receive the account?',
    answer: 'Typically, you will receive the account information within 30 minutes to a few hours after successful payment, depending on the account type you choose.'
  },
  {
    question: 'How does the warranty policy work?',
    answer: 'We offer a 1-for-1 replacement policy within a specified period (e.g., 7 days for BM VBM) for any issues originating from our side. Our 24-hour "soaking" policy allows you to check the account before use.'
  },
  {
    question: "What's the difference between Limit and Nolimit accounts?",
    answer: 'Limit accounts have a daily spending cap (e.g., $250), making them ideal for testing. Nolimit accounts have no spending cap, allowing you to scale large campaigns without interruption.'
  },
  {
    question: 'What payment methods can I use?',
    answer: 'We offer flexible payment options, including Bank Transfer and cryptocurrency (USDT), to accommodate your needs.'
  }
];

export const agencyIndustries: Industry[] = [
    { name: 'Casino', icon: <CasinoIcon /> },
    { name: 'Finance', icon: <FinanceIcon /> },
    { name: 'E-commerce', icon: <EcommerceIcon /> },
    { name: 'Gaming', icon: <GamingIcon /> },
    { name: 'Dating', icon: <DatingIcon /> },
    { name: 'Real Estate', icon: <RealEstateIcon /> },
];
