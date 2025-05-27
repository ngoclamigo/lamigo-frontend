import {
  FiBarChart2,
  FiBell,
  FiFileText,
  FiHome,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { Button, HStack, Image, Input, InputGroup, StackSeparator, Text, VStack } from '@chakra-ui/react'

export function Navigation() {
  return (
    <VStack gap="4" align="stretch" separator={<StackSeparator />} divideStyle="dashed">
      <HStack align="center" gap="4" px="5">
        <Image src="/brand.svg" alt="Brand icon" height="8" />
        <Text color="brand.600" fontWeight="bold" fontSize="lg">
          Lamigo AI
        </Text>
      </HStack>
      <VStack gap="4" align="stretch">
        <InputGroup endElement={<FiSearch />}>
          <Input placeholder="Search..." />
        </InputGroup>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiHome /> Dashboard
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiUsers /> Team Members
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiBarChart2 /> Analytics
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiFileText /> Content Library
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiZap /> AI Insights
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiMessageSquare /> Messages
        </Button>
      </VStack>
      <VStack gap="4" align="stretch">
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiBell /> Notifications
        </Button>
        <Button variant="ghost" justifyContent="flex-start" size="lg">
          <FiSettings /> Settings
        </Button>
      </VStack>
    </VStack>
  )
}
