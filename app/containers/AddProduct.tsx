/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { Box, Heading } from '@chakra-ui/core';

import ProductForm from '../components/ProductForm';
import BackButton from '../components/BackButton';
import { IProduct } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const AddPrepaid = () => {
  const history = useHistory();

  const onSubmit = async (data: IProduct) => {
    await ipcRenderer.invoke(ipcEvents.CREATE_PRODUCT, data);
    // history.push(`/prepaid/${prepaid._id}`);
    history.push(`/products`);
  };
  return (
    <Box>
      <BackButton />
      <Heading>Add Product</Heading>
      <ProductForm onSubmitted={onSubmit} />
    </Box>
  );
};

export default AddPrepaid;
