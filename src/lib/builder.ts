import { Builder } from '@builder.io/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const BUILDER_API_KEY = '4c9fdc80a9af4b7aab035bd9ee84e352';

Builder.apiKey = BUILDER_API_KEY;

export function initBuilder() {
  Builder.registerComponent(Button, {
    name: 'Button',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/button.png',
    inputs: [
      {
        name: 'text',
        type: 'string',
        defaultValue: 'Click me'
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        defaultValue: 'default'
      },
      {
        name: 'size',
        type: 'string',
        enum: ['default', 'sm', 'lg', 'icon'],
        defaultValue: 'default'
      },
      {
        name: 'onClick',
        type: 'string',
        enum: ['navigate', 'submit', 'reset'],
        defaultValue: 'navigate'
      },
      {
        name: 'href',
        type: 'string',
        helperText: 'URL to navigate to when clicked'
      }
    ]
  });

  Builder.registerComponent(Card, {
    name: 'Card',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/card.png',
    inputs: [
      {
        name: 'className',
        type: 'string'
      },
      {
        name: 'padding',
        type: 'string',
        enum: ['none', 'small', 'medium', 'large'],
        defaultValue: 'medium'
      }
    ],
    defaultChildren: [
      {
        '@type': '@builder.io/sdk:Element',
        component: { name: 'Text', options: { text: 'Card content' } }
      }
    ],
    canHaveChildren: true
  });

  Builder.registerComponent(Input, {
    name: 'Input',
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/input.png',
    inputs: [
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: 'Enter text...'
      },
      {
        name: 'type',
        type: 'string',
        enum: ['text', 'email', 'password', 'number'],
        defaultValue: 'text'
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: false
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: false
      }
    ]
  });
}