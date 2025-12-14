import React from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

export enum DocType {
  CODE = 'CODE',
  DOC = 'DOC'
}