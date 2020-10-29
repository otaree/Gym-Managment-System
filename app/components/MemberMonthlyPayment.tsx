import React from 'react';
import { Box, Text, Flex, Tag, TagLabel } from '@chakra-ui/core';

import { IMonthlyPayment } from '../db';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MonthlyPayment: React.FC<{ monthlyPayments: IMonthlyPayment[] }> = () => {
  const monthlyPayments: IMonthlyPayment[] = Array(5)
    .fill(0)
    .map((_, i) => ({
      date: new Date(2020, 3 + i, 1),
      amount: 2000,
      paid: Math.random() > 0.5,
    }));
  return (
    <Box p={4}>
      <Box as="table" borderWidth={1} w="50%" backgroundColor="white">
        <Box as="thead">
          <Box as="tr" borderBottomWidth={1}>
            <Text as="th" w="20%">
              Month
            </Text>
            <Text as="th">Amount(&#8377;)</Text>
            <Text as="th">Paid</Text>
          </Box>
        </Box>
        <Box as="tbody">
          {monthlyPayments.map((monthDetails) => (
            <Box
              as="tr"
              key={monthDetails.date.toISOString()}
              borderBottomWidth={1}
            >
              <Text as="td" textAlign="center">
                {months[monthDetails.date.getMonth()]}
              </Text>
              <Text as="td" textAlign="center">
                {monthDetails.amount}
              </Text>
              <Box as="td">
                <Flex justifyContent="center">
                  {monthDetails.paid ? (
                    <Tag variantColor="green" variant="solid" rounded="full">
                      <TagLabel>Paid</TagLabel>
                    </Tag>
                  ) : (
                    <Tag variantColor="red" variant="solid" rounded="full">
                      <TagLabel>Due</TagLabel>
                    </Tag>
                  )}
                </Flex>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MonthlyPayment;
