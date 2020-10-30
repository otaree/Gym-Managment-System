/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// eslint-disable-next-line import/no-cycle
import { ISaleDocument } from '../db';

// Create styles
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
  },
  title: {
    fontWeight: 'semibold',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    width: '100%',
  },
  tableHeaderText: {
    padding: 4,
  },
  tableRowText: {
    padding: 2,
    fontSize: 8,
  },
  tr: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    width: '100%',
  },
});

const SaleReceipt: React.FC<{ sale: ISaleDocument }> = ({ sale }) => {
  return (
    <Document>
      <Page size="A7" style={styles.page}>
        <View style={styles.header}>
          <Text>{format(sale.createdAt, 'dd/mm/yyy')}</Text>
          <Text>Receipt #{sale._id}</Text>
        </View>
        <Text style={styles.title}>Receipt</Text>
        <View style={styles.hr} />
        <View style={styles.tr}>
          <Text style={[styles.tableHeaderText, { width: '40%' }]}>Item</Text>
          <Text
            style={[
              styles.tableHeaderText,
              { width: '20%', textAlign: 'center' },
            ]}
          >
            #
          </Text>
          <Text
            style={[
              styles.tableHeaderText,
              { width: '20%', textAlign: 'center' },
            ]}
          >
            Price
          </Text>
          <Text
            style={[
              styles.tableHeaderText,
              { width: '20%', textAlign: 'center' },
            ]}
          >
            Total
          </Text>
        </View>
        <View style={styles.hr} />
        <View style={styles.hr} />
        {sale.products.map((item, i) => (
          <View style={styles.tr} key={i}>
            <Text style={[styles.tableRowText, { width: '40%' }]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.tableRowText,
                { width: '20%', textAlign: 'center' },
              ]}
            >
              {item.quantity}
            </Text>
            <Text
              style={[
                styles.tableRowText,
                { width: '20%', textAlign: 'center' },
              ]}
            >
              {item.sellingPrice}
            </Text>
            <Text
              style={[
                styles.tableRowText,
                { width: '20%', textAlign: 'center' },
              ]}
            >
              {item.quantity * item.sellingPrice}
            </Text>
          </View>
        ))}
        <View style={styles.hr} />
        <View style={styles.tr}>
          <Text
            style={[
              styles.tableHeaderText,
              { width: '80%', textAlign: 'center' },
            ]}
          >
            Total
          </Text>
          <Text
            style={[
              styles.tableHeaderText,
              { width: '20%', textAlign: 'center' },
            ]}
          >
            {sale.totalSellingPrice}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SaleReceipt;
