/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/core';

import { IDiet } from '../db';

const DietPlan: React.FC<{ dietPlan: { [key: string]: IDiet[] } }> = () => {
  const dietPlan: { [key: string]: IDiet[] } = {
    breakfast: [
      {
        name: 'coffee',
        quantity: 1,
        unit: 'cup',
      },
      {
        name: 'bread',
        quantity: 2,
        unit: 'slice',
      },
      {
        name: 'egg',
        quantity: 2,
        unit: 'no',
      },
    ],
    lunch: [
      {
        name: 'coffee',
        quantity: 1,
        unit: 'cup',
      },
      {
        name: 'bread',
        quantity: 2,
        unit: 'slice',
      },
      {
        name: 'egg',
        quantity: 2,
        unit: 'no',
      },
    ],
    dinner: [
      {
        name: 'coffee',
        quantity: 1,
        unit: 'cup',
      },
      {
        name: 'bread',
        quantity: 2,
        unit: 'slice',
      },
      {
        name: 'egg',
        quantity: 2,
        unit: 'no',
      },
    ],
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={3} spacing={4}>
        {Object.keys(dietPlan).map((meal) => (
          <Box key={meal} borderWidth={1} backgroundColor="white">
            <Text
              textTransform="uppercase"
              fontWeight="medium"
              p={2}
              borderBottomWidth={1}
            >
              {meal}
            </Text>
            <Box as="table" w="100%">
              <Box as="thead" borderBottomWidth={1}>
                <Box as="tr">
                  <Text as="th">Name</Text>
                  <Text as="th">Quantity</Text>
                  <Text as="th">unit</Text>
                </Box>
              </Box>
              <Box as="tbody">
                {dietPlan[meal].map((plan, i) => (
                  <Box as="tr" key={i} borderBottomWidth={1}>
                    <Text as="td" textTransform="capitalize" textAlign="center">
                      {plan.name}
                    </Text>
                    <Text as="td" textAlign="center">
                      {plan.quantity}
                    </Text>
                    <Text as="td" textAlign="center">
                      {plan.unit}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DietPlan;
