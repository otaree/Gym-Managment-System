/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Radio,
  RadioGroup,
  FormControl,
  FormErrorMessage,
  InputGroup,
} from '@chakra-ui/core';
import DatePicker, { DayValue } from 'react-modern-calendar-datepicker';

import { IMonthlyPayment } from '../db';

type FormData = {
  date: DayValue;
  paid: string;
  amount: number;
};

const zeroPad = (num: number): string =>
  Number(num) < 10 ? `0${num}` : `${num}`;

const MonthlyPaymentPaymentForm: React.FC<{
  onSubmitted: (value: IMonthlyPayment) => void;
  paymentDetails?: IMonthlyPayment;
}> = ({ onSubmitted, paymentDetails }) => {
  const [selectedDate, setSelectedDate] = useState<DayValue>(
    paymentDetails
      ? {
          day: paymentDetails.date.getDate(),
          month: paymentDetails.date.getMonth() + 1,
          year: paymentDetails.date.getFullYear(),
        }
      : null
  );

  let defaultValues = {};
  if (paymentDetails) {
    defaultValues = {
      date: {
        day: paymentDetails.date.getDate(),
        month: paymentDetails.date.getMonth() + 1,
        year: paymentDetails.date.getFullYear(),
      },
      paid: paymentDetails.paid ? 'paid' : 'due',
      amount: paymentDetails.amount,
    };
  }

  const { register, formState, control, handleSubmit, errors } = useForm<
    FormData
  >({ defaultValues });

  const onSubmit = async (data: FormData) => {
    if (data.date) {
      const date = new Date(
        data.date.year,
        data.date?.month - 1,
        data.date?.day,
        0,
        0,
        0,
        0
      );
      await onSubmitted({
        date,
        amount: data.amount,
        paid: data.paid === 'paid',
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.date} w={200}>
          <FormLabel htmlFor="date">Date</FormLabel>
          <br />
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Please select a date.' }}
            render={(props) => (
              <DatePicker
                value={selectedDate}
                onChange={(value) => {
                  // eslint-disable-next-line react/prop-types
                  props.onChange(value);
                  setSelectedDate(value);
                }}
                renderInput={({ ref }) => {
                  return (
                    <Input
                      ref={ref as React.RefObject<HTMLInputElement>}
                      placeholder="Date"
                      value={
                        selectedDate
                          ? `${zeroPad(selectedDate?.day)}/${zeroPad(
                              selectedDate?.month
                            )}/${selectedDate?.year}`
                          : ''
                      }
                    />
                  );
                }} // render a custom input
                shouldHighlightWeekends
                calendarPopperPosition="bottom"
              />
            )}
          />
          <FormErrorMessage>{errors?.date?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.amount} w={200}>
          <FormLabel htmlFor="amount">Amount(&#8377;)</FormLabel>
          <InputGroup>
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              ref={register({ required: 'Please enter the amount.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.paid}>
          <FormLabel htmlFor="paid">Payment Status</FormLabel>
          <Controller
            name="paid"
            control={control}
            rules={{ required: 'Please select payment status.' }}
            render={(props) => (
              <RadioGroup
                onChange={(e) => {
                  // eslint-disable-next-line react/prop-types
                  props.onChange(e.target.value);
                }}
                // eslint-disable-next-line react/prop-types
                value={props.value}
                isInline
              >
                <Radio value="paid">Paid</Radio>
                <Radio value="due">Due</Radio>
              </RadioGroup>
            )}
          />
          <FormErrorMessage>{errors?.paid?.message}</FormErrorMessage>
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

export default MonthlyPaymentPaymentForm;
