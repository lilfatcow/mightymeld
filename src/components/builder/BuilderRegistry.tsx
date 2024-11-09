import { Builder } from '@builder.io/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Register your components
Builder.registerComponent(Button, {
  name: 'Button',
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
    }
  ],
});

Builder.registerComponent(Card, {
  name: 'Card',
  inputs: [
    { 
      name: 'content', 
      type: 'string', 
      defaultValue: 'Card content' 
    }
  ],
});

Builder.registerComponent(Input, {
  name: 'Input',
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
    }
  ],
});