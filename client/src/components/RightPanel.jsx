// // RightPanel.js
// import React from 'react';
// import {
//   Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Text, VStack, HStack, Image, Link, Icon, useColorModeValue
// } from '@chakra-ui/react';
// import { FaArrowUp, FaArrowDown, FaWallet, FaUsers, FaClipboardList, FaShoppingCart } from 'react-icons/fa';

// const StatCard = ({ title, stat, icon, change, isIncrease }) => (
//   <Stat
//     px={{ base: 2, md: 4 }}
//     py="5"
//     shadow="md"
//     border="1px solid"
//     borderColor={useColorModeValue('gray.200', 'gray.500')}
//     rounded="lg"
//   >
//     <HStack justifyContent="space-between">
//       <Box pl={{ base: 2, md: 4 }}>
//         <StatLabel fontWeight="medium" isTruncated>
//           {title}
//         </StatLabel>
//         <StatNumber fontSize="2xl" fontWeight="medium">
//           {stat}
//         </StatNumber>
//         <StatHelpText>
//           <HStack>
//             <Icon as={isIncrease ? FaArrowUp : FaArrowDown} color={isIncrease ? 'green.400' : 'red.400'} />
//             <Text>{change}</Text>
//           </HStack>
//         </StatHelpText>
//       </Box>
//       <Box my="auto" color={useColorModeValue('gray.800', 'white')} alignContent="center">
//         {icon}
//       </Box>
//     </HStack>
//   </Stat>
// );

// const RightPanel = () => {
//   return (
//     <Box flex="1" p="6">
//       <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
//         <StatCard
//           title="Today's Money"
//           stat="$53,000"
//           icon={<FaWallet size="3em" />}
//           change="+55%"
//           isIncrease
//         />
//         <StatCard
//           title="Today's Users"
//           stat="2,300"
//           icon={<FaUsers size="3em" />}
//           change="+5%"
//           isIncrease
//         />
//         <StatCard
//           title="New Clients"
//           stat="+3,020"
//           icon={<FaClipboardList size="3em" />}
//           change="-14%"
//           isIncrease={false}
//         />
//         <StatCard
//           title="Total Sales"
//           stat="$173,000"
//           icon={<FaShoppingCart size="3em" />}
//           change="+8%"
//           isIncrease
//         />
//       </SimpleGrid>
//       <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, lg: 8 }} mt={6}>
//         <Box
//           p="5"
//           shadow="md"
//           borderWidth="1px"
//           borderColor={useColorModeValue('gray.200', 'gray.500')}
//           rounded="lg"
//           bg={useColorModeValue('white', 'gray.800')}
//         >
//           <Text fontSize="xl" mb={4} fontWeight="bold">
//             Built by Developers
//           </Text>
//           <VStack spacing={2} align="start">
//             <Text>
//               From colors, cards, typography to complex elements, you will find the full documentation.
//             </Text>
//             <Link color="teal.500" href="#">
//               Read more →
//             </Link>
//           </VStack>
//         </Box>
//         <Box
//           p="5"
//           shadow="md"
//           borderWidth="1px"
//           borderColor={useColorModeValue('gray.200', 'gray.500')}
//           rounded="lg"
//           bg={useColorModeValue('white', 'gray.800')}
//           textAlign="center"
//         >
//           <Image src="https://via.placeholder.com/150" alt="chakra" mx="auto" mb={4} />
//           <Text fontSize="xl" mb={4} fontWeight="bold">
//             chakra
//           </Text>
//           <VStack spacing={2} align="center">
//             <Text>
//               Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first.
//             </Text>
//             <Link color="teal.500" href="#">
//               Read more →
//             </Link>
//           </VStack>
//         </Box>
//       </SimpleGrid>
//     </Box>
//   );
// };

// export default RightPanel;


// src/components/RightPanel.js
