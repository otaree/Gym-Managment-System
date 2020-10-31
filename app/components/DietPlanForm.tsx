/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Input,
  Button,
  Select,
  Stack,
  Flex,
  IconButton,
  Text,
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
    <Stack isInline my={2}>
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, quantity: Number(e.target.value) });
        }}
      />
      <Input
        placeholder="Unit"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, unit: e.target.value });
        }}
      />
    </Stack>
  );
};

const DietPlanForm: React.FC<{
  onSubmit: (value: { typeOfMeal: TypeOfMeal; meals: IDiet[] }) => void;
}> = ({ onSubmit }) => {
  const [typeOfMeal, setTypeOfMeal] = useState<TypeOfMeal | string>('');
  const [meals, setMeals] = useState<IDiet[]>([]);
  const [isSumitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!typeOfMeal) return;
    if (meals.length === 0) return;
    setIsSubmitting(true);
    await onSubmit({ typeOfMeal: typeOfMeal as TypeOfMeal, meals });
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

      {meals.map((meal, i) => (
        <CustomInput
          value={meal}
          onChange={(value) => {
            setMeals(meals.map((item, index) => (i === index ? value : item)));
          }}
          key={i}
        />
      ))}

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
        isLoading={isSumitting}
        isDisabled={isSumitting}
      >
        Submit
      </Button>
    </Box>
  );
};

export default DietPlanForm;
