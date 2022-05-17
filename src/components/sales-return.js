import { useState } from 'react';
import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Input,
  Text,
  FormLabel,
  Flex,
  Td,
  Heading,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
// files

const SalesReturn = () => {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(false);
    setArray(array);
  };

  const onSubmitHandler = e => {
    // e.preventDefault();
    setIsLoading(true);
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
  return (
    <Box p={4}>
      <Heading size={'lg'} pb={10}>
        Sales Return Section
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
        <Button type={'button'} onClick={onSubmitHandler} variant={'outline'}>
          Import
        </Button>
      </Flex>
      <Heading size={'md'} pt={20} pb={4}>
        Sales Return Table
      </Heading>
      {isLoading && <Spinner />}
      {!isLoading && (
        <TableContainer
          rounded={'lg'}
          boxShadow={'lg'}
          overflowY={'hidden'}
          overflowX={'scroll'}
          h={400}
          w={800}
          mb={20}
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
                <Tr key={item}>
                  {Object.values(item).map(val => (
                    <Td textAlign={'center'}>{val}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SalesReturn;
