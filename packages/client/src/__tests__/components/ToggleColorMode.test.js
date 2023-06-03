import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ToggleColorMode from '../../components/ToggleColorMode';

test('ToggleColorMode', () => {
  const { getByRole } = render(
    <ChakraProvider>
      <ToggleColorMode />
    </ChakraProvider>
  );
  const button = getByRole('button');
  fireEvent.click(button);
});
