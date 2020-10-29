/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router';
import { Box, Heading } from '@chakra-ui/core';

import MemberForm from '../components/MemberForm';
import BackButton from '../components/BackButton';
import ipcEvents from '../constants/ipcEvents.json';

const AddMemberForm = () => {
  const history = useHistory();

  const onSubmit = async (data: unknown) => {
    const member = await ipcRenderer.invoke(ipcEvents.CREATE_MEMBER, data);
    history.push(`/members/${member._id}`);
  };

  return (
    <Box>
      <BackButton />
      <Heading>Add Member</Heading>
      <MemberForm onSubmitted={onSubmit} />
    </Box>
  );
};

export default AddMemberForm;
