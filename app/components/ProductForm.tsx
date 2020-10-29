/* eslint-disable react/prop-types */
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  Button,
} from '@chakra-ui/core';

import { IProduct, IProductDocument } from '../db';

type FormData = {
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
};

const ProductForm: React.FC<{
  onSubmitted: (data: IProduct) => void;
  product?: IProductDocument;
}> = ({ onSubmitted, product }) => {
  const { register, formState, handleSubmit, errors } = useForm<FormData>({
    defaultValues: product
      ? {
          name: product.name,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          quantity: product.quantity,
        }
      : {},
  });

  const onSubmit = async (data: FormData) => {
    await onSubmitted(data);
  };

  return (
    <Box my={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name} w="40%">
          <FormLabel htmlFor="name">Name</FormLabel>
          <InputGroup>
            <Input
              name="name"
              placeholder="Product Name"
              ref={register({ required: 'Please enter product name.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.purchasePrice} w="12%">
          <FormLabel htmlFor="purchasePrice">
            Purchase Price (&#8377;)
          </FormLabel>
          <InputGroup>
            <Input
              name="purchasePrice"
              placeholder="Purchase Price"
              ref={register({ required: 'Please enter purchase price.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.purchasePrice?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.sellingPrice} w="12%">
          <FormLabel htmlFor="sellingPrice">Selling Price (&#8377;)</FormLabel>
          <InputGroup>
            <Input
              name="sellingPrice"
              placeholder="Selling Price"
              ref={register({ required: 'Please enter selling price.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.sellingPrice?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.quantity} w="12%">
          <FormLabel htmlFor="quantity">Quantity</FormLabel>
          <InputGroup>
            <Input
              name="quantity"
              placeholder="Quantity"
              ref={register({ required: 'Please enter Quantity.' })}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.quantity?.message}</FormErrorMessage>
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
  );
};

export default ProductForm;
