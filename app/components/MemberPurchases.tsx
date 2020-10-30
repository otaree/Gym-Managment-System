/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { format } from 'date-fns';
import { Box, SimpleGrid, Text } from '@chakra-ui/core';

import { IMemberProduct } from '../db';

const MemberPurchases: React.FC<{ products: IMemberProduct[] }> = ({
  products,
}) => {
  return (
    <Box p={4}>
      <SimpleGrid columns={4} spacing={4}>
        {products.map((item, i) => (
          <Box borderRadius="sm" shadow="sm" backgroundColor="white" key={i}>
            <Text
              textAlign="right"
              p={2}
              borderBottomWidth={1}
              fontSize="md"
              fontWeight="medium"
            >
              {format(item.date, 'hh:mm aaaa dd/mm/yyyy')}
            </Text>
            <Box as="table" w="100%">
              <Box as="thead">
                <Box as="tr" borderBottomWidth={1}>
                  <Text as="th">Name</Text>
                  <Text as="th">Price(&#8377;)</Text>
                  <Text as="th">Quantity</Text>
                </Box>
              </Box>
              <Box as="tbody">
                {item.products.map((product, index) => (
                  <Box
                    as="tr"
                    borderBottomWidth={1}
                    key={index}
                    borderTopWidth={index === 0 ? 0 : 1}
                  >
                    <Text as="td" p={2} textTransform="capitalize">
                      {product.name}
                    </Text>
                    <Text as="td" textAlign="center">
                      {product.price}
                    </Text>
                    <Text as="td" textAlign="center">
                      {product.quantity}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
            <Text
              textAlign="right"
              p={2}
              borderTopWidth={1}
              fontSize="md"
              fontWeight="medium"
            >
              Total: &#8377; {item.grossTotal}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MemberPurchases;
