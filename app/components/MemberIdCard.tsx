/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React from 'react';
import { format } from 'date-fns';
import { Box, Flex, Image, Text, Divider, Avatar } from '@chakra-ui/core';

import { IMemberDocument } from '../db';
import HeaderLogo from '../assets/GYMVENGER.png';
import FrontBG from '../assets/ID_CARD_FRONT_BG.png';
import CardBG from '../assets/CARD_BG.png';

const zeroPad = (num: number) => {
  if (!num) return '_';
  if (num < 10 && num > 0) return `0${num}`;
  return num;
};

// eslint-disable-next-line react/prop-types
const CardFace: React.FC = ({ children }) => (
  <Box
    borderWidth={1}
    borderColor="gray.400"
    borderRadius="md"
    overflow="hidden"
    width="50%"
    pos="relative"
  >
    {children}
  </Box>
);

// eslint-disable-next-line react/prop-types
const IDCard: React.FC<{ member: IMemberDocument }> = ({
  member,
}): JSX.Element => {
  return (
    <Flex borderRadius="md" p={2} w={680} maxH={235}>
      <Box
        borderWidth={1}
        borderColor="gray.400"
        borderRadius="md"
        overflow="hidden"
        width="50%"
        pos="relative"
      >
        <Image src={CardBG} objectFit="cover" />
        <Box pos="absolute" top={0} bottom={0} left={0} right={0}>
          <Box>
            <Text
              fontFamily="heading"
              fontWeight="bold"
              fontSize="5xl"
              letterSpacing="2px"
              textAlign="center"
              color="purple.300"
              lineHeight="42px"
            >
              GYMVENGER
            </Text>
            <Text
              fontFamily="heading"
              fontWeight="medium"
              fontSize="md"
              color="white"
              pl={2}
              lineHeight="md"
            >
              MEMBERSHIP CARD
            </Text>
          </Box>
          <Flex justifyContent="flex-end" pr={10}>
            <Avatar src={member.img} size="xl" />
          </Flex>
          <Box p={5} pt={0} color="white">
            <Text as="p" fontSize="sm" lineHeight="sm">
              <Text as="span" textTransform="uppercase" fontWeight="medium">
                {member.firstName} {member.lastName}
              </Text>
              <br />
              <Text as="span" fontWeight="medium">
                {member.memberId}
              </Text>
            </Text>
          </Box>
        </Box>
        <Box pos="absolute" bottom={0} left={0} right={0} pr={4}>
          <Text
            verticalAlign="text-bottom"
            textAlign="right"
            fontSize="xs"
            fontWeight="medium"
            color="white"
            textTransform="uppercase"
          >
            VALID TILL: {format(member.memberShipExpirationDate!, 'MMM yyyy')}
          </Text>
        </Box>
      </Box>
      <Divider
        orientation="vertical"
        borderStyle="dashed"
        width={1}
        borderColor="gray.400"
      />
      <CardFace>
        <Image src={CardBG} objectFit="cover" />
        <Box pos="absolute" bottom={0} left={0} right={0} p={4} color="white">
          <Text fontSize="xs" fontWeight="medium" textAlign="right">
            AIRFIELD, OPPOSITE ARMY HOSPITAL, TEZU, ARUNACHAL PRADESH, 792001
          </Text>
          <Text fontSize="xs" fontWeight="medium" textAlign="right">
            Tel. No.: +919612751698
          </Text>
        </Box>
      </CardFace>
    </Flex>
  );
};

export default IDCard;
