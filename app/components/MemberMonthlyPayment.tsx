/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { format } from 'date-fns';
import {
  Box,
  Text,
  Flex,
  Tag,
  TagLabel,
  IconButton,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core';

import MonthlyPaymentForm from './MonthlyPaymentForm';
import { IMonthlyPayment } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MonthlyPayment: React.FC<{
  monthlyPayments: IMonthlyPayment[];
  id: string;
  onUpdate?: () => void;
}> = ({ id, monthlyPayments, onUpdate = () => {} }) => {
  const [modalDetails, setModalDetails] = useState<{
    type: string;
    date: Date | null;
  }>({
    type: '',
    date: null,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const monthlyPayments: IMonthlyPayment[] = Array(5)
  //   .fill(0)
  //   .map((_, i) => ({
  //     date: new Date(2020, 3 + i, 1),
  //     amount: 2000,
  //     paid: Math.random() > 0.5,
  //   }));

  // const onSubmit = async (data: IMonthlyPayment) => {
  //   let newMonthlyPayments: IMonthlyPayment[] = [...monthlyPayments];
  //   if (modalDetails.type === 'add') {
  //     newMonthlyPayments = newMonthlyPayments
  //       .filter(
  //         (paymentDetail) =>
  //           paymentDetail.date.getMonth() !== data.date.getMonth()
  //       )
  //       .concat([data]);
  //   } else if (modalDetails.type === 'edit') {
  //     newMonthlyPayments = newMonthlyPayments.map((payment) => {
  //       if (payment.date.getMonth() === data.date.getMonth()) return data;
  //       return payment;
  //     });
  //   }

  //   newMonthlyPayments.sort((a, b) => {
  //     if (a.date.getMonth() < b.date.getMonth()) return -1;
  //     if (a.date.getMonth() > b.date.getMonth()) return 1;
  //     return 0;
  //   });
  //   await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
  //     id,
  //     data: { monthlyPayments: newMonthlyPayments },
  //   });
  //   onClose();
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   onUpdate();
  // };
  const onSubmit = async (data: IMonthlyPayment) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER_MONTHLY_PAYMENT, {
      id,
      data,
    });
    onClose();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onUpdate();
  };

  const onDelete = async (date: Date) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, {
      id,
      data: {
        monthlyPayments: monthlyPayments.filter(
          (paymentDetail) => paymentDetail.date.getMonth() !== date.getMonth()
        ),
      },
    });
    onUpdate();
  };

  return (
    <Box p={4}>
      <Box width="fit-content">
        <Flex
          justifyContent="flex-end"
          borderWidth={1}
          borderBottomWidth={0}
          backgroundColor="white"
        >
          <IconButton
            m={2}
            icon="add"
            aria-label="add"
            size="sm"
            variantColor="green"
            onClick={() => {
              setModalDetails({ type: 'add', date: null });
              onOpen();
            }}
          />
        </Flex>
        <Box as="table" borderWidth={1} backgroundColor="white">
          <Box as="thead">
            <Box as="tr" borderBottomWidth={1}>
              <Text as="th" w={200}>
                Date
              </Text>
              <Text as="th" w={160}>
                Amount(&#8377;)
              </Text>
              <Text as="th" w={120}>
                Paid
              </Text>
              <Text as="th" w={100}>
                Actions
              </Text>
            </Box>
          </Box>
          <Box as="tbody">
            {monthlyPayments.map((paymentDetails) => (
              <Box
                as="tr"
                key={paymentDetails.date.toISOString()}
                borderBottomWidth={1}
              >
                <Text as="td" p={2}>
                  {/* {months[paymentDetails.date.getMonth()]} */}
                  {format(paymentDetails.date, 'do MMM yyyy')}
                </Text>
                <Text as="td" textAlign="center">
                  {paymentDetails.amount}
                </Text>
                <Box as="td">
                  <Flex justifyContent="center">
                    {paymentDetails.paid ? (
                      <Tag
                        size="sm"
                        variantColor="green"
                        variant="solid"
                        rounded="full"
                      >
                        <TagLabel>Paid</TagLabel>
                      </Tag>
                    ) : (
                      <Tag
                        size="sm"
                        variantColor="red"
                        variant="solid"
                        rounded="full"
                      >
                        <TagLabel>Due</TagLabel>
                      </Tag>
                    )}
                  </Flex>
                </Box>
                <Flex as="td" justifyContent="center" alignItems="center">
                  <Stack isInline>
                    <IconButton
                      icon="edit"
                      size="sm"
                      variant="ghost"
                      variantColor="purple"
                      aria-label="edit"
                      onClick={() => {
                        setModalDetails({
                          type: 'edit',
                          date: paymentDetails.date,
                        });
                        onOpen();
                      }}
                    />
                    <IconButton
                      icon="delete"
                      size="sm"
                      variant="ghost"
                      variantColor="red"
                      aria-label="delete"
                      onClick={() => onDelete(paymentDetails.date)}
                    />
                  </Stack>
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalDetails.type === 'edit'
              ? 'Edit Monthly Payment'
              : 'Add Monthly Payment'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalDetails.type === 'edit' ? (
              <MonthlyPaymentForm
                onSubmitted={onSubmit}
                paymentDetails={monthlyPayments.find(
                  (paymentDetails) =>
                    modalDetails.date &&
                    paymentDetails.date.getMonth() ===
                      modalDetails.date.getMonth()
                )}
              />
            ) : (
              <MonthlyPaymentForm onSubmitted={onSubmit} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MonthlyPayment;
