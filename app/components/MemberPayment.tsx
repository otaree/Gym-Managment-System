/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
import {
  Box,
  Heading,
  Flex,
  Text,
  IconButton,
  Select,
  Spinner,
} from '@chakra-ui/core';

import Pagination from './TablePagination';
import { IMemberPaymentDocument, IMemberPaymentQuery } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const MemberPayments: React.FC<{ memberId: string; id: string; }> = ({ id, memberId  }) => {
  const [memberPayments, setMemberPayments] = useState<IMemberPaymentDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  // const [query, setQuery] = useState<{ limit: number, skip: number, }>({  })
}
