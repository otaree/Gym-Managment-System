import React from 'react';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

const SaleReceipt = () => (
  <Document>
    <Page size="A7" style={styles.page}>
      <View style={styles.header}>
        <Text>{format(new Date(), 'dd/mm/yyy')}</Text>
        <Text>Receipt #dfadsfaf123asda</Text>
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
      {Array(30)
        .fill({
          item: 'Protein Powder',
          quantity: 2,
          price: 120,
          total: 240,
        })
        .map((item, i) => (
          <View style={styles.tr} key={i}>
            <Text style={[styles.tableRowText, { width: '40%' }]}>
              {item.item}
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
              {item.price}
            </Text>
            <Text
              style={[
                styles.tableRowText,
                { width: '20%', textAlign: 'center' },
              ]}
            >
              {item.total}
            </Text>
          </View>
        ))}
    </Page>
  </Document>
);

export default SaleReceipt;
