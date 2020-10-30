/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { app } from 'electron';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';

import SaleReceipt from '../components/SaleReceipt';
import { ISaleDocument } from '../db';

export default function saveSaleReceiptPDF(sale: ISaleDocument) {
  ReactPDF.render(
    <SaleReceipt sale={sale} />,
    `${app.getPath('documents')}/example.pdf`
  );
}
