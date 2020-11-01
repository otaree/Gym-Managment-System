/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
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
  Text,
} from '@chakra-ui/core';
import { AiFillPrinter } from 'react-icons/ai';

import BackButton from '../components/BackButton';
import { ISaleDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const SaleDetails = () => {
  const [sale, setSale] = useState<ISaleDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const deleteRef = React.useRef();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onDelete = async () => {
    setIsDeleteAlert(false);
    setIsFetching(true);
    await ipcRenderer.invoke(ipcEvents.DELETE_SALE, id);
    setIsFetching(false);
    history.push('/sales');
  };

  const onPrint = async () => {
    await ipcRenderer.invoke(ipcEvents.PDF_SALES, id);
  };

  useEffect(() => {
    const fetchSale = async () => {
      setIsFetching(true);
      const resSale: ISaleDocument = await ipcRenderer.invoke(
        ipcEvents.GET_SALE,
        id
      );
      setSale(resSale);
      setIsFetching(false);
    };
    fetchSale();
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
      <BackButton url={`/sales${history.location.search}`} />
      <Flex justifyContent="space-between" mb={4}>
        <Heading textTransform="capitalize">Sale #{sale?._id}</Heading>
        <ButtonGroup>
          <IconButton
            icon={AiFillPrinter}
            variantColor="purple"
            aria-label="print"
            onClick={onPrint}
          />
          <IconButton
            ml={2}
            icon="delete"
            variantColor="red"
            aria-label="delete"
            onClick={() => setIsDeleteAlert(true)}
          />
        </ButtonGroup>
      </Flex>
      <SimpleGrid columns={2} my={4} w="60%">
        <Text p={2} borderWidth={1} borderRightWidth={0} borderBottomWidth={0}>
          Date
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0}>
          {sale?.createdAt && format(sale.createdAt, 'hh:mm aaaa dd/mm/yyyy')}
        </Text>
        <Text p={2} borderWidth={1} borderRightWidth={0} borderBottomWidth={0}>
          Buyer Name
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0}>
          {sale?.buyer.name}
        </Text>
        {sale?.buyer.isMember && (
          <>
            <Text
              p={2}
              borderWidth={1}
              borderRightWidth={0}
              borderBottomWidth={0}
            >
              Member Id
            </Text>
            <Text p={2} borderWidth={1} borderBottomWidth={0}>
              {sale?.buyer.memberId}
            </Text>
          </>
        )}
        <Text p={2} borderWidth={1} borderRightWidth={0} borderBottomWidth={0}>
          Total Purchase Price
        </Text>
        <Text p={2} borderWidth={1} borderBottomWidth={0}>
          &#8377; {sale?.totalPurchasePrice}
        </Text>
        <Text p={2} borderWidth={1} borderRightWidth={0}>
          Total Selling Price
        </Text>
        <Text p={2} borderWidth={1}>
          &#8377; {sale?.totalSellingPrice}
        </Text>
      </SimpleGrid>
      <Text fontWeight="medium" fontSize="lg" mt={4}>
        Products
      </Text>
      <Box as="table" w="60%" borderWidth={1}>
        <Box as="thead">
          <Box as="tr" borderBottomWidth={1}>
            <Text as="th">Name</Text>
            <Text as="th" w={120}>
              Quantity
            </Text>
            <Text as="th" w={180}>
              Purchase Price(&#8377;)
            </Text>
            <Text as="th" w={180}>
              Selling Price(&#8377;)
            </Text>
          </Box>
        </Box>
        <Box as="tbody">
          {sale?.products.map((item, i) => (
            <Box as="tr" key={i} borderTopWidth={i === 0 ? 0 : 1}>
              <Text as="td" p={2}>
                {item.name}
              </Text>
              <Text as="td" textAlign="center">
                {item.quantity}
              </Text>
              <Text as="td" textAlign="center">
                {item.purchasePrice}
              </Text>
              <Text as="td" textAlign="center">
                {item.sellingPrice}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

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
            Delete Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this sale? You can't undo this
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

export default SaleDetails;
