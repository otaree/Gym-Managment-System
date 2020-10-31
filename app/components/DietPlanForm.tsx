/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  FormLabel,
  Input,
  Button,
  Select,
  Flex,
  IconButton,
  Text,
  SimpleGrid,
} from '@chakra-ui/core';

import { TypeOfMeal, IDiet } from '../db';

const CustomInput: React.FC<{
  value: IDiet;
  onChange: (value: IDiet) => void;
}> = ({ value = { name: '', quantity: 0, unit: '' }, onChange }) => {
  const [state, setState] = useState(value);

  const handleChange = (newState: IDiet) => {
    setState(newState);
    onChange(newState);
  };

  return (
    <SimpleGrid spacing={2} columns={3} my={2}>
      <Input
        placeholder="Meal Name"
        value={state.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, name: e.target.value });
        }}
      />
      <Input
        placeholder="Quantity"
        type="number"
        value={state.quantity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, quantity: Number(e.target.value) });
        }}
      />
      <Input
        placeholder="Unit"
        value={state.unit}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, unit: e.target.value });
        }}
      />
    </SimpleGrid>
  );
};

const DietPlanForm: React.FC<{
  onSubmit: (value: { typeOfMeal: TypeOfMeal; meals: IDiet[] }) => void;
  mealType?: TypeOfMeal | string;
  planedMeals?: IDiet[];
}> = ({ mealType = '', planedMeals = [], onSubmit }) => {
  const [typeOfMeal, setTypeOfMeal] = useState<TypeOfMeal | string>(mealType);
  const [meals, setMeals] = useState<IDiet[]>(planedMeals);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!typeOfMeal) return;
    if (meals.length === 0) return;
    setIsSubmitting(true);
    await onSubmit({
      typeOfMeal: typeOfMeal as TypeOfMeal,
      meals: meals.filter((meal) => meal.name.trim().length > 0),
    });
    setIsSubmitting(false);
  };

  return (
    <Box p={4}>
      <Select
        placeholder="Type of Meal"
        value={typeOfMeal}
        onChange={(e) => setTypeOfMeal(e.target.value)}
      >
        <option value={TypeOfMeal.Breakfast}>Breakfast</option>
        <option value={TypeOfMeal.Lunch}>Lunch</option>
        <option value={TypeOfMeal.Dinner}>Dinner</option>
      </Select>

      {meals.length > 0 && (
        <>
          <SimpleGrid columns={3} spacing={2} mt={4}>
            <FormLabel>Name</FormLabel>
            <FormLabel>Quantity</FormLabel>
            <FormLabel>Unit</FormLabel>
          </SimpleGrid>
          {meals.map((meal, i) => (
            <CustomInput
              value={meal}
              onChange={(value) => {
                setMeals(
                  meals.map((item, index) => (i === index ? value : item))
                );
              }}
              key={i}
            />
          ))}
        </>
      )}

      <Flex justifyContent="center" my={2}>
        <IconButton
          icon="add"
          aria-label="add"
          onClick={() => {
            setMeals([...meals, { name: '', quantity: 0, unit: '' }]);
          }}
        />
      </Flex>
      <Button
        onClick={handleSubmit}
        variantColor="purple"
        my={4}
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Submit
      </Button>
    </Box>
  );
};

export default DietPlanForm;
