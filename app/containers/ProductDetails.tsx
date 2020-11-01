/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
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

import BackButton from '../components/BackButton';
import { IProductDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const ProductDetails = () => {
  const [product, setProduct] = useState<IProductDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const deleteRef = React.useRef();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onDelete = async () => {
    setIsDeleteAlert(false);
    setIsFetching(true);
    await ipcRenderer.invoke(ipcEvents.DELETE_PRODUCT, id);
    setIsFetching(false);
    history.push('/products');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true);
      const resProduct: IProductDocument = await ipcRenderer.invoke(
        ipcEvents.GET_PRODUCT,
        id
      );
      setProduct(resProduct);
      setIsFetching(false);
    };
    fetchProduct();
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
      <BackButton url={`/products${history.location.search}`} />
      <Flex justifyContent="space-between" mb={4}>
        <Heading textTransform="capitalize">{product?.name}</Heading>
        <ButtonGroup>
          <IconButton
            icon="edit"
            variantColor="purple"
            aria-label="edit"
            onClick={() => history.push(`/products/${id}/edit`)}
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
          {product?.name}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Purchase Price
        </Text>
        <Text
          borderWidth={1}
          borderBottom={0}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          &#8377; {product?.purchasePrice}
        </Text>
        <Text borderWidth={1} borderBottom={0} borderRightWidth={0} p={2}>
          Selling Price
        </Text>
        <Text
          borderWidth={1}
          borderBottom={0}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          &#8377; {product?.sellingPrice}
        </Text>
        <Text borderWidth={1} borderRightWidth={0} p={2}>
          Quantity
        </Text>
        <Text
          borderWidth={1}
          p={2}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {product?.quantity}
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
            Delete Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this product? You can't undo this
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

export default ProductDetails;
