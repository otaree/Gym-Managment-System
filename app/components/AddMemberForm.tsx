import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Heading,
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
import { IMember } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

type FormData = {
  firstName: string;
  lastName: string;
  dob: DayValue;
  sex: string;
  occupation: string;
  email: string;
  phoneNo: string;
  address: string;
  regularExercise: string;
  injuries: string;
  goal: string;
  heardAboutClub: string;
  prescribedMedication: string;
  dieting: string;
  isPregnant?: string;
  pregnancyDueDate?: DayValue;
  givenBirth6Month?: string;
  hospitalisedRecently: string;
  highBloodPressure: string;
  membershipFee?: number;
};

const AddMemberForm: React.FC<{ onSubmitted: () => void }> = ({
  onSubmitted,
}) => {
  const [isFemale, setIsFemale] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState<DayValue>(null);
  const [selectedPregnancyDDate, setSelectedPregnancyDDate] = useState<
    DayValue
  >(null);
  const [memberImg, setMemberImg] = useState('');
  const { register, formState, control, handleSubmit, errors } = useForm<
    FormData
  >({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: null,
      sex: '',
      occupation: '',
      email: '',
      phoneNo: '',
      address: '',
      regularExercise: '',
      injuries: '',
      goal: '',
      heardAboutClub: '',
      prescribedMedication: '',
      isPregnant: '',
      pregnancyDueDate: null,
      givenBirth6Month: '',
      dieting: '',
      hospitalisedRecently: '',
      highBloodPressure: '',
      membershipFee: 0,
    },
  });

  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    if (memberImg.length === 0) {
      toast({
        title: 'Image',
        description: 'Please provide member profile picture',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      const body: IMember = {};
      body.firstName = data.firstName;
      body.lastName = data.lastName;
      if (data.dob) {
        body.dob = new Date(data.dob.year, data.dob.month - 1, data.dob.day);
      }
      body.sex = data.sex;
      body.occupation = data.occupation;
      body.email = data.email;
      body.phoneNo = data.phoneNo;
      body.address = data.address;
      body.regularExercise = data.regularExercise;
      body.injuries = data.injuries;
      body.goal = data.goal;
      body.heardAboutClub = data.heardAboutClub;
      body.prescribedMedication = data.prescribedMedication;
      if (data.sex === 'female') {
        if (data.isPregnant === 'yes' && data.pregnancyDueDate) {
          body.pregnant = {
            isPregnant: true,
            dueDate: new Date(
              data.pregnancyDueDate.year,
              data.pregnancyDueDate.month - 1,
              data.pregnancyDueDate.day
            ),
          };
        }
      }
      if (data.sex === 'female') {
        body.givenBirth6Month = data.givenBirth6Month === 'yes';
      }
      body.dieting = data.dieting === 'yes';
      body.highBloodPressure = data.highBloodPressure === 'yes';
      body.img = memberImg;
      if (data.membershipFee) {
        body.membershipFee = Number(data.membershipFee);
      }
      await ipcRenderer.invoke(ipcEvents.CREATE_MEMBER, body);
      onSubmitted();
    }
  };

  const zeroPad = (num: number): string =>
    Number(num) < 10 ? `0${num}` : `${num}`;

  return (
    <Box>
      <Heading>Add Member</Heading>
      <Box>
        <Flex justifyContent="flex-end">
          <ImageUpload
            width={100}
            height={140}
            acceptedTypes={['jpg', 'jpeg', 'png']}
            maxFileSize={5 * 1024 * 1024}
            value={memberImg}
            onChange={setMemberImg}
          />
          {/* <Image
            height={140}
            width={100}
            objectFit="fill"
            src="https://www.fillmurray.com/450/450"
          /> */}
        </Flex>
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

          <FormControl isInvalid={!!errors.dob} w="18%">
            <FormLabel htmlFor="dob">Date of Birth</FormLabel>
            <Controller
              name="dob"
              control={control}
              rules={{ required: 'Please enter your Date of Birth.' }}
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
              rules={{ required: 'Please select your sex.' }}
              render={(props) => (
                <RadioGroup
                  onChange={(e) => {
                    if (e.target.value === 'female') {
                      setIsFemale(true);
                    } else {
                      setIsFemale(false);
                    }
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

          <FormControl isInvalid={!!errors.occupation} w="40%">
            <FormLabel htmlFor="occupation">Occupation</FormLabel>
            <InputGroup>
              <Input
                name="occupation"
                placeholder="Occupation"
                ref={register({ required: 'Please enter your occupation.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.occupation?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} w="40%">
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <Input
                name="email"
                placeholder="Email"
                type="email"
                ref={register({ required: 'Please enter your email.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phoneNo} w="40%">
            <FormLabel htmlFor="phoneNo">Phone No.</FormLabel>
            <InputGroup>
              <Input
                name="phoneNo"
                placeholder="Phone No"
                type="tel"
                pattern="[0-9]{10}"
                ref={register({ required: 'Please enter your phone No.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.phoneNo?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.address} w="40%">
            <FormLabel htmlFor="address">Address</FormLabel>
            <InputGroup>
              <Textarea
                name="address"
                placeholder="Address"
                ref={register({ required: 'Please enter your address.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.regularExercise} w="40%">
            <FormLabel htmlFor="regularExercise">Regular Exercises</FormLabel>
            <InputGroup>
              <Input
                name="regularExercise"
                placeholder="Regular Exercises"
                ref={register({
                  required: 'Please enter your regular exercises.',
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors?.regularExercise?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.injuries} w="40%">
            <FormLabel htmlFor="injuries">Injuries</FormLabel>
            <InputGroup>
              <Input
                name="injuries"
                placeholder="Injuries"
                ref={register({
                  required: 'Please enter your injuries.',
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.injuries?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.goal} w="40%">
            <FormLabel htmlFor="injuries">Goal</FormLabel>
            <InputGroup>
              <Input
                name="goal"
                placeholder="Goal"
                ref={register({
                  required: 'Please enter your goal.',
                })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.goal?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.heardAboutClub} w="40%">
            <FormLabel htmlFor="heardAboutClub">
              How did they heard about the club?
            </FormLabel>
            <InputGroup>
              <Select
                name="heardAboutClub"
                placeholder="How did they heard about the club?"
                ref={register({
                  required: 'How did they heard about the club?',
                })}
              >
                <option value="social media">Social media</option>
                <option value="friend">Friend</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </Select>
            </InputGroup>
            <FormErrorMessage>
              {errors?.heardAboutClub?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.prescribedMedication} w="40%">
            <FormLabel htmlFor="prescribedMedication">
              Any Prescribed Medication?
            </FormLabel>
            <InputGroup>
              <Input
                name="prescribedMedication"
                placeholder="Any Prescribed Medication?"
                ref={register({
                  required: 'Any Prescribed Medication?',
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors?.prescribedMedication?.message}
            </FormErrorMessage>
          </FormControl>

          {isFemale && (
            <FormControl isInvalid={!!errors.dieting}>
              <FormLabel htmlFor="isPregnant">Are they pregnant?</FormLabel>
              <Controller
                name="isPregnant"
                control={control}
                rules={{ required: 'Are they pregnant?' }}
                render={(props) => (
                  <RadioGroup
                    onChange={(e) => {
                      if (e.target.value === 'yes') {
                        setIsPregnant(true);
                      } else {
                        setIsPregnant(false);
                      }
                      // eslint-disable-next-line react/prop-types
                      props.onChange(e.target.value);
                    }}
                    // eslint-disable-next-line react/prop-types
                    value={props.value}
                    isInline
                  >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>
                )}
              />
              <FormErrorMessage>{errors?.dieting?.message}</FormErrorMessage>
            </FormControl>
          )}

          {isFemale && isPregnant && (
            <FormControl isInvalid={!!errors.pregnancyDueDate}>
              <FormLabel htmlFor="dob">Pregnancy Due Date</FormLabel>
              <br />
              <Controller
                name="pregnancyDueDate"
                control={control}
                rules={{ required: 'Please enter your pregnancy due date.' }}
                render={(props) => (
                  <DatePicker
                    value={selectedPregnancyDDate}
                    onChange={(value) => {
                      // eslint-disable-next-line react/prop-types
                      props.onChange(value);
                      setSelectedPregnancyDDate(value);
                    }}
                    renderInput={({ ref }) => {
                      return (
                        <Input
                          ref={ref as React.RefObject<HTMLInputElement>}
                          placeholder="Pregnancy Due Date"
                          value={
                            selectedPregnancyDDate
                              ? `${zeroPad(
                                  selectedPregnancyDDate?.day
                                )}/${zeroPad(selectedPregnancyDDate?.month)}/${
                                  selectedPregnancyDDate?.year
                                }`
                              : ''
                          }
                        />
                      );
                    }} // render a custom input
                    shouldHighlightWeekends
                  />
                )}
              />
              <FormErrorMessage>
                {errors?.pregnancyDueDate?.message}
              </FormErrorMessage>
            </FormControl>
          )}

          {isFemale && (
            <FormControl isInvalid={!!errors.dieting}>
              <FormLabel htmlFor="givenBirth6Month">
                Given Birth in past 6 month?
              </FormLabel>
              <Controller
                name="givenBirth6Month"
                control={control}
                rules={{ required: 'Given Birth in past 6 month?' }}
                render={(props) => (
                  <RadioGroup
                    onChange={(e) => {
                      if (e.target.value === 'yes') {
                        setIsPregnant(true);
                      } else {
                        setIsPregnant(false);
                      }
                      // eslint-disable-next-line react/prop-types
                      props.onChange(e.target.value);
                    }}
                    // eslint-disable-next-line react/prop-types
                    value={props.value}
                    isInline
                  >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>
                )}
              />
              <FormErrorMessage>
                {errors?.givenBirth6Month?.message}
              </FormErrorMessage>
            </FormControl>
          )}

          <FormControl isInvalid={!!errors.dieting}>
            <FormLabel htmlFor="dieting">Are they dieting?</FormLabel>
            <Controller
              name="dieting"
              control={control}
              rules={{ required: 'Are they dieting?' }}
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
            <FormErrorMessage>{errors?.dieting?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.hospitalisedRecently}>
            <FormLabel htmlFor="hospitalisedRecently">
              Have they been hospitalised recently?
            </FormLabel>
            <Controller
              name="hospitalisedRecently"
              control={control}
              rules={{ required: 'Have they been hospitalised recently?' }}
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
            <FormErrorMessage>
              {errors?.hospitalisedRecently?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.highBloodPressure}>
            <FormLabel htmlFor="highBloodPressure">
              High blood pressure?
            </FormLabel>

            <Controller
              name="highBloodPressure"
              control={control}
              rules={{ required: 'High blood pressure?' }}
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
            <FormErrorMessage>
              {errors?.highBloodPressure?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.membershipFee} w="18%">
            <FormLabel htmlFor="membershipFee">
              Membership Fee(&#8377;)
            </FormLabel>
            <InputGroup>
              <Input
                name="membershipFee"
                placeholder="Membership fee"
                type="number"
                ref={register({ required: 'Please enter membership fee.' })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors?.membershipFee?.message}
            </FormErrorMessage>
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
    </Box>
  );
};

export default AddMemberForm;
