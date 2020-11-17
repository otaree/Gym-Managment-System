/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { compareAsc } from 'date-fns';
import { useParams, useHistory } from 'react-router';
import {
  Box,
  Heading,
  Flex,
  Spinner,
  SimpleGrid,
  Text,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Stack,
  Tag,
  TagLabel,
  ButtonGroup,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/core';
import { AiFillPrinter, AiOutlineIdcard } from 'react-icons/ai';
import ReactToPrint from 'react-to-print';

import MemberIDCard from '../components/MemberIdCard';
import MemberToPDF from '../components/MemberToPDF';
import WorkoutPlan from '../components/MemberWorkoutPlan';
import DietPlan from '../components/MemberDietPlan';
import MonthlyPayment from '../components/MemberMonthlyPayment';
import Purchases from '../components/MemberPurchases';
import BackButton from '../components/BackButton';
import {
  IMemberDocument,
  IPlanWorkout,
  IMonthlyPayment,
  IMemberProduct,
} from '../db';
import ipcEvents from '../constants/ipcEvents.json';

export interface IWorkoutProps {
  [key: string]: IPlanWorkout[];
}

const MemberDetails = () => {
  const [member, setMember] = useState<IMemberDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const deleteRef = useRef();
  const printRef = useRef();
  const idRef = useRef();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : num);

  const onDelete = async () => {
    setIsDeleteAlert(false);
    setIsFetching(true);
    await ipcRenderer.invoke(ipcEvents.DELETE_MEMBER, id);
    setIsFetching(false);
    history.push('/members');
  };

  const fetchMember = useCallback(async () => {
    // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
    setIsFetching(true);
    const resMember: IMemberDocument = await ipcRenderer.invoke(
      ipcEvents.GET_MEMBER,
      id
    );
    setMember(resMember);
    setIsFetching(false);
  }, [id]);

  useEffect(() => {
    fetchMember();
  }, [id, fetchMember]);

  if (isFetching) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner color="purple.500" size="lg" />
      </Flex>
    );
  }

  let paymentDue = false;
  if (
    member &&
    member.monthlyPayments &&
    member.monthlyPayments.filter((monthPayment) => !monthPayment.paid).length >
      0
  ) {
    paymentDue = true;
  }

  if (!member) {
    return (
      <Flex justifyContent="center" alignItems="center" h="80vh">
        <Heading>No Details</Heading>
      </Flex>
    );
  }

  return (
    <Box backgroundColor="gray.50">
      <BackButton url={`/members${history.location.search}`} />
      <Flex justifyContent="space-between" mb={4}>
        <Stack isInline>
          <Heading textTransform="capitalize">
            {member?.firstName} {member?.lastName}
          </Heading>
          <Tag
            variantColor={member?.isMember ? 'green' : 'red'}
            variant="outline"
            rounded="full"
            size="sm"
          >
            <TagLabel>{member?.isMember ? 'Member' : 'Not A Member'}</TagLabel>
          </Tag>
          {paymentDue && (
            <Tag variantColor="red" variant="outline" rounded="full" size="sm">
              <TagLabel>Due</TagLabel>
            </Tag>
          )}
          {compareAsc(new Date(), member.memberShipExpirationDate) === 1 && (
            <Tag variantColor="red" variant="outline" rounded="full" size="sm">
              <TagLabel>Expired</TagLabel>
            </Tag>
          )}
        </Stack>
        <ButtonGroup>
          <ReactToPrint
            trigger={() => (
              <IconButton
                icon={AiOutlineIdcard}
                variantColor="green"
                aria-label="id card"
                mr={2}
              />
            )}
            content={() => idRef.current!}
            documentTitle="member-id"
          />
          <ReactToPrint
            trigger={() => (
              <IconButton
                icon={AiFillPrinter}
                variantColor="blue"
                aria-label="print"
              />
            )}
            content={() => printRef.current!}
            documentTitle="member-detail"
          />
          <IconButton
            icon="edit"
            variantColor="purple"
            aria-label="edit"
            ml={2}
            onClick={() => history.push(`/members/${id}/edit`)}
          />
          <IconButton
            icon="delete"
            variantColor="red"
            aria-label="delete"
            onClick={() => setIsDeleteAlert(true)}
          />
        </ButtonGroup>
      </Flex>
      <Flex justifyContent="flex-end">
        <Image src={member?.img} width={126} height={160} />
      </Flex>
      <SimpleGrid columns={2} spacingX={4} spacingY={1} my={4} w="80%">
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
                    `${zeroPad(member.pregnant.dueDate.getDate())}/${zeroPad(
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
        <Text>Membership Expiration date:</Text>
        <Text fontWeight="medium">
          {member?.memberShipExpirationDate &&
            `${zeroPad(member.memberShipExpirationDate.getDate())}/${zeroPad(
              member.memberShipExpirationDate.getMonth() + 1
            )}/${member.memberShipExpirationDate.getFullYear()}`}
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

      <Tabs my={8} variant="enclosed">
        <TabList>
          <Tab>Workout Plan</Tab>
          <Tab>Diet Plan</Tab>
          <Tab>Monthly Payment</Tab>
          <Tab>Purchases</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <WorkoutPlan
              id={member._id!}
              workoutPlan={member?.workoutPlane}
              onUpdate={fetchMember}
              showActions
            />
          </TabPanel>
          <TabPanel>
            <DietPlan
              id={id}
              dietPlan={member?.dietPlan}
              onUpdate={fetchMember}
              showActions
            />
          </TabPanel>
          <TabPanel>
            <MonthlyPayment
              id={id}
              monthlyPayments={member?.monthlyPayments as IMonthlyPayment[]}
              onUpdate={fetchMember}
            />
          </TabPanel>
          <TabPanel>
            <Purchases products={member?.products as IMemberProduct[]} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog
        isOpen={isDeleteAlert}
        leastDestructiveRef={
          (deleteRef as unknown) as React.RefObject<HTMLElement>
        }
        onClose={() => setIsDeleteAlert(false)}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Customer
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this member? You can't undo this
            action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={deleteRef} onClick={() => setIsDeleteAlert(false)}>
              Cancel
            </Button>
            <Button variantColor="red" onClick={onDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Box left="-110%" pos="absolute">
        <Box ref={printRef} width="100%">
          <MemberToPDF member={member} />
        </Box>
      </Box>
      <Box left="-110%" pos="absolute">
        <Box ref={idRef} width="100%">
          <MemberIDCard member={member} />
        </Box>
      </Box>
    </Box>
  );
};

export default MemberDetails;
