/* eslint-disable react/prop-types */
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  Button,
  SimpleGrid,
  Radio,
  RadioGroup,
} from '@chakra-ui/core';

import TimeInput, { ITime } from './TimeInput';
import { IPrepaid, IPrepaidDocument } from '../db';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  amount: number;
  paid: string;
  startAt: ITime | null | undefined;
  endAt: ITime | null | undefined;
};

const PrepaidForm: React.FC<{
  onSubmitted: (data: IPrepaid) => void;
  prepaid?: IPrepaidDocument;
}> = ({ onSubmitted, prepaid }) => {
  const { register, formState, control, handleSubmit, errors } = useForm<
    FormData
  >({
    defaultValues: prepaid
      ? {
          firstName: prepaid.firstName,
          lastName: prepaid.lastName,
          amount: prepaid.amount,
          paid: prepaid.paid ? 'yes' : 'no',
          phone: prepaid.phone,
          startAt: {
            hour:
              prepaid.startAt.getHours() > 12
                ? 24 - prepaid.startAt.getHours()
                : prepaid.startAt.getHours(),
            minute: prepaid.startAt.getMinutes(),
            ampm: prepaid.startAt.getHours() > 12 ? 'pm' : 'am',
          },
          endAt: {
            hour:
              prepaid.endAt.getHours() > 12
                ? 24 - prepaid.endAt.getHours()
                : prepaid.endAt.getHours(),
            minute: prepaid.endAt.getMinutes(),
            ampm: prepaid.endAt.getHours() > 12 ? 'pm' : 'am',
          },
        }
      : {},
  });

  const parseTime = (time: ITime, date = new Date()) => {
    if (time.ampm === 'pm') {
      date.setHours(12 + time.hour);
    } else {
      date.setHours(time.hour);
    }
    date.setMinutes(time.minute);
    return date;
  };

  const onSubmit = async (data: FormData) => {
    const body: IPrepaid = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      amount: data.amount,
      paid: data.paid === 'yes',
      startAt: prepaid
        ? parseTime(data.startAt as ITime, prepaid.startAt)
        : parseTime(data.startAt as ITime),
      endAt: prepaid
        ? parseTime(data.endAt as ITime, prepaid.endAt)
        : parseTime(data.endAt as ITime),
    };
    await onSubmitted(body);
  };

  return (
    <Box my={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacingX={4} w="80%">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <InputGroup>
              <Input
                name="firstName"
                placeholder="First Name"
                ref={register({ required: 'Please enter your first name.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <InputGroup>
              <Input
                name="lastName"
                placeholder="Last Name"
                ref={register({ required: 'Please enter your last name.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.phone} w="40%">
          <FormLabel htmlFor="phone">Phone No.</FormLabel>
          <InputGroup>
            <Input
              name="phone"
              placeholder="Phone No"
              type="tel"
              pattern="[0-9]{10}"
              ref={register({ required: 'Please enter your phone No.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.phone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.amount} w="18%">
          <FormLabel htmlFor="amount">Amount(&#8377;)</FormLabel>
          <InputGroup>
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              ref={register({ required: 'Please enter amount.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.paid}>
          <FormLabel htmlFor="paid">Paid</FormLabel>

          <Controller
            name="paid"
            control={control}
            rules={{ required: 'Paid?' }}
            render={(props) => (
              <RadioGroup
                // eslint-disable-next-line react/prop-types
                onChange={(e) => props.onChange(e.target.value)}
                // eslint-disable-next-line react/prop-types
                value={props.value}
                isInline
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
            )}
          />
          <FormErrorMessage>{errors?.paid?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.startAt}>
          <FormLabel htmlFor="startAt">Start Time</FormLabel>

          <Controller
            name="startAt"
            control={control}
            rules={{ required: 'Please enter start time' }}
            render={(props) => (
              <Box w="26%">
                <TimeInput
                  onChange={(value) => props.onChange(value)}
                  value={props.value}
                />
              </Box>
            )}
          />
          <FormErrorMessage>{errors?.startAt?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.endAt}>
          <FormLabel htmlFor="endAt">Start Time</FormLabel>

          <Controller
            name="endAt"
            control={control}
            rules={{ required: 'Please enter end time' }}
            render={(props) => (
              <Box w="26%">
                <TimeInput
                  onChange={(value) => props.onChange(value)}
                  value={props.value}
                />
              </Box>
            )}
          />
          <FormErrorMessage>{errors?.endAt?.message}</FormErrorMessage>
        </FormControl>

        <Button
          my={6}
          size="md"
          variantColor="blue"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default PrepaidForm;
