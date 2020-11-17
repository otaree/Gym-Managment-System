/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  Flex,
  Button,
  SimpleGrid,
  Textarea,
  Select,
  Radio,
  RadioGroup,
  useToast,
} from '@chakra-ui/core';
import DatePicker, { DayValue } from 'react-modern-calendar-datepicker';

import ImageUpload from './ImageUpload';
import { IEmployee, IEmployeeDocument } from '../db';

type FormData = {
  firstName: string;
  lastName: string;
  dob: DayValue;
  sex: string;
  address: string;
  mobile: string;
  isEmployed?: string;
  leavingDate?: DayValue;
};

const EmployeeForm: React.FC<{
  onSubmitted: (data: unknown) => void;
  isEdit?: boolean;
  employee?: IEmployeeDocument;
}> = ({ onSubmitted, isEdit = false, employee }) => {
  const [selectedDOB, setSelectedDOB] = useState<DayValue>(
    isEdit && employee?.dob
      ? {
          day: employee.dob.getDate(),
          month: employee.dob.getMonth() + 1,
          year: employee.dob.getFullYear(),
        }
      : null
  );
  const [selectedLeavingDate, setSelectedLeavingDate] = useState<DayValue>(
    isEdit && employee?.leavingDate
      ? {
          day: employee.leavingDate.getDate(),
          month: employee.leavingDate.getMonth() + 1,
          year: employee.leavingDate.getFullYear(),
        }
      : null
  );
  const [employeeImg, setEmployeeImg] = useState(
    isEdit && employee?.img ? employee.img : ''
  );

  let defaultValues = {};
  if (isEdit) {
    defaultValues = {
      firstName: employee?.firstName,
      lastName: employee?.lastName,
      dob: employee?.dob && {
        day: employee.dob.getDate(),
        month: employee.dob.getMonth() + 1,
        year: employee.dob.getFullYear(),
      },
      sex: employee?.sex,
      mobile: employee?.mobile,
      address: employee?.address,
      leavingDate: employee?.leavingDate && {
        day: employee.leavingDate.getDate(),
        month: employee.leavingDate.getMonth() + 1,
        year: employee.leavingDate.getFullYear(),
      },
      isEmployed: employee?.isEmployed ? 'yes' : 'no',
    };
  }

  const { register, formState, control, handleSubmit, errors } = useForm<
    FormData
  >({
    defaultValues,
  });

  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    if (employeeImg.length === 0) {
      toast({
        title: 'Image',
        description: 'Please provide employee profile picture',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      const body: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob
          ? new Date(data.dob.year, data.dob.month - 1, data.dob.day)
          : new Date(),
        sex: data.sex,
        mobile: data.mobile,
        address: data.address,
        img: employeeImg,
      };
      if (isEdit) {
        body.isEmployed = data.isEmployed === 'yes';
        if (data.leavingDate) {
          body.leavingDate = new Date(
            data.leavingDate.year,
            data.leavingDate.month - 1,
            data.leavingDate.day
          );
        }
      }
      await onSubmitted(body);
    }
  };
  const zeroPad = (num: number): string =>
    Number(num) < 10 ? `0${num}` : `${num}`;

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <ImageUpload
          width={100}
          height={140}
          acceptedTypes={['jpg', 'jpeg', 'png']}
          maxFileSize={5 * 1024 * 1024}
          value={employeeImg}
          onChange={setEmployeeImg}
        />
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacingX={4} w="80%">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <InputGroup>
              <Input
                name="firstName"
                placeholder="First Name"
                ref={register({
                  required: "Please enter employee's first name.",
                })}
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
                ref={register({
                  required: "Please enter employee's last name.",
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.lastName?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.dob} w="18%">
          <FormLabel htmlFor="dob">Date of Birth</FormLabel>
          <Controller
            name="dob"
            control={control}
            rules={{ required: "Please enter employee's Date of Birth." }}
            render={(props) => (
              <DatePicker
                value={selectedDOB}
                onChange={(value) => {
                  // eslint-disable-next-line react/prop-types
                  props.onChange(value);
                  setSelectedDOB(value);
                }}
                renderInput={({ ref }) => {
                  return (
                    <Input
                      ref={ref as React.RefObject<HTMLInputElement>}
                      placeholder="Date of Birth"
                      value={
                        selectedDOB
                          ? `${zeroPad(selectedDOB?.day)}/${zeroPad(
                              selectedDOB?.month
                            )}/${selectedDOB?.year}`
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
          <FormErrorMessage>{errors?.dob?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.sex}>
          <FormLabel htmlFor="sex">Sex</FormLabel>
          <Controller
            name="sex"
            control={control}
            rules={{ required: "Please select employee's sex." }}
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
                <Radio value="female">Female</Radio>
                <Radio value="male">Male</Radio>
                <Radio value="other">Other</Radio>
              </RadioGroup>
            )}
          />
          <FormErrorMessage>{errors?.sex?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.mobile} w="40%">
          <FormLabel htmlFor="mobile">Mobile</FormLabel>
          <InputGroup>
            <Input
              name="mobile"
              placeholder="Mobile"
              type="tel"
              pattern="[0-9]{10}"
              ref={register({ required: "Please enter employee's phone No." })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.mobile?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.address} w="40%">
          <FormLabel htmlFor="address">Address</FormLabel>
          <InputGroup>
            <Textarea
              name="address"
              placeholder="Address"
              ref={register({ required: "'Please enter employee's address." })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
        </FormControl>

        {isEdit && (
          <>
            <FormControl isInvalid={!!errors.isEmployed}>
              <FormLabel htmlFor="isEmployed">Is Employed?</FormLabel>

              <Controller
                name="isEmployed"
                control={control}
                rules={{ required: 'Is Empoyed?' }}
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
              <FormErrorMessage>{errors?.isEmployed?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.leavingDate} w="18%">
              <FormLabel htmlFor="leavingDate">Leaving Date</FormLabel>
              <Controller
                name="leavingDate"
                control={control}
                render={(props) => (
                  <DatePicker
                    value={selectedLeavingDate}
                    onChange={(value) => {
                      // eslint-disable-next-line react/prop-types
                      props.onChange(value);
                      setSelectedLeavingDate(value);
                    }}
                    renderInput={({ ref }) => {
                      return (
                        <Input
                          ref={ref as React.RefObject<HTMLInputElement>}
                          placeholder="Leaving Date"
                          value={
                            selectedLeavingDate
                              ? `${zeroPad(selectedLeavingDate?.day)}/${zeroPad(
                                  selectedLeavingDate?.month
                                )}/${selectedLeavingDate?.year}`
                              : ''
                          }
                        />
                      );
                    }} // render a custom input
                    shouldHighlightWeekends
                    calendarPopperPosition="top"
                  />
                )}
              />
              <FormErrorMessage>
                {errors?.leavingDate?.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}
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

export default EmployeeForm;
