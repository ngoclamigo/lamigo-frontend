'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LuMic, LuMicOff, LuPhone, LuTicketX } from 'react-icons/lu'
import {
  Box,
  Button,
  Heading,
  Text,
  HStack,
  Spinner,
  IconButton,
  Image,
  Card,
  Badge,
  AspectRatio,
  Stack,
} from '@chakra-ui/react'

import { Tag } from '~/components/ui/tag'
// import { toaster } from '~/components/ui/toaster'

const MotionBox = motion.create(Box)
const MotionButton = motion.create(Button)

export default function VoiceAssistantPage() {
  const router = useRouter()

  const [isListening, setIsListening] = useState(false)

  const handleMicClick = () => {
    // Toggle voice recognition (replace with actual implementation)
    setIsListening((prev) => !prev)
    // toaster.create({
    //   title: isListening ? 'Stopped Listening' : 'Listening...',
    //   type: isListening ? 'warning' : 'success',
    //   duration: 2000,
    //   closable: true,
    // })
  }

  return (
    <Stack
      minH="full"
      gap={8}
      px={4}
      justifyContent="center"
      alignItems="center"
      bgGradient="linear-gradient(0deg,rgba(182, 202, 255, 1) 0%, rgba(204, 251, 241, 1) 100%)"
      borderRadius="xl"
    >
      <MotionBox
        textAlign="center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        spaceY="4"
      >
        <Heading fontSize="4xl">Scenario 5</Heading>
        <Tag startElement={<LuTicketX />} size="lg">
          Cancellations
        </Tag>
      </MotionBox>

      <MotionBox initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card.Root flexDirection="row" overflow="hidden" maxW="md" p="2" borderRadius="2xl">
          <AspectRatio ratio={1} w="200px" h="200px" flexShrink={0}>
            <Image
              borderRadius="xl"
              objectFit="cover"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Caffe Latte"
            />
          </AspectRatio>
          <Box>
            <Card.Body>
              <Card.Title mb="2">Anne Wojcicki</Card.Title>
              <Card.Description>Calling in to cancel her subscription</Card.Description>
              <HStack mt="2">
                <Badge>Healthcare</Badge>
                <Badge>Investment</Badge>
              </HStack>
            </Card.Body>
            <Card.Footer>
              {/* <Button>Buy Latte</Button> */}
              <Text color="yellow.600" fontWeight="medium">
                Satisfaction: 5/10
              </Text>
            </Card.Footer>
          </Box>
        </Card.Root>
      </MotionBox>

      <HStack>
        <MotionButton
          onClick={handleMicClick}
          size="lg"
          rounded="full"
          px={8}
          py={6}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          shadow="lg"
          variant={isListening ? 'subtle' : 'solid'}
        >
          {isListening ? <LuMicOff size={24} /> : <LuMic size={24} />} Tap to {isListening ? 'Stop' : 'Speak'}
        </MotionButton>
        <IconButton size="lg" borderRadius="full" colorPalette="red" onClick={() => router.push('/simulation/summary')}>
          <LuPhone />
        </IconButton>
      </HStack>

      {isListening && (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <HStack gap={4}>
            <Spinner size="md" borderWidth="2px" />
            <Text>Listening for your command...</Text>
          </HStack>
        </MotionBox>
      )}

      <MotionBox
        px={6}
        py={4}
        bg="whiteAlpha.200"
        rounded="xl"
        shadow="xl"
        backdropBlur="xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Text fontSize="md">
          Try saying: <strong>&quot;Nice to meet you&quot;</strong> or <strong>&quot;How have you been?&quot;</strong>
        </Text>
      </MotionBox>
    </Stack>
  )
}
