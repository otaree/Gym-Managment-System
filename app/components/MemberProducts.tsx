/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, Text } from '@chakra-ui/core';

import { IMemberProduct } from '../db';

const MemberProducts: React.FC<{ products: IMemberProduct[] }> = () => {
  const products: IMemberProduct[] = [
    {
      date: new Date(),
      product: {
        name: 'protein sake',
        price: 200,
      },
      quantity: 1,
      grossTotal: 200,
    },
    {
      date: new Date(),
      product: {
        name: 't shirt',
        price: 600,
      },
      quantity: 3,
      grossTotal: 1800,
    },
    {
      date: new Date(),
      product: {
        name: 'protein sake',
        price: 200,
      },
      quantity: 2,
      grossTotal: 400,
    },
    {
      date: new Date(),
      product: {
        name: 'towel',
        price: 700,
      },
      quantity: 1,
      grossTotal: 700,
    },
    {
      date: new Date(),
      product: {
        name: 'protein sake',
        price: 500,
      },
      quantity: 1,
      grossTotal: 500,
    },
  ];

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <Box p={4}>
      <Box as="table" borderWidth={1} w="60%" backgroundColor="white">
        <Box as="thead">
          <Box as="tr" borderBottomWidth={1}>
            <Text as="th">Date</Text>
            <Text as="th">Product</Text>
            <Text as="th">Quantity</Text>
            <Text as="th">Total Amount(&#8377;)</Text>
          </Box>
        </Box>
        <Box as="tbody">
          {products.map((item, i) => (
            <Box as="tr" key={i} borderTopWidth={i === 0 ? 0 : 1}>
              <Text as="td" textAlign="center">
                {`${zeroPad(item.date.getDate())}/${zeroPad(
                  item.date.getMonth() + 1
                )}/${item.date.getFullYear()}`}
              </Text>
              <Text as="td" pl={3} textTransform="capitalize">
                {item?.product?.name}
              </Text>
              <Text as="td" textAlign="center">
                {item.quantity}
              </Text>
              <Text as="td" textAlign="center">
                {item.grossTotal}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MemberProducts;
