/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  Select,
  SimpleGrid,
  Flex,
  IconButton,
  FormLabel,
} from '@chakra-ui/core';

import { DayOfWeek, IPlanWorkout } from '../db';

const CustomInput: React.FC<{
  value: IPlanWorkout;
  onChange: (value: IPlanWorkout) => void;
}> = ({ value = { name: '', rep: 0, sets: 0, minutes: 0 }, onChange }) => {
  const [state, setState] = useState(value);

  const handleChange = (newState: IPlanWorkout) => {
    setState(newState);
    onChange(newState);
  };

  return (
    <SimpleGrid columns={4} spacing={2} my={2}>
      <Input
        placeholder="Name"
        value={state.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, name: e.target.value });
        }}
      />
      <Input
        placeholder="Sets"
        type="number"
        value={state.sets}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, sets: Number(e.target.value) });
        }}
      />
      <Input
        placeholder="Reps."
        type="number"
        value={state.rep}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, rep: Number(e.target.value) });
        }}
      />
      <Input
        placeholder="Minutes"
        type="number"
        value={state.minutes}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange({ ...state, minutes: Number(e.target.value) });
        }}
      />
    </SimpleGrid>
  );
};

const WorkoutPlanForm: React.FC<{
  onSubmit: (value: { dayOfWeek: DayOfWeek; plans: IPlanWorkout[] }) => void;
  nameOfDay?: DayOfWeek | string;
  workoutPlans?: IPlanWorkout[];
}> = ({ onSubmit, nameOfDay = '', workoutPlans = [] }) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | string>(nameOfDay);
  const [plans, setPlans] = useState<IPlanWorkout[]>(workoutPlans);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!dayOfWeek) return;
    if (plans.length === 0) return;
    setIsSubmitting(true);
    await onSubmit({
      dayOfWeek: dayOfWeek as DayOfWeek,
      plans: plans.filter((plan) => plan.name.trim().length > 0),
    });
    setIsSubmitting(false);
  };

  return (
    <Box p={4}>
      <Select
        placeholder="Day of Week"
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(e.target.value)}
      >
        <option value={DayOfWeek.Monday}>Monday</option>
        <option value={DayOfWeek.Tuesday}>Tuesday</option>
        <option value={DayOfWeek.Wednesday}>Wednesday</option>
        <option value={DayOfWeek.Thursday}>Thursday</option>
        <option value={DayOfWeek.Friday}>Friday</option>
        <option value={DayOfWeek.Saturday}>Saturday</option>
        <option value={DayOfWeek.Sunday}>Sunday</option>
      </Select>

      {plans.length > 0 && (
        <>
          <SimpleGrid columns={4} spacing={2} mt={4}>
            <FormLabel>Name</FormLabel>
            <FormLabel>Sets</FormLabel>
            <FormLabel>Reps.</FormLabel>
            <FormLabel>Minutes</FormLabel>
          </SimpleGrid>
          {plans.map((plan, i) => (
            <CustomInput
              value={plan}
              onChange={(value) => {
                setPlans(
                  plans.map((item, index) => (i === index ? value : item))
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
            setPlans([...plans, { name: '', rep: 0, sets: 0, minutes: 0 }]);
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

export default WorkoutPlanForm;
