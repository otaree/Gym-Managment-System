/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useHistory, useParams } from 'react-router';
import { Box, Heading, Spinner, Flex } from '@chakra-ui/core';

import MemberForm from '../components/MemberForm';
import BackButton from '../components/BackButton';
import { IMemberDocument } from '../db';
import ipcEvents from '../constants/ipcEvents.json';

const AddMemberForm = () => {
  const [member, setMember] = useState<IMemberDocument | null>();
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (data: unknown) => {
    await ipcRenderer.invoke(ipcEvents.UPDATE_MEMBER, { id, data });
    history.goBack();
  };

  useEffect(() => {
    const fetchMember = async () => {
      // const isAuth = await ipcRenderer.invoke(ipcEvents.STAFF_LOGIN, data);
      setIsFetching(true);
      const resMember: IMemberDocument = await ipcRenderer.invoke(
        ipcEvents.GET_MEMBER,
        id
      );
      setMember(resMember);
      setIsFetching(false);
    };
    fetchMember();
  }, [id]);

  if (isFetching) {
    return (
      <Flex height="80vh" justifyContent="center" alignItems="center">
        <Spinner color="purple.500" size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      <BackButton />
      <Heading>Edit Member</Heading>
      <MemberForm onSubmitted={onSubmit} isEdit member={member!} />
    </Box>
  );
};

export default AddMemberForm;
