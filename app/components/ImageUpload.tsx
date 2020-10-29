/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Image, PseudoBox, Stack, Text } from '@chakra-ui/core';
import ImageUploading from 'react-images-uploading';
import { AiOutlineUpload } from 'react-icons/ai';

import PersonImage from '../assets/person.png';

const ImageUpload: React.FC<{
  width: number;
  height: number;
  acceptedTypes: string[];
  maxFileSize: number;
  value: string;
  onChange: (base64Img: string) => void;
}> = ({ maxFileSize, acceptedTypes, height, width, value = '', onChange }) => {
  const [base64Img, setBase64Img] = useState(value);
  const [showUploadBtn, setShowUploadBtn] = useState(false);

  return (
    <Box>
      <ImageUploading
        multiple={false}
        maxFileSize={maxFileSize}
        acceptType={acceptedTypes}
        onChange={(args) => {
          const img = args[0].dataURL as string;
          setBase64Img(img);
          onChange(img);
        }}
        value={[]}
      >
        {({ onImageUpload }) => (
          <Box
            pos="relative"
            cursor="pointer"
            onMouseEnter={() => setShowUploadBtn(true)}
            onMouseLeave={() => setShowUploadBtn(false)}
          >
            {showUploadBtn && (
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={1}
                backgroundColor="blackAlpha.400"
              />
            )}
            {showUploadBtn && (
              <PseudoBox
                pos="absolute"
                left={0}
                right={0}
                bottom={0}
                zIndex={2}
                fontSize="sm"
                py={2}
                backgroundColor="white"
                width="100%"
                _hover={{ bg: 'white', color: 'gray.500' }}
                _active={{
                  bg: 'white',
                  color: 'gray.500',
                }}
                outline="none"
                onClick={onImageUpload}
              >
                <Stack isInline alignItems="center" pl={4}>
                  <Box as={AiOutlineUpload} />
                  <Text>Upload</Text>
                </Stack>
              </PseudoBox>
            )}
            {base64Img.length === 0 ? (
              <Image
                height={height}
                width={width}
                objectFit="fill"
                src={PersonImage}
              />
            ) : (
              <Image
                height={height}
                width={width}
                objectFit="fill"
                src={base64Img}
              />
            )}
          </Box>
        )}
      </ImageUploading>
    </Box>
  );
};

export default ImageUpload;
