/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/core';

import { IPlanWorkout } from '../db';

const WorkoutPlan: React.FC<{
  workoutPlan: { [key: string]: IPlanWorkout[] };
}> = ({
  // eslint-disable-next-line react/prop-types
  workoutPlan,
}) => {
  const testWorkPlan: { [key: string]: IPlanWorkout[] } = {
    monday: [
      {
        name: 'stretching',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'push up',
        sets: 5,
        rep: 10,
      },
      {
        name: 'pull up',
        sets: 3,
        rep: 10,
      },
      {
        name: 'curling',
        sets: 5,
        rep: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
    ],
    wednesday: [
      {
        name: 'stretching',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'push up',
        sets: 5,
        rep: 10,
      },
      {
        name: 'pull up',
        sets: 3,
        rep: 10,
      },
      {
        name: 'curling',
        sets: 5,
        rep: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
    ],
    friday: [
      {
        name: 'stretching',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
      {
        name: 'push up',
        sets: 5,
        rep: 10,
      },
      {
        name: 'pull up',
        sets: 3,
        rep: 10,
      },
      {
        name: 'curling',
        sets: 5,
        rep: 10,
      },
      {
        name: 'running',
        sets: 1,
        rep: 1,
        minutes: 10,
      },
    ],
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={3} spacing={4}>
        {Object.keys(testWorkPlan).map((weekday: string) => (
          <Box key={weekday} borderWidth={1} backgroundColor="white">
            <Text
              textTransform="uppercase"
              fontWeight="medium"
              borderBottomWidth={1}
              p={2}
            >
              {weekday}
            </Text>
            <Box as="table" borderBottomWidth={1} w="100%">
              <Box as="thead" borderBottomWidth={1}>
                <Box as="tr">
                  <Text as="th" w="40%">
                    Name
                  </Text>
                  <Text as="th" w="20%">
                    Sets
                  </Text>
                  <Text as="th" w="20%">
                    Reps
                  </Text>
                  <Text as="th" w="20%">
                    Minutes
                  </Text>
                </Box>
              </Box>
              <Box as="tbody">
                {testWorkPlan[weekday].map((plan: IPlanWorkout, i) => (
                  <Box as="tr" key={i} borderTopWidth={i === 0 ? 0 : 1}>
                    <Text as="td" pl={2} textTransform="capitalize">
                      {plan.name}
                    </Text>
                    <Text as="td" textAlign="center">
                      {plan.sets}
                    </Text>
                    <Text as="td" textAlign="center">
                      {plan.rep}
                    </Text>
                    <Text as="td" textAlign="center">
                      {plan?.minutes}
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

export default WorkoutPlan;
