import { Builder } from '@builder.io/react';
import { BankAccountList } from '@/components/banking/BankAccountList';
import { PaymentProcessor } from '@/components/payments/PaymentProcessor';
import { DocumentScanner } from '@/components/ocr/DocumentScanner';
import { InvoiceCreator } from '@/components/invoices/InvoiceCreator';

// Register Banking Components
Builder.registerComponent(BankAccountList, {
  name: 'BankAccountList',
  description: 'Display and manage connected bank accounts',
  inputs: [],
  defaults: {
    bindings: {
      'component.options.className': 'px-8 py-6'
    }
  }
});

// Register Payment Components
Builder.registerComponent(PaymentProcessor, {
  name: 'PaymentProcessor',
  description: 'Process payments with various payment methods',
  inputs: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      defaultValue: 0
    },
    {
      name: 'currency',
      type: 'string',
      defaultValue: 'USD',
      enum: ['USD', 'EUR', 'GBP']
    }
  ]
});

// Register Document Scanner
Builder.registerComponent(DocumentScanner, {
  name: 'DocumentScanner',
  description: 'Scan and process documents with OCR',
  inputs: [
    {
      name: 'onScanComplete',
      type: 'function'
    }
  ]
});

// Register Invoice Components
Builder.registerComponent(InvoiceCreator, {
  name: 'InvoiceCreator',
  description: 'Create and manage invoices',
  inputs: []
});