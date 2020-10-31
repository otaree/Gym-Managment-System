/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Heading, Flex, SimpleGrid, Text, Image } from '@chakra-ui/core';

import { IMemberDocument } from '../db';
import DietPlan from './MemberDietPlan';
import WorkoutPlan from './MemberWorkoutPlan';

const zeroPad = (num: number) => (num < 10 ? `0${num}` : num);

const Page: React.FC = ({ children }) => (
  <Box height={1030} pos="relative" p={4}>
    {children}
  </Box>
);

const MemberToPDF: React.FC<{ member: IMemberDocument }> = ({ member }) => (
  <Box>
    <Page>
      <Heading textTransform="capitalize">
        {member?.firstName} {member?.lastName}
      </Heading>
      <Flex>
        <Box flexGrow={2}>
          <SimpleGrid columns={2} spacingX={4} spacingY={1} my={4}>
            <Text>Member Id:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.memberId}
            </Text>
            <Text>First Name:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.firstName}
            </Text>
            <Text>Last Name:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.lastName}
            </Text>
            <Text>Date of Birth:</Text>
            <Text fontWeight="medium">
              {member?.dob &&
                `${zeroPad(member.dob.getDate())}/${zeroPad(
                  member.dob.getMonth() + 1
                )}/${member.dob.getFullYear()}`}
            </Text>
            <Text>Sex:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.sex}
            </Text>
            <Text>Email:</Text>
            <Text fontWeight="medium">{member?.email}</Text>

            <Text>Phone No.:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.phoneNo}
            </Text>

            <Text>Address:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.address}
            </Text>

            <Text>Regular Exercise:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.regularExercise}
            </Text>

            <Text>Injuries:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.injuries}
            </Text>

            <Text>Goal:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.goal}
            </Text>

            <Text>How did heard about our club?:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.heardAboutClub}
            </Text>

            <Text>Any Prescribed Medication?:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.prescribedMedication}
            </Text>

            <Text>Dieting:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.dieting ? 'yes' : 'no'}
            </Text>

            <Text>High Blood Pressure:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.highBloodPressure ? 'yes' : 'no'}
            </Text>

            <Text>Hospitalised Recently:</Text>
            <Text fontWeight="medium" textTransform="capitalize">
              {member?.hospitalisedRecently ? 'yes' : 'no'}
            </Text>

            {member?.sex === 'female' && (
              <>
                <Text>Pregnant:</Text>
                <Text fontWeight="medium" textTransform="capitalize">
                  {member?.pregnant?.isPregnant ? 'yes' : 'no'}
                </Text>
                {member?.pregnant?.isPregnant && (
                  <>
                    <Text>Pregnancy due date:</Text>
                    <Text fontWeight="medium">
                      {member?.pregnant?.dueDate &&
                        `${zeroPad(
                          member.pregnant.dueDate.getDate()
                        )}/${zeroPad(
                          member.pregnant.dueDate.getMonth() + 1
                        )}/${member.pregnant.dueDate.getFullYear()}`}
                    </Text>
                  </>
                )}
                <Text>Given birth in past 6 month?:</Text>
                <Text fontWeight="medium" textTransform="capitalize">
                  {member?.givenBirth6Month ? 'yes' : 'no'}
                </Text>
              </>
            )}
            <Text>Membership Fee:</Text>
            <Text fontWeight="medium">&#8377; {member?.membershipFee}</Text>
            <Text>Joining date:</Text>
            <Text fontWeight="medium">
              {member?.createdAt &&
                `${zeroPad(member.createdAt.getDate())}/${zeroPad(
                  member.createdAt.getMonth() + 1
                )}/${member.createdAt.getFullYear()}`}
            </Text>
            {!member?.isMember && member?.leavingDate && (
              <>
                <Text>Leaving date:</Text>
                <Text fontWeight="medium">
                  {member?.leavingDate &&
                    `${zeroPad(member.leavingDate.getDate())}/${zeroPad(
                      member.leavingDate.getMonth() + 1
                    )}/${member.leavingDate.getFullYear()}`}
                </Text>
              </>
            )}
          </SimpleGrid>
        </Box>
        <Box>
          <Image src={member?.img} width={126} height={160} />
        </Box>
      </Flex>
    </Page>
    <Page>
      <Text
        fontFamily="heading"
        fontSize="xl"
        fontWeight="bold"
        mt={4}
        mb={2}
        color="gray.600"
      >
        Diet Plan
      </Text>
      <DietPlan id={member._id!} dietPlan={member.dietPlan} columns={2} />
    </Page>
    <Page>
      <Text
        fontFamily="heading"
        fontSize="xl"
        fontWeight="bold"
        mt={4}
        mb={2}
        color="gray.600"
      >
        Workout Plan
      </Text>
      <WorkoutPlan workoutPlan={member.workoutPlane} columns={3} />
    </Page>
  </Box>
);

export default MemberToPDF;
