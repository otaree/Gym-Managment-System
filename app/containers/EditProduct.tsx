/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory, useParams } from 'react-router';
import { Box, Heading, Flex, Spinner } from '@chakra-ui/core';

import ProductForm from '../components/ProductForm';
import BackButton from '../components/BackButton';
import { IProduct, IProductDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const EditPrepaid = () => {
  const [product, setProduct] = useState<IProductDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: IProduct) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_PRODUCT, { id, data });
    // history.push(`/prepaid/${prepaid._id}`);
    history.goBack();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
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
    <Box>
      <BackButton />
      <Heading>Edit Product</Heading>
      <ProductForm
        onSubmitted={onSubmit}
        product={product as IProductDocument}
      />
    </Box>
  );
};

export default EditPrepaid;
