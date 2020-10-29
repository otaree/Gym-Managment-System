/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import { PseudoBox, Text, Stack, Flex } from '@chakra-ui/core';
import { IconType } from 'react-icons';
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';

const PaginationButton: React.FC<{
  icon: IconType;
  onClick: () => void;
  isDisable?: boolean;
}> = ({ icon, isDisable = false, onClick }) => (
  <Flex justifyContent="center" alignItems="center">
    <PseudoBox
      as={icon}
      fontSize="xl"
      cursor={isDisable ? 'default' : 'pointer'}
      _hover={{ color: 'gray.500' }}
      color={isDisable ? 'gray.500' : 'gray.800'}
      onClick={() => !isDisable && onClick()}
    />
  </Flex>
);

interface ITablePaginationProps {
  goTo: (skipTo: number) => void;
  skip: number;
  limit: number;
  totalCount: number;
}
const TablePagination: React.FC<ITablePaginationProps> = ({
  goTo,
  skip,
  limit,
  totalCount,
}) => {
  return (
    <Stack isInline>
      <PaginationButton
        icon={BiArrowToLeft}
        isDisable={skip === 0}
        onClick={() => goTo(0)}
      />
      <PaginationButton
        icon={BiChevronsLeft}
        isDisable={skip === 0}
        onClick={() => goTo(skip - 1)}
      />
      <Text mx={2}>
        {(limit * skip) + 1}
        -
        {((limit * skip) + limit) < totalCount ? (limit * skip) + limit : totalCount}
        {' '}
        of
        {' '}
        {totalCount}
      </Text>
      <PaginationButton
        icon={BiChevronsRight}
        isDisable={totalCount <= limit * (skip + 1)}
        onClick={() => goTo(skip + 1)}
      />
      <PaginationButton
        icon={BiArrowToRight}
        isDisable={totalCount <= limit * (skip + 1)}
        onClick={() => goTo(Math.ceil(totalCount / limit) - 1)}
      />
      {/* <IconButton variant="ghost" icon={BiArrowToLeft} aria-label="left" /> */}
      {/* <IconButton variant="ghost" icon={BiArrowToRight} aria-label="right" /> */}
    </Stack>
  );
};

export default TablePagination;
