/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router';
import { IconButton } from '@chakra-ui/core';

const BackButton: React.FC<{ url?: string }> = ({ url = '' }) => {
  const history = useHistory();

  return (
    <IconButton
      variant="ghost"
      icon="arrow-back"
      aria-label="back"
      size="lg"
      onClick={() => {
        if (url.trim().length > 0) {
          history.push(url);
        } else {
          history.goBack();
        }
      }}
    />
  );
};

export default BackButton;
