import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  useColorModeValue,
  Flex,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
// files

const Sales = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const fileReader = new FileReader();

  const onChangeHandler = e => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map(i => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const onSubmitHandler = e => {
    // e.preventDefault();

    if (file) {
      fileReader.onload = function (e) {
        const csvOutput = e.target.result;
        console.log(csvOutput);
        csvFileToArray(csvOutput);
      };
      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  useEffect(() => {
    onSubmitHandler();
  });
  return (
    <Box p={4}>
      <Heading size={'lg'} pb={10}>
        Sales Section
      </Heading>
      <Flex marginLeft={60}>
        <FormLabel
          w={80}
          htmlFor={'csvInput'}
          padding={'7px 0px'}
          border={'1px solid grey'}
          _hover={{ cursor: 'pointer' }}
          borderRadius={'5px'}
        >
          <Text textAlign={'center'}>
            Select csv <DownloadIcon />
          </Text>
        </FormLabel>
        <Input
          display={'none'}
          type={'file'}
          id={'csvInput'}
          accept={'.csv'}
          onChange={onChangeHandler}
        />
      </Flex>
      <Heading size={'md'} pt={20} pb={4}>
        Sales Table
      </Heading>
      <TableContainer
        rounded={'lg'}
        boxShadow={'lg'}
        overflowY={'auto'}
        overflowX={'scroll'}
        h={400}
        w={800}
        mb={20}
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        <Table variant="simple">
          <Thead position={'sticky'} top={0} backgroundColor={'lightblue'}>
            <Tr key={'header'}>
              {headerKeys.map(key => (
                <Th textAlign={'center'}>{key}</Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {array.map(item => (
              <Tr key={item.id}>
                {Object.values(item).map(val => (
                  <Td textAlign={'center'}>{val}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Sales;
