/* eslint-disable react/jsx-one-expression-per-line */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { format } from 'date-fns';
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

import BackButton from '../components/BackButton';
import { IEmployeeDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState<IEmployeeDocument>();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const deleteRef = useRef();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const fetchEmployee = useCallback(async () => {
    setIsFetching(true);
    const resEmployee = await ipcRenderer.invoke(ipcEvents.GET_EMPLOYEE, id);
    setEmployee(resEmployee);
    console.log('EMPLOYEE:::', resEmployee);
    setIsFetching(false);
  }, [id]);

  const onDelete = async () => {
    setIsDeleteAlert(false);
    setIsFetching(true);
    ipcRenderer.invoke(ipcEvents.DELETE_EMPLOYEE, id);
    setIsFetching(false);
    history.push('/employees');
  };

  useEffect(() => {
    fetchEmployee();
  }, [id, fetchEmployee]);

  if (isFetching) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner color="purple.500" size="lg" />
      </Flex>
    );
  }
  return (
    <Box backgroundColor="gray.50">
      <BackButton url="/employees" />
      <Flex justifyContent="flex-end" my={4}>
        <ButtonGroup>
          <IconButton
            icon="edit"
            variantColor="purple"
            aria-label="edit"
            ml={2}
            onClick={() => history.push(`/employees/${employee?._id}/edit`)}
          />
          <IconButton
            icon="delete"
            variantColor="red"
            aria-label="delete"
            onClick={() => setIsDeleteAlert(true)}
          />
        </ButtonGroup>
      </Flex>
      <Stack isInline>
        <Heading textTransform="capitalize">
          {employee?.firstName} {employee?.lastName}
        </Heading>
        {!employee?.isEmployed && (
          <Tag
            variantColor="red"
            variant="outline"
            rounded="full"
            size="sm"
            ml={2}
          >
            <TagLabel>Not Employed</TagLabel>
          </Tag>
        )}
      </Stack>
      <Flex justifyContent="flex-end">
        <Image src={employee?.img} width={96} height={140} />
      </Flex>
      <SimpleGrid columns={2} my={4} w="80%">
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Name
        </Text>
        <Text
          borderWidth={1}
          borderBottom={0}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {employee?.firstName} {employee?.lastName}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Sex
        </Text>
        <Text
          borderWidth={1}
          borderBottom={0}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {employee?.sex}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Date Of Birth
        </Text>
        <Text
          borderWidth={1}
          borderBottom={0}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {employee?.dob && format(employee.dob, 'dd/MM/yyyy')}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Mobile
        </Text>
        <Text borderWidth={1} borderBottom={0} p={2} fontWeight="medium">
          {employee?.mobile}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Address
        </Text>
        <Text borderWidth={1} borderBottom={0} p={2} fontWeight="medium">
          {employee?.address}
        </Text>

        {employee?.leavingDate ? (
          <>
            <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
              Joining Date
            </Text>
            <Text borderWidth={1} borderBottom={0} p={2} fontWeight="medium">
              {employee?.createdAt && format(employee.createdAt, 'dd/MM/yyyy')}
            </Text>
            <Text borderWidth={1} borderRightWidth={0} p={2}>
              Leaving Date
            </Text>
            <Text borderWidth={1} p={2} fontWeight="medium">
              {format(employee.leavingDate, 'dd/MM/yyyy')}
            </Text>
          </>
        ) : (
          <>
            <Text borderWidth={1} borderRightWidth={0} p={2}>
              Joining Date
            </Text>
            <Text borderWidth={1} p={2} fontWeight="medium">
              {employee?.createdAt && format(employee.createdAt, 'dd/MM/yyyy')}
            </Text>
          </>
        )}
      </SimpleGrid>

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
    </Box>
  );
};

export default EmployeeDetails;
