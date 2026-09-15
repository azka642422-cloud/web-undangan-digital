import React from 'react';
import { InvitationTemplateProps } from '../types';
import { ModernMinimalistTemplate } from './ModernMinimalistTemplate';
import { KitabWalimahTemplate } from './KitabWalimahTemplate';
import { KitabKuningSantriTemplate } from './KitabKuningSantriTemplate';

// Registry interface mapping template slug to its React component
export type TemplateComponent = React.FC<InvitationTemplateProps>;

class TemplateRegistry {
  private registry: Map<string, TemplateComponent> = new Map();

  constructor() {
    // Register initial core templates
    this.register('modern-minimalist', ModernMinimalistTemplate);
    this.register('kitab-walimah', KitabWalimahTemplate);
    this.register('kitab-kuning-santri', KitabKuningSantriTemplate);
  }

  register(slug: string, component: TemplateComponent): void {
    this.registry.set(slug.toLowerCase().trim(), component);
  }

  get(slug: string): TemplateComponent {
    const component = this.registry.get(slug.toLowerCase().trim());
    if (!component) {
      // Fallback gracefully to default modern minimalist if an unregistered slug is requested
      return ModernMinimalistTemplate;
    }
    return component;
  }

  has(slug: string): boolean {
    return this.registry.has(slug.toLowerCase().trim());
  }

  listRegisteredSlugs(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const templateRegistry = new TemplateRegistry();
