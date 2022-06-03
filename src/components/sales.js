import { useState, useEffect } from 'react';
import {
  Input,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  FormLabel,
  Button,
  Text,
  Spinner,
  FormControl,
  VStack,
  Box,
  Flex,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalBody, ModalContent } from '@chakra-ui/react';

import { DownloadIcon } from '@chakra-ui/icons';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Sales = () => {
  /*   
    States
 */
  const [file, setFile] = useState();
  const fileReader = new FileReader();
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState('dispatch');
  const [enteredAWB, setEnteredAWB] = useState('');

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [dispatchcount, setDispatchCount] = useState(0);
  const [pendingcount, setPendingCount] = useState(0);
  const [cancelcount, setCancelCount] = useState(0);

  const [dispatchArray, setDispatchArray] = useState([]);
  const [pendingArray, setPendingArray] = useState([]);
  const [cancelArray, setCancelArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  const [isScan, setIsScan] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [isCancel, setIsCancel] = useState(true);
  const [isDispatch, setIsDispatch] = useState(true);

  /*
    Event Handlers 
   */
  const onChangeHandler = e => {
    setFile(e.target.files[0]);
  };
  const switchScanHandler = () => {
    if (isScan === true) setIsScan(false);
    if (isDispatch === false) setIsDispatch(true);
    if (isCancel === false) setIsCancel(true);
    if (isPending === false) setIsPending(true);
  };
  const switchDispatchHandler = () => {
    if (isScan === false) setIsScan(true);
    if (isDispatch === true) setIsDispatch(false);
    if (isCancel === false) setIsCancel(true);
    if (isPending === false) setIsPending(true);
  };
  const switchPendingHandler = () => {
    if (isScan === false) setIsScan(true);
    if (isPending === true) setIsPending(false);
    if (isDispatch === false) setIsDispatch(true);
    if (isCancel === false) setIsCancel(true);
  };
  const switchCancelHandler = () => {
    if (isScan === false) setIsScan(true);
    if (isDispatch === false) setIsDispatch(true);
    if (isPending === false) setIsPending(true);
    if (isCancel === true) setIsCancel(false);
  };
  const handleSelect = ranges => {
    setEndDate(ranges.selection.endDate);
    setStartDate(ranges.selection.startDate);
  };

  const SelectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  /* 
    API Action Handlers
  */
  // csv to array conversion
  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map(i => {
      const values = i.split(',') || i.split(' ');
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    fetch('http://localhost:3001/api/sales/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(array),
    });
    console.log(array);
  };
  // submit csv file to function
  const onSubmitHandler = e => {
    setIsLoading(true);
    if (file) {
      fileReader.onload = function (e) {
        const csvOutput = e.target.result;
        csvFileToArray(csvOutput);
      };
      fileReader.readAsText(file);
    }
  };

  // update or scan the product with dispatch
  useEffect(() => {
    const updateHandler = async () => {
      await fetch('http://localhost:3001/api/sales/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awb: enteredAWB,
          status,
        }),
      });
    };
    updateHandler();
  }, [status, enteredAWB]);

  // filter the product according to AWB
  useEffect(() => {
    const filterHandler = async () => {
      const receivedList = await fetch(
        'http://localhost:3001/api/sales/filter',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            awb: enteredAWB,
          }),
        }
      );
      const result = await receivedList.json();
      setFilterArray(result);
    };
    filterHandler();
  }, [enteredAWB]);

  // dispatch filter
  const dispatchFilter = async () => {
    const receivedList = await fetch(
      'http://localhost:3001/api/sales/dispatchfilter'
    );
    const result = await receivedList.json();
    setDispatchArray(result);
  };
  // pending filter
  const pendingFilter = async () => {
    const receivedList = await fetch(
      'http://localhost:3001/api/sales/pendingfilter'
    );
    const result = await receivedList.json();
    setPendingArray(result);
  };
  // Cancel filter
  const cancelHandler = async () => {
    const recievedData = await fetch(
      'http://localhost:3001/api/sales/cancelfilter'
    );
    const result = await recievedData.json();
    setCancelArray(result);
  };
  const filterCount = async status => {
    const response = await fetch(
      'http://localhost:3001/api/sales/filterCount',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status,
        }),
      }
    );
    const count = await response.json();
    if (status === 'dispatch') setDispatchCount(count);
    if (status === 'pending') setPendingCount(count);
    if (status === 'cancel') setCancelCount(count);
  };

  /* 
    Hooks
  */

  useEffect(() => {
    cancelHandler();
    dispatchFilter();
    pendingFilter();
  }, [isScan, isPending, isDispatch, isCancel]);

  useEffect(() => {
    filterCount('dispatch');
  }, [isDispatch]);
  useEffect(() => {
    filterCount('pending');
  }, [isPending]);
  useEffect(() => {
    filterCount('cancel');
  }, [isCancel]);

  return (
    <VStack p={4} pb={20}>
      <Heading size={'lg'} pb={10}>
        Sales Section
      </Heading>
      <Box textAlign={'center'}>
        <FormControl>
          <FormLabel
            w={'100%'}
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
          <Button
            type={'button'}
            w={'100%'}
            onClick={onSubmitHandler}
            variant={'outline'}
          >
            Import
          </Button>
        </FormControl>
        <Button mt={4} width={'100%'} onClick={onOpen}>
          Date Filter
        </Button>
        <Modal size={'sm'} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <DateRange ranges={[SelectionRange]} onChange={handleSelect} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Flex py={2}>
          <Button onClick={switchScanHandler}>Scan Products</Button>
          <Menu>
            <MenuButton as={Button}>List Products</MenuButton>
            <MenuList>
              <MenuItem onClick={switchDispatchHandler}>Dispatch List</MenuItem>
              <MenuItem onClick={switchPendingHandler}>Pending List</MenuItem>
              <MenuItem onClick={switchCancelHandler}>Cancel List</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      {/* Scan Section */}
      {!isScan && (
        <Box>
          <Input
            width={'22%'}
            type={'text'}
            mt={5}
            textAlign={'center'}
            onChange={e => {
              setEnteredAWB(e.target.value);
              setStatus('dispatch');
            }}
            value={enteredAWB}
            placeholder="Enter AWB"
            autoFocus
            autoCapitalize="true"
          />
          <TableContainer
            pt={10}
            rounded={'lg'}
            boxShadow={'lg'}
            h={400}
            w={1200}
            overflowY={'auto'}
            overflowX={'scroll'}
          >
            <Table variant={'simple'}>
              <Thead>
                <Tr key={'header'}>
                  <Th textAlign={'center'}>AWB</Th>
                  <Th textAlign={'center'}>order id</Th>
                  <Th textAlign={'center'}>SKU</Th>
                  <Th textAlign={'center'}>QTY</Th>
                  <Th textAlign={'center'}>Status</Th>
                  <Th textAlign={'center'}>courier</Th>
                  <Th textAlign={'center'}>date</Th>
                  <Th textAlign={'center'}>firm</Th>
                  <Th textAlign={'center'}>Portal</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterArray.map(item => (
                  <Tr key={item._id}>
                    <Td>{item.AWB}</Td>
                    <Td>{item.ORDER_ID}</Td>
                    <Td>{item.SKU}</Td>
                    <Td>{item.QTY}</Td>
                    <Td>
                      <Select
                        onChange={e => {
                          setStatus(e.target.value);
                        }}
                        value={status}
                        mx={8}
                      >
                        <option value={'dispatch'} defaultChecked>
                          dispatch
                        </option>
                        <option value={'pending'}>pending</option>
                        <option value={'cancel'}>cancel</option>
                      </Select>
                    </Td>
                    <Td>{item.courier}</Td>
                    <Td>{item.date}</Td>
                    <Td>{item.firm}</Td>
                    <Td>{item['PORTAL\r']}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Filters Section */}
      {isScan && (
        <VStack>
          <Flex py={8} justifyContent={'space-between'}>
            <Heading mt={2} size={'md'}>
              {!isDispatch
                ? 'Dispatch Table'
                : !isPending
                ? 'Pending Table'
                : !isCancel
                ? 'Cancel Table'
                : ''}
            </Heading>
            <Button>
              {!isDispatch
                ? `${dispatchcount}`
                : !isPending
                ? `${pendingcount}`
                : !isCancel
                ? `${cancelcount}`
                : 'null'}
            </Button>
          </Flex>

          {isLoading && <Spinner size={'xl'} />}
          {!isLoading && (
            <TableContainer
              rounded={'lg'}
              boxShadow={'lg'}
              overflowY={'auto'}
              overflowX={'auto'}
              h={600}
              w={1200}
              mb={20}
            >
              <Table variant="simple">
                <Thead
                  position={'sticky'}
                  top={0}
                  backgroundColor={'lightblue'}
                >
                  <Tr key={'header'}>
                    <Th textAlign={'center'}>AWB</Th>
                    <Th textAlign={'center'}>order id</Th>
                    <Th textAlign={'center'}>SKU</Th>
                    <Th textAlign={'center'}>QTY</Th>
                    <Th textAlign={'center'}>STATUS</Th>
                    <Th textAlign={'center'}>courier</Th>
                    <Th textAlign={'center'}>date</Th>
                    <Th textAlign={'center'}>firm</Th>
                    <Th textAlign={'center'}>Portal</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {!isDispatch ? (
                    dispatchArray.map(item => (
                      <Tr key={item._id}>
                        <Td>{item.AWB}</Td>
                        <Td>{item.ORDER_ID}</Td>
                        <Td>{item.SKU}</Td>
                        <Td>{item.QTY}</Td>
                        <Td>{item.status}</Td>
                        <Td>{item.courier}</Td>
                        <Td>{item.date}</Td>
                        <Td>{item.firm}</Td>
                        <Td>{item['PORTAL\r']}</Td>
                      </Tr>
                    ))
                  ) : !isPending ? (
                    pendingArray.map(item => (
                      <Tr key={item._id}>
                        <Td>{item.AWB}</Td>
                        <Td>{item.ORDER_ID}</Td>
                        <Td>{item.SKU}</Td>
                        <Td>{item.QTY}</Td>
                        <Td>{item.status}</Td>
                        <Td>{item.courier}</Td>
                        <Td>{item.date}</Td>
                        <Td>{item.firm}</Td>
                        <Td>{item['PORTAL\r']}</Td>
                      </Tr>
                    ))
                  ) : !isCancel ? (
                    cancelArray.map(item => (
                      <Tr key={item._id}>
                        <Td>{item.AWB}</Td>
                        <Td>{item.ORDER_ID}</Td>
                        <Td>{item.SKU}</Td>
                        <Td>{item.QTY}</Td>
                        <Td>{item.status}</Td>
                        <Td>{item.courier}</Td>
                        <Td>{item.date}</Td>
                        <Td>{item.firm}</Td>
                        <Td>{item['PORTAL\r']}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td>Error</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default Sales;
