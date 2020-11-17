/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { Box, Flex, PseudoBox, Stack, Text } from '@chakra-ui/core';
import { IconType } from 'react-icons';
import { BsFillPeopleFill, BsGraphUp } from 'react-icons/bs';
import { FaMoneyCheckAlt, FaBoxes, FaUserTie } from 'react-icons/fa';
import { CgGym } from 'react-icons/cg';
import { ImCart } from 'react-icons/im';

import { selectCart } from '../features/cart/cartSlice';

interface IButtonProps {
  icon: IconType;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CustomButton: React.FC<IButtonProps> = ({
  icon,
  title,
  isActive = false,
  onClick,
}) => (
  <PseudoBox
    as="button"
    py={3}
    px={2}
    width="100%"
    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
    fontSize="lg"
    fontWeight="medium"
    bg={isActive ? 'white' : 'gray.300'}
    color={isActive ? 'gray.600' : 'white'}
    _hover={{ bg: 'white', color: 'gray.500' }}
    _active={{
      bg: 'white',
      color: 'gray.500',
    }}
    outline="none"
  >
    <Stack isInline alignItems="center" pl={4} onClick={onClick}>
      <Box as={icon} />
      <Text pl={4}>{title}</Text>
    </Stack>
  </PseudoBox>
);

interface IButtonWithNumProps extends IButtonProps {
  num?: number;
}
const CustomButtonWithNum: React.FC<IButtonWithNumProps> = ({
  icon,
  title,
  isActive = false,
  onClick,
  num = 0,
}) => (
  <PseudoBox
    as="button"
    py={3}
    px={2}
    width="100%"
    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
    fontSize="lg"
    fontWeight="medium"
    bg={isActive ? 'white' : 'gray.300'}
    color={isActive ? 'gray.600' : 'white'}
    _hover={{ bg: 'white', color: 'gray.500' }}
    _active={{
      bg: 'white',
      color: 'gray.500',
    }}
    outline="none"
  >
    <Stack isInline alignItems="center" pl={4} onClick={onClick}>
      <Box as={icon} />
      <Box pos="relative">
        <Text pl={4}>{title}</Text>
        {num > 0 && (
          <Flex
            justifyContent="center"
            alignItems="center"
            w={6}
            h={6}
            rounded="full"
            backgroundColor="purple.400"
            pos="absolute"
            top="-25%"
            right="-42%"
            // color={isActive ? 'white' : 'black'}
            color="white"
          >
            <Text fontSize="sm">{num < 10 ? `0${num}` : `+9`}</Text>
          </Flex>
        )}
      </Box>
    </Stack>
  </PseudoBox>
);

const Aside = () => {
  const cart = useSelector(selectCart);
  const history = useHistory();

  return (
    <Box
      pos="fixed"
      top={0}
      left={0}
      bottom="100vh"
      w="15.5vw"
      h="100vh"
      backgroundColor="gray.300"
    >
      <Flex
        h="18vh"
        justifyContent="center"
        alignItems="center"
        flexDirection="column-reverse"
        backgroundColor="purple.300"
      >
        <Text
          textAlign="center"
          fontFamily="heading"
          fontSize="xl"
          fontWeight="bold"
          textShadow="lg"
          color="white"
        >
          GYMVENGER
        </Text>
        <Box as={CgGym} size="32px" color="yellow.300" />
      </Flex>
      <CustomButton
        icon={BsFillPeopleFill}
        title="Members"
        isActive={history.location.pathname.includes('members')}
        onClick={() => history.replace('/members')}
      />
      <CustomButton
        icon={FaBoxes}
        title="Products"
        isActive={history.location.pathname.includes('products')}
        onClick={() => history.replace('/products')}
      />
      <CustomButton
        icon={FaMoneyCheckAlt}
        title="Prepaid"
        isActive={history.location.pathname.includes('prepaid')}
        onClick={() => history.replace('/prepaid/all')}
      />
      <CustomButton
        icon={BsGraphUp}
        title="Sales"
        isActive={history.location.pathname.includes('sales')}
        onClick={() => history.replace('/sales')}
      />
      <CustomButton
        icon={FaUserTie}
        title="Employees"
        isActive={history.location.pathname.includes('employees')}
        onClick={() => history.replace('/employees')}
      />
      <CustomButtonWithNum
        icon={ImCart}
        title="Carts"
        isActive={history.location.pathname.includes('cart')}
        onClick={() => history.replace('/cart')}
        num={cart.length}
      />
    </Box>
  );
};

export default Aside;
