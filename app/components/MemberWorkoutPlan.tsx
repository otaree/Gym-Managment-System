/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import {
  Box,
  Text,
  SimpleGrid,
  Flex,
  Stack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';

import WorkoutPlanForm from './WorkoutPlanForm';
import { IWorkoutPlan, DayOfWeek, IPlanWorkout } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const WorkoutPlan: React.FC<{
  workoutPlan: IWorkoutPlan;
  id: string;
  columns?: number;
  showActions?: boolean;
  onUpdate?: () => void;
}> = ({
  // eslint-disable-next-line react/prop-types
  workoutPlan,
  id,
  columns = 3,
  showActions = false,
  onUpdate = () => {},
}) => {
  const [modalDetails, setModalDetails] = useState({ type: '', dayOfWeek: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const onSubmit = async ({
    dayOfWeek,
    plans,
  }: {
    dayOfWeek: DayOfWeek;
    plans: IPlanWorkout[];
  }) => {
    workoutPlan[dayOfWeek] = plans;
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
      id,
      data: { workoutPlane: workoutPlan },
    });
    onClose();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onUpdate();
  };

  const onDelete = async (dayOfWeek: string) => {
    const newWorkoutPlan = Object.keys(workoutPlan).reduce((acc, curr) => {
      if (curr === dayOfWeek) return acc;
      return { ...acc, [curr]: workoutPlan[curr] };
    }, {});
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
      id,
      data: { workoutPlane: newWorkoutPlan },
    });
    onUpdate();
  };

  return (
    <Box p={4}>
      {showActions && (
        <Flex justifyContent="flex-end" my={2}>
          <IconButton
            icon="add"
            aria-label="add"
            size="md"
            variantColor="green"
            onClick={() => {
              setModalDetails({ type: 'add', dayOfWeek: '' });
              onOpen();
            }}
          />
        </Flex>
      )}
      <SimpleGrid columns={columns} spacing={4}>
        {Object.keys(workoutPlan)
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
                      onClick={() => {
                        setModalDetails({ type: 'edit', dayOfWeek: weekday });
                        onOpen();
                      }}
                    />
                    <IconButton
                      icon="delete"
                      size="sm"
                      variant="ghost"
                      variantColor="red"
                      aria-label="delete"
                      onClick={() => onDelete(weekday)}
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
                  {workoutPlan[weekday].map((plan, i) => (
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalDetails.type === 'edit' ? 'Edit Workout' : 'Add Workout'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <WorkoutPlanForm
              onSubmit={onSubmit}
              nameOfDay={modalDetails.dayOfWeek}
              workoutPlans={workoutPlan[modalDetails.dayOfWeek] || []}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WorkoutPlan;
