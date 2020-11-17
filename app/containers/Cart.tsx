/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Stack,
  IconButton,
  Flex,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Avatar,
  PseudoBox,
  useToast,
} from '@chakra-ui/core';

import {
  selectCart,
  incrementItem,
  decrementItem,
  removeProduct,
  resetCart,
} from '../features/cart/cartSlice';
import { IProductDocument, IMemberDocument } from '../db';
import { ICreateSaleData } from '../main.dev';
import ipcEvents from '../constants/ipcEvents.json';

const Cart = () => {
  const [isMember, setIsMember] = useState('');
  const [name, setName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState<IMemberDocument[]>([]);
  const [
    selectedMember,
    setSelectedMember,
  ] = useState<IMemberDocument | null>();
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const increaseQuantity = (item: {
    product: IProductDocument;
    quantity: number;
  }) => {
    const productQuantity = Number(item.product.quantity);
    if (productQuantity >= item.quantity + 1) {
      dispatch(incrementItem(item.product._id));
    }
  };

  const decreaseQuantity = (item: {
    product: IProductDocument;
    quantity: number;
  }) => {
    if (Number(item.quantity) - 1 > 0) {
      dispatch(decrementItem(item.product._id));
    }
  };

  const onMemberSearch = async () => {
    const res = await ipcRenderer.invoke(ipcEvents.GET_MEMBERS, {
      search: memberId,
    });
    setMembers(res.members);
    onOpen();
  };

  const onSale = async () => {
    if (isMember.trim().length === 0) {
      return toast({
        title: 'Please select buyer is a club member or not.',
        description: 'Please select buyer is a club member or not.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
    let buyer: {
      memberId?: string;
      name: string;
      isMember: boolean;
      id?: string;
    };
    if (isMember === 'yes') {
      if (!selectedMember) {
        return toast({
          title: 'Please select a member.',
          description: 'Please select a member.',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
      }
      buyer = {
        memberId: selectedMember.memberId,
        name: `${selectedMember.firstName} ${selectedMember.lastName}`,
        isMember: true,
        id: selectedMember._id!,
      };
    } else {
      if (name.trim().length === 0) {
        return toast({
          title: `Please enter buyer's name`,
          description: `Please enter buyer's name`,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
      }
      buyer = {
        name: name.trim(),
        isMember: false,
      };
    }
    const body: ICreateSaleData = {
      buyer,
      products: cart,
    };
    const sale = await ipcRenderer.invoke(ipcEvents.CREATE_SALE, body);
    setName('');
    setMemberId('');
    setIsMember('');
    setMembers([]);
    setSelectedMember(null);
    dispatch(resetCart());
    return sale;
  };

  const totalAmount = cart.reduce((acc, curr) => {
    // eslint-disable-next-line no-param-reassign
    acc += curr.product.sellingPrice * curr.quantity;
    return acc;
  }, 0);

  if (cart.length === 0) {
    return (
      <Box backgroundColor="gray.50">
        <Heading>Cart</Heading>
        <Box backgroundColor="white" p={4}>
          <Text
            fontFamily="heading"
            fontSize="2xl"
            color="purple.500"
            my={4}
            textAlign="center"
            textTransform="uppercase"
          >
            Cart is empty
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box backgroundColor="gray.50">
      <Box w="80%">
        <Heading>Cart</Heading>
        <Flex justifyContent="space-between" mt={4} mb={2}>
          <Text
            fontWeight="medium"
            fontSize="xl"
            color="gray.600"
            borderBottomWidth={2}
            borderColor="black"
          >
            Buyer Details
          </Text>
        </Flex>
        <Stack isInline>
          <FormLabel htmlFor="name">Member of the club?</FormLabel>
          <RadioGroup
            isInline
            onChange={(e) => setIsMember(e.target.value)}
            value={isMember}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>
        </Stack>

        {isMember === 'yes' ? (
          <>
            <FormControl>
              <FormLabel htmlFor="memberId">Member Id</FormLabel>
              <Stack isInline>
                <InputGroup w="40%">
                  <Input
                    name="memberId"
                    placeholder="Member Id"
                    value={memberId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setMemberId(e.target.value);
                    }}
                  />
                </InputGroup>
                <IconButton
                  icon="search"
                  variantColor="purple"
                  aria-label="search"
                  onClick={onMemberSearch}
                />
              </Stack>
              <FormErrorMessage />
            </FormControl>
            {selectedMember && (
              <Flex
                alignItems="center"
                flexDirection="column"
                borderRadius="md"
                shadow="md"
                backgroundColor="white"
                w="30%"
                my={2}
                p={4}
              >
                <Avatar
                  size="xl"
                  name={`${selectedMember.firstName} ${selectedMember.lastName}`}
                  src={selectedMember.img}
                />
                <Text
                  fontFamily="heading"
                  fontSize="xl"
                  fontWeight="medium"
                  color="gray.800"
                  textTransform="capitalize"
                >
                  {`${selectedMember.firstName} ${selectedMember.lastName}`}
                </Text>
                <Text fontSize="md" color="gray.500">
                  {selectedMember.memberId}
                </Text>
              </Flex>
            )}
          </>
        ) : (
          <FormControl w="60%">
            <FormLabel htmlFor="name">Name</FormLabel>
            <InputGroup>
              <Input
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </InputGroup>
            <FormErrorMessage />
          </FormControl>
        )}

        <Flex justifyContent="space-between" mt={4}>
          <Text
            fontWeight="medium"
            fontSize="xl"
            color="gray.600"
            borderBottomWidth={2}
            borderColor="black"
          >
            Cart Details
          </Text>
          <Text fontWeight="medium" fontSize="xl" color="gray.600">
            Total: &#8377; {totalAmount}
          </Text>
        </Flex>
        <Box as="table" borderWidth={1} my={2} backgroundColor="white" w="100%">
          <Box as="thead">
            <Box as="tr" borderBottomWidth={1}>
              <Text as="th">Product</Text>
              <Text as="th" w={180}>
                Quantity
              </Text>
              <Text as="th" w={120}>
                Price(&#8377;)
              </Text>
              <Text as="th" w={80}>
                Remove
              </Text>
            </Box>
          </Box>
          <Box as="tbody">
            {cart.map((item, i) => (
              <Box
                as="tr"
                key={item.product._id!}
                borderTopWidth={i === 0 ? 0 : 1}
              >
                <Text as="td" p={2}>
                  {item.product.name}
                </Text>
                {/* <Text as="td">{item.quantity}</Text> */}
                <Flex justifyContent="center" alignItems="center">
                  <Stack isInline alignItems="center">
                    <IconButton
                      icon="minus"
                      aria-label="remove from cart"
                      variant="ghost"
                      variantColor="red"
                      size="sm"
                      onClick={() => decreaseQuantity(item)}
                    />
                    <Text mx={2}>{item.quantity}</Text>
                    <IconButton
                      icon="add"
                      aria-label="add to cart"
                      variant="ghost"
                      variantColor="green"
                      size="sm"
                      onClick={() => increaseQuantity(item)}
                    />
                  </Stack>
                </Flex>
                <Text as="td" textAlign="center">
                  {item.product.sellingPrice}
                </Text>
                <Flex as="td" justifyContent="center">
                  <IconButton
                    icon="delete"
                    aria-label="add to cart"
                    variant="ghost"
                    variantColor="red"
                    onClick={() => dispatch(removeProduct(item.product._id))}
                  />
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Button size="lg" variantColor="purple" my={4} onClick={onSale}>
        Sale
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{memberId}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {members.length === 0 ? (
              <Text
                fontFamily="heading"
                textAlign="center"
                fontSize="lg"
                color="gray.400"
                my={4}
              >
                No Member Found.
              </Text>
            ) : (
              <Box as="table" borderWidth={1} w="100%">
                <Box as="thead">
                  <Box as="tr" borderBottomWidth={1}>
                    <Text as="td">Photo</Text>
                    <Text as="td">Name</Text>
                    <Text as="td">MemberId</Text>
                  </Box>
                </Box>
                <Box as="tbody">
                  {members.map((member, i) => (
                    <PseudoBox
                      as="tr"
                      key={member._id}
                      borderTopWidth={i === 0 ? 0 : 0}
                      _hover={{
                        backgroundColor: 'gray.400',
                        color: 'white',
                      }}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedMember(member);
                        onClose();
                      }}
                    >
                      <Box as="td">
                        <Flex justifyContent="center">
                          <Avatar
                            size="md"
                            name={`${member.firstName} ${member.lastName}`}
                            src={member.img}
                          />
                        </Flex>
                      </Box>
                      <Text as="td" pl={2}>
                        {`${member.firstName} ${member.lastName}`}
                      </Text>
                      <Text as="td" textAlign="center">
                        {member.memberId}
                      </Text>
                    </PseudoBox>
                  ))}
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Cart;
