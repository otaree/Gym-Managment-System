import { app } from 'electron';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';

export default function saveAsPDF(Component: React.FC) {
  ReactPDF.render(<Component />, `${app.getPath('documents')}/example.pdf`);
}
