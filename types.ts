import React from 'react';

export interface NavLink {
  name: string;
  href: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FeaturedProduct {
  title: string;
  subtitle: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'tertiary';
  highlight?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Industry {
  name: string;
  icon: React.ReactNode;
}
