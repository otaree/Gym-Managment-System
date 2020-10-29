import React, { ReactNode } from 'react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <ThemeProvider>
      <CSSReset />
      {children}
    </ThemeProvider>
  );
}
