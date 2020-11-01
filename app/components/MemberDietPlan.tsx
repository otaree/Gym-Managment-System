/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import {
  Box,
  Text,
  SimpleGrid,
  Flex,
  IconButton,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';

import DietPlanForm from './DietPlanForm';
import { IDietPlan, IDiet, TypeOfMeal } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const DietPlan: React.FC<{
  id: string;
  dietPlan: IDietPlan;
  columns?: number;
  showActions?: boolean;
  onUpdate?: () => void;
}> = ({
  dietPlan,
  id,
  onUpdate = () => {},
  columns = 3,
  showActions = false,
}) => {
  const [modalDetails, setModalDetails] = useState({
    type: '',
    typeOfMeal: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mapMealName = (mealType: string) => {
    switch (Number(mealType)) {
      case TypeOfMeal.Breakfast:
        return 'Breakfast';
      case TypeOfMeal.Lunch:
        return 'Lunch';
      case TypeOfMeal.Dinner:
        return 'Dinner';
      default:
        return '';
    }
  };

  const onSubmit = async ({
    typeOfMeal,
    meals,
  }: {
    typeOfMeal: TypeOfMeal;
    meals: IDiet[];
  }) => {
    dietPlan[typeOfMeal] = meals;
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
      id,
      data: { dietPlan },
    });
    onClose();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onUpdate();
  };

  const onDelete = async (mealType: string) => {
    const newDietPlan = Object.keys(dietPlan).reduce((acc, curr) => {
      if (curr === mealType) return acc;
      return { ...acc, [curr]: dietPlan[curr] };
    }, {});
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
      id,
      data: { dietPlan: newDietPlan },
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
              setModalDetails({ type: 'add', typeOfMeal: '' });
              onOpen();
            }}
          />
        </Flex>
      )}

      <SimpleGrid columns={columns} spacing={4}>
        {Object.keys(dietPlan)
          .sort()
          .map((meal) => (
            <Box key={meal} borderWidth={1} backgroundColor="white">
              <Flex
                borderBottomWidth={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text textTransform="uppercase" fontWeight="medium" p={2}>
                  {mapMealName(meal)}
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
                        setModalDetails({ type: 'edit', typeOfMeal: meal });
                        onOpen();
                      }}
                    />
                    <IconButton
                      icon="delete"
                      size="sm"
                      variant="ghost"
                      variantColor="red"
                      aria-label="delete"
                      onClick={() => onDelete(meal)}
                    />
                  </Stack>
                )}
              </Flex>
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
                      <Text
                        as="td"
                        textTransform="capitalize"
                        textAlign="center"
                      >
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalDetails.type === 'edit' ? 'Edit Meal' : 'Add Meal'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DietPlanForm
              onSubmit={onSubmit}
              mealType={modalDetails.typeOfMeal}
              planedMeals={dietPlan[modalDetails.typeOfMeal] || []}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DietPlan;
