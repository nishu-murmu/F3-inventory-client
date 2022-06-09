import { useEffect, useState } from 'react';
import {
  Heading,
  Table,
  Input,
  Button,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  VStack,
  Radio,
  RadioGroup,
  Wrap,
  WrapItem,
  Flex,
  FormControl,
  FormLabel,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalBody, ModalContent } from '@chakra-ui/react';

// files
import AnimatedPage from '../../pages/AnimatedPage';

const Mapped = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [array, setArray] = useState([]);

  const [grandParent, setGrandParent] = useState('');
  const [parent, setParent] = useState('');
  const [child, setChild] = useState('');
  const [combo, setCombo] = useState([]);

  const [isSingle, setIsSingle] = useState(true);

  const [isChange, setIsChange] = useState(false);

  const toggleChange = () => {
    setIsChange(!isChange);
  };
  const submitArrayHandler = () => {
    fetch('https://cryptic-bayou-61420.herokuapp.com/api/master/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grand_parent: grandParent,
        parent,
        child,
        mastersku: [grandParent, parent, child].join('_'),
        combo: combo,
      }),
    });
  };

  const getListHandler = async () => {
    setIsLoading(true);
    const response = await fetch(
      'https://cryptic-bayou-61420.herokuapp.com/api/master/getAll'
    );
    const result = await response.json();
    setIsLoading(false);
    setArray(result);
  };

  useEffect(() => {
    getListHandler();
  }, [isChange]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack p={4}>
      <AnimatedPage>
        <Heading size={'lg'} pb={10}>
          Master SKU Section
        </Heading>
      </AnimatedPage>
      <AnimatedPage>
        <RadioGroup defaultChecked={'1'} width={'40%'}>
          <Flex justifyContent={'space-between'}>
            <Radio px={4} onChange={() => setIsSingle(true)} value={'1'}>
              Single
            </Radio>
            <Radio px={4} onChange={() => setIsSingle(false)} value={'2'}>
              Combo
            </Radio>
          </Flex>
        </RadioGroup>
      </AnimatedPage>

      {/* Single Master SKU */}
      {isSingle && (
        <AnimatedPage>
          <form
            onSubmit={e => {
              submitArrayHandler(e);
              toggleChange(e);
            }}
            py={4}
          >
            <FormControl pt={6}>
              <FormLabel htmlFor="single">Create Single Master SKU</FormLabel>
              <VStack id={'single'}>
                <Flex>
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setGrandParent(e.target.value);
                    }}
                    placeholder="grand-parent"
                    required
                  />
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setParent(e.target.value);
                    }}
                    placeholder="parent"
                    required
                  />
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setChild(e.target.value);
                    }}
                    placeholder="child"
                    required
                  />
                </Flex>
                <Button type={'submit'} w={'100%'} px={10} my={5}>
                  Submit
                </Button>
              </VStack>
            </FormControl>
          </form>
        </AnimatedPage>
      )}

      {/* Combo master SKU */}
      {!isSingle && (
        <AnimatedPage>
          <form
            onSubmit={e => {
              submitArrayHandler(e);
              toggleChange(e);
            }}
            py={4}
          >
            <FormControl pt={6}>
              <FormLabel htmlFor="single">Create Combo Master SKU</FormLabel>
              <VStack id={'single'}>
                <Flex>
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setGrandParent(e.target.value);
                    }}
                    placeholder="grand-parent"
                    required
                  />
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setParent(e.target.value);
                    }}
                    placeholder="parent"
                    required
                  />
                  <Input
                    textAlign={'center'}
                    onChange={e => {
                      setChild(e.target.value);
                    }}
                    placeholder="child"
                    required
                  />
                </Flex>
                <Button
                  as={'button'}
                  w={'100%'}
                  onClick={onOpen}
                  px={10}
                  my={5}
                >
                  Select single master SKUs
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalBody>
                      <Wrap spacing={4}>
                        {array.map(item => (
                          <WrapItem key={item._id}>
                            <Checkbox
                              type={'checkbox'}
                              onChange={e => {
                                if (e.target.checked)
                                  setCombo(prevCombo => [
                                    ...prevCombo,
                                    `${item.mastersku}`,
                                  ]);
                                else {
                                  combo.pop();
                                }
                              }}
                            >
                              {item.mastersku}
                            </Checkbox>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Button type={'submit'} w={'100%'} px={10} my={5}>
                  Submit
                </Button>
              </VStack>
            </FormControl>
          </form>
        </AnimatedPage>
      )}

      {isLoading && <Spinner size={'xl'} />}
      {!isLoading && (
        <AnimatedPage>
          <VStack>
            <Heading size={'md'} pt={20} pb={4}>
              Master SKU Table
            </Heading>
            <TableContainer
              rounded={'lg'}
              boxShadow={'lg'}
              overflowY={'auto'}
              overflowX={'auto'}
              h={400}
              w={800}
              mb={20}
            >
              <Table variant="simple">
                <Thead
                  position={'sticky'}
                  top={0}
                  backgroundColor={'lightblue'}
                >
                  <Tr key={'header'}>
                    <Th textAlign={'center'}>GrandParent</Th>
                    <Th textAlign={'center'}>Parent</Th>
                    <Th textAlign={'center'}>Child</Th>
                    <Th textAlign={'center'}>Master SKU</Th>
                    <Th textAlign={'center'}>Type</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {array.map(item => (
                    <Tr key={item._id}>
                      <Td textAlign={'center'}>{item.grand_parent}</Td>
                      <Td textAlign={'center'}>{item.parent}</Td>
                      <Td textAlign={'center'}>{item.child}</Td>
                      <Td textAlign={'center'}>{item.mastersku}</Td>
                      <Td textAlign={'center'}>
                        {item.combo.length !== 0 ? (
                          <Menu>
                            <MenuButton as={Button}>Combo</MenuButton>
                            <MenuList>
                              {item.combo.map(val => (
                                <MenuItem key={val}>{val}</MenuItem>
                              ))}
                            </MenuList>
                          </Menu>
                        ) : (
                          <Button>Single</Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </AnimatedPage>
      )}
    </VStack>
  );
};

export default Mapped;
