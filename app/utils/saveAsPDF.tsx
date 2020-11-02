/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
import { app, shell } from 'electron';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import path from 'path';

import SaleReceipt from '../components/SaleReceipt';
import MemberBasic from '../components/MemberBasicDetailTemplate';
import { IMemberDocument, ISaleDocument } from '../db';

export async function saveSaleReceiptPDF(sale: ISaleDocument) {
  const filepath = path.join(
    app.getPath('documents'),
    `receipt#${sale._id}.pdf`
  );
  await ReactPDF.render(<SaleReceipt sale={sale} />, filepath);
  const hasOpened = shell.openItem(filepath);
  console.log(hasOpened ? 'OPEN' : 'NOT OPEN');
}

export async function saveMemberBasicPDF(
  member: IMemberDocument,
  image: string
) {
  const filepath = path.join(
    app.getPath('documents'),
    `${member.firstName}_${member.memberId}.pdf`
  );
  console.log('filePath:::', filepath);
  await ReactPDF.render(
    <MemberBasic member={member} image={image} />,
    filepath
  );
  shell.openItem(filepath);
}
