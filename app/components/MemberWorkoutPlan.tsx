/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Flex,
  Stack,
  IconButton,
} from '@chakra-ui/core';

import { IWorkoutPlan, DayOfWeek } from '../db';

const WorkoutPlan: React.FC<{
  workoutPlan: IWorkoutPlan;
  columns?: number;
  showActions?: boolean;
}> = ({
  // eslint-disable-next-line react/prop-types
  workoutPlan,
  columns = 3,
  showActions = false,
}) => {
  const testWorkPlan: IWorkoutPlan = {
    [DayOfWeek.Friday]: [
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
    [DayOfWeek.Monday]: [
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
    [DayOfWeek.Wednesday]: [
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

  const mapDayName = (dayOfWeek: string) => {
    switch (Number(dayOfWeek)) {
      case DayOfWeek.Monday:
        return 'Monday';
      case DayOfWeek.Tuesday:
        return 'Tuesday';
      case DayOfWeek.Wednesday:
        return 'Wednesday';
      case DayOfWeek.Thursday:
        return 'Thursday';
      case DayOfWeek.Friday:
        return 'Friday';
      case DayOfWeek.Saturday:
        return 'Saturday';
      case DayOfWeek.Sunday:
        return 'Sunday';
      default:
        return '';
    }
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={columns} spacing={4}>
        {Object.keys(testWorkPlan)
          .sort()
          .map((weekday: string) => (
            <Box key={weekday} borderWidth={1} backgroundColor="white">
              <Flex
                borderBottomWidth={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text textTransform="uppercase" fontWeight="medium" p={2}>
                  {mapDayName(weekday)}
                </Text>
                {showActions && (
                  <Stack isInline>
                    <IconButton
                      icon="edit"
                      size="sm"
                      variant="ghost"
                      variantColor="purple"
                      aria-label="edit"
                    />
                    <IconButton
                      icon="delete"
                      size="sm"
                      variant="ghost"
                      variantColor="red"
                      aria-label="delete"
                    />
                  </Stack>
                )}
              </Flex>
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
                  {testWorkPlan[weekday].map((plan, i) => (
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
