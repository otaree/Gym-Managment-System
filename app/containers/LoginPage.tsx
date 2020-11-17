import React from 'react';
import { ipcRenderer } from 'electron';
// import { useHistory } from 'react-router';
// import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
  FormErrorMessage,
  Icon,
  Image,
  useToast,
  // Text
} from '@chakra-ui/core';
import { IoMdPerson } from 'react-icons/io';

import { setAuthentic } from '../features/auth/authSlice';
import ipcEvents from '../constants/ipcEvents.json';
import GymBG from '../assets/gym_bg.svg';

type FormData = {
  name: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const { register, formState, handleSubmit, errors } = useForm<FormData>();

  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
    if (!isAuth) {
      toast({
        title: 'Authentication Error',
        description: 'Invalid name/password.',
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      dispatch(setAuthentic(true));
    }
  };

  return (
    <Flex
      minH="100vh"
      p={100}
      justifyContent="flex-end"
      // backgroundColor="blue.300"
      pos="relative"
      overflow="hidden"
    >
      <Image
        src={GymBG}
        objectFit="fill"
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      />
      <Box
        borderRadius="md"
        shadow="md"
        width={[
          '40%', // base
          '60%', // 480px upwards
          '40%', // 768px upwards
          '30%', // 992px upwards
        ]}
        p={4}
        backgroundColor="white"
        h="fit-content"
        zIndex={2}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <InputGroup>
              <InputLeftElement
                // eslint-disable-next-line react/no-children-prop
                children={<Box as={IoMdPerson} color="gray.300" />}
              />
              <Input
                name="name"
                placeholder="name"
                ref={register({ required: 'Please enter your name.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <InputLeftElement
                // eslint-disable-next-line react/no-children-prop
                children={<Icon name="lock" color="gray.300" />}
              />
              <Input
                name="password"
                type="password"
                placeholder="password"
                ref={register({ required: 'Please enter your password.' })}
              />
            </InputGroup>
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
          <Flex justifyContent="center" alignItems="center">
            <Button
              my={6}
              size="md"
              variantColor="blue"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
