/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { format } from 'date-fns';
import { useParams, useHistory } from 'react-router';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/core';

import BackButton from '../components/BackButton';
import { IPrepaidDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const PrepaidDetails = () => {
  const [prepaid, setPrepaid] = useState<IPrepaidDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const deleteRef = React.useRef();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onDelete = async () => {
    setIsDeleteAlert(false);
    setIsFetching(true);
    await ipcRenderer.invoke(ipcEvents.DELETE_PREPAID, id);
    setIsFetching(false);
    history.push('/prepaid/all');
  };

  useEffect(() => {
    const fetchPrepaid = async () => {
      // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
      setIsFetching(true);
      const resPrepaid: IPrepaidDocument = await ipcRenderer.invoke(
        ipcEvents.GET_PREPAID,
        id
      );
      setPrepaid(resPrepaid);
      setIsFetching(false);
    };
    fetchPrepaid();
  }, [id]);

  if (isFetching) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner color="purple.500" size="lg" />
      </Flex>
    );
  }

  return (
    <Box backgroundColor="gray.50">
      <BackButton url={`/prepaid/all${history.location.search}`} />
      <Flex justifyContent="space-between" mb={4}>
        <Stack isInline>
          <Heading textTransform="capitalize">
            {prepaid?.firstName} {prepaid?.lastName}
          </Heading>
          {typeof prepaid?.paid === 'boolean' && !prepaid.paid && (
            <Tag variantColor="red" variant="outline" rounded="full" size="sm">
              <TagLabel>Due</TagLabel>
            </Tag>
          )}
        </Stack>
        <ButtonGroup>
          <IconButton
            icon="edit"
            variantColor="purple"
            aria-label="edit"
            onClick={() => history.push(`/prepaid/${id}/edit`)}
          />
          <IconButton
            icon="delete"
            variantColor="red"
            aria-label="delete"
            onClick={() => setIsDeleteAlert(true)}
          />
        </ButtonGroup>
      </Flex>
      <SimpleGrid columns={2} my={4} w="60%">
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          First Name:
        </Text>
        <Text
          p={2}
          borderWidth={1}
          borderBottomWidth={0}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {prepaid?.firstName}
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          Last Name:
        </Text>
        <Text
          p={2}
          borderWidth={1}
          borderBottomWidth={0}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {prepaid?.lastName}
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          Phone No.:
        </Text>
        <Text
          p={2}
          borderWidth={1}
          borderBottomWidth={0}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {prepaid?.phone}
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          Amount:
        </Text>
        <Text
          p={2}
          borderWidth={1}
          borderBottomWidth={0}
          fontWeight="medium"
          textTransform="capitalize"
        >
          &#8377; {prepaid?.amount}
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          Paid:
        </Text>
        <Text
          p={2}
          borderWidth={1}
          borderBottomWidth={0}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {typeof prepaid?.paid === 'boolean' && prepaid.paid ? 'Paid' : 'Due'}
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} borderRightWidth={0}>
          Start Time:
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0} fontWeight="medium">
          {prepaid?.startAt && format(prepaid.startAt, 'hh:mm aaaa dd/mm/yyyy')}
        </Text>
        <Text p={2} borderWidth={1} borderRightWidth={0}>
          End Time:
        </Text>
        <Text p={2} borderWidth={1} fontWeight="medium">
          {prepaid?.endAt && format(prepaid?.endAt, 'hh:mm aaaa dd/mm/yyyy')}
        </Text>
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
            Delete Prepaid
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this prepaid? You can't undo this
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

export default PrepaidDetails;
