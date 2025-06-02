'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Center,
  SimpleGrid,
  // Badge,
  Card,
  Flex,
  Icon,
  Alert,
  Separator,
  Collapsible,
  IconButton,
} from '@chakra-ui/react'
import {
  FiMic,
  FiMicOff,
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBriefcase,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiPlay,
  // FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
} from 'react-icons/fi'

import { useColorModeValue } from '~/components/ui/color-mode'
import { NativeSelect } from '~/components/ui/native-select'
// import { Progress } from '~/components/ui/progress'
import { Avatar } from '~/components/ui/avatar'
import { useAudioInputDevices } from '~/hooks/use-audio-input-devices'

// Motion components
const MotionBox = motion(Box)
const MotionCard = motion(Card.Root)
const MotionButton = motion(Button)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
}

const stepVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
}

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export default function VoicePracticeSetup() {
  const router = useRouter()

  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  })

  const { devices, error, loading } = useAudioInputDevices()

  const isTestingMic = false // Mock state for demonstration
  const micTestResult = 'success' // Mock result for demonstration

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('gray.50', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  // Mock data
  const sessionDetails = [
    {
      icon: FiUser,
      name: 'Interviewer',
      topDesc: 'Anne Wojcicki',
      bottomDesc: 'Vista Equity Partner',
    },
    {
      icon: FiCalendar,
      name: 'Session Type',
      topDesc: 'PE Interview Practice',
      bottomDesc: 'Case Study Focus',
    },
    {
      icon: FiClock,
      name: 'Duration',
      topDesc: '45 minutes',
      bottomDesc: 'With real-time feedback',
    },
    {
      icon: FiMapPin,
      name: 'Focus Area',
      topDesc: 'Healthcare Tech',
      bottomDesc: 'Market Analysis',
    },
  ]

  const partnerInfo = {
    name: 'Anne Wojcicki',
    desc: 'Vista Equity Partner specializing in healthcare technology investments',
    expertise: [
      { icon: FiBriefcase, name: 'PE Experience' },
      { icon: FiTrendingUp, name: 'Market Analysis' },
      { icon: FiDollarSign, name: 'Deal Structuring' },
      { icon: FiUsers, name: 'Team Building' },
    ],
  }

  // Toggle collapse state for steps
  const toggleCollapse = (stepNumber: number) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }))
  }

  const handleStartSimulation = () => {
    console.log('Starting voice practice simulation...')
    router.push('/simulation')
  }

  return (
    <Box minH="100vh" pb="120px">
      <Container maxW="container.lg" py={8}>
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <MotionBox mb={8} textAlign="center" variants={cardVariants}>
            <Heading
              size="3xl"
              mb={2}
              bgGradient="linear-gradient(90deg,rgba(20, 184, 166, 1) 0%, rgba(74, 116, 241, 1) 100%)"
              bgClip="text"
            >
              Voice Practice Setup
            </Heading>
            <Text color={mutedColor} fontSize="lg">
              Get ready for your Vista Equity practice session
            </Text>
          </MotionBox>

          <VStack gap={6}>
            {/* Step 1: Context Verification */}
            <MotionCard
              w="full"
              variants={cardVariants}
              whileHover="hover"
              bg={bgColor}
              shadow="lg"
              borderWidth="2px"
              borderRadius="2xl"
              overflow="hidden"
            >
              <Card.Body p={0}>
                <Collapsible.Root open={collapsedSteps[1]}>
                  <Flex align="center" justify="space-between" p="4">
                    <HStack>
                      <MotionBox
                        variants={stepVariants}
                        bg={accentColor}
                        borderRadius="full"
                        boxSize="12"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        1
                      </MotionBox>
                      <Heading size="lg" color={accentColor}>
                        Context Verification
                      </Heading>
                    </HStack>
                    <Collapsible.Trigger asChild>
                      <IconButton
                        onClick={() => toggleCollapse(1)}
                        variant="ghost"
                        size="sm"
                        aria-label="Toggle collapse"
                      >
                        {collapsedSteps[1] ? <FiChevronDown /> : <FiChevronUp />}
                      </IconButton>
                    </Collapsible.Trigger>
                  </Flex>

                  <Collapsible.Content>
                    <Box px={6} pb={6}>
                      <Text mb={4} color={mutedColor}>
                        I&apos;ve brought all the context from our Slack conversation. Let me confirm the details for
                        your Vista Equity practice session:
                      </Text>

                      <Box bg={cardBg} p={5} borderRadius="xl" mb={4}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                          <AnimatePresence>
                            {sessionDetails.map((detail, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <HStack p={3} bg="white" borderRadius="lg" shadow="sm">
                                  <Center bg={accentColor} borderRadius="lg" boxSize="10" color="white">
                                    <Icon as={detail.icon} boxSize="5" />
                                  </Center>
                                  <Box>
                                    <Text fontWeight="semibold">{detail.name}</Text>
                                    <Text fontSize="sm" color={mutedColor}>
                                      {detail.topDesc}
                                    </Text>
                                    <Text fontSize="sm" color={mutedColor}>
                                      {detail.bottomDesc}
                                    </Text>
                                  </Box>
                                </HStack>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </SimpleGrid>
                      </Box>

                      <Alert.Root status="info" borderRadius="lg" bg="blue.50" borderColor="blue.200">
                        <Alert.Indicator color="blue.500" />
                        <Alert.Content>
                          <Alert.Title color="blue.700">Ready to proceed!</Alert.Title>
                          <Alert.Description color="blue.600">
                            Everything looks accurate. Let&apos;s set up your practice environment.
                          </Alert.Description>
                        </Alert.Content>
                      </Alert.Root>
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Card.Body>
            </MotionCard>

            {/* Step 2: Voice Setup */}
            <MotionCard
              w="full"
              variants={cardVariants}
              whileHover="hover"
              bg={bgColor}
              shadow="lg"
              borderWidth="2px"
              borderRadius="2xl"
              overflow="hidden"
            >
              <Card.Body p={0}>
                <Collapsible.Root open={collapsedSteps[2]}>
                  <Flex align="center" justify="space-between" p="4">
                    <HStack>
                      <MotionBox
                        variants={stepVariants}
                        bg={accentColor}
                        borderRadius="full"
                        boxSize="12"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        2
                      </MotionBox>
                      <Heading size="lg" color={accentColor}>
                        Voice Setup & Testing
                      </Heading>
                    </HStack>
                    <Collapsible.Trigger asChild>
                      <IconButton
                        onClick={() => toggleCollapse(2)}
                        variant="ghost"
                        size="sm"
                        aria-label="Toggle collapse"
                      >
                        {collapsedSteps[2] ? <FiChevronDown /> : <FiChevronUp />}
                      </IconButton>
                    </Collapsible.Trigger>
                  </Flex>

                  <Collapsible.Content>
                    <Box px={6} pb={6}>
                      <Text mb={4} color={mutedColor}>
                        Let&apos;s make sure your microphone is working properly for the most natural conversation
                        experience:
                      </Text>

                      <Box bg={cardBg} p={5} borderRadius="xl" mb={4}>
                        <VStack gap={4} align="stretch">
                          <Box>
                            <Text fontWeight="medium" mb={2}>
                              Choose a device for speaking
                            </Text>
                            <Text fontSize="sm" color={mutedColor} mb={3}>
                              Don&apos;t worry if this isn&apos;t perfect - we can adjust during practice
                            </Text>

                            {loading ? (
                              <Flex align="center" gap={2} p={3} bg="white" borderRadius="lg">
                                <FiLoader className="animate-spin" />
                                <Text fontSize="sm" color={mutedColor}>
                                  Loading devices...
                                </Text>
                              </Flex>
                            ) : (
                              <NativeSelect
                                items={devices.map((device) => ({
                                  label: device.label,
                                  value: device.deviceId,
                                }))}
                                defaultValue={devices.length > 0 ? devices[0].deviceId : ''}
                                bg="white"
                                borderColor="gray.300"
                                disabled={devices.length === 0}
                              />
                            )}

                            {error && (
                              <Text fontSize="sm" color="red.500" mt={2}>
                                {error.message}
                              </Text>
                            )}
                          </Box>

                          <Separator />

                          <Box>
                            {/* <Flex align="center" justify="space-between" mb={3}>
                              <Text fontWeight="medium">Microphone Test</Text>
                              {micTestResult === 'success' && (
                                <Badge colorPalette="green" variant="subtle">
                                  <FiCheck style={{ marginRight: '4px' }} />
                                  Working Great!
                                </Badge>
                              )}
                            </Flex> */}

                            {/* {isTestingMic && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <Box mb={3}>
                                  <Flex align="center" justify="space-between" mb={2}>
                                    <Text fontSize="sm" color={mutedColor}>
                                      Audio Level
                                    </Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {Math.round(audioLevel)}%
                                    </Text>
                                  </Flex>
                                  <Progress
                                    value={audioLevel}
                                    colorPalette={audioLevel > 20 ? 'green' : 'orange'}
                                    borderRadius="full"
                                    bg="gray.200"
                                  />
                                </Box>
                              </motion.div>
                            )} */}

                            <MotionButton
                              variants={pulseVariants}
                              // animate={!selectedDevice ? 'pulse' : ''}
                              // onClick={isTestingMic ? stopMicTest : startMicTest}
                              // disabled={!selectedDevice || isLoadingDevices}
                              // colorPalette={isTestingMic ? 'red' : 'blue'}
                              size="lg"
                              w="full"
                            >
                              {isTestingMic ? 'Stop Testing' : 'Test Microphone'}
                              {isTestingMic ? <FiMicOff /> : <FiMic />}
                            </MotionButton>
                          </Box>
                        </VStack>
                      </Box>

                      {/* {micTestResult === 'error' && (
                        <Alert.Root status="error" borderRadius="lg">
                          <Alert.Indicator />
                          <Box>
                            <Alert.Title>Microphone Error</Alert.Title>
                            <Alert.Description>
                              Could not access microphone. Please check permissions and try again.
                            </Alert.Description>
                          </Box>
                        </Alert.Root>
                      )} */}

                      {micTestResult === 'success' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <Alert.Root status="success" borderRadius="lg">
                            <Alert.Indicator />
                            <Box>
                              <Alert.Title>Microphone Ready!</Alert.Title>
                              <Alert.Description>
                                Your microphone is working perfectly. Ready for the next step.
                              </Alert.Description>
                            </Box>
                          </Alert.Root>
                        </motion.div>
                      )}
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Card.Body>
            </MotionCard>

            {/* Step 3: Meet Your Partner */}
            <MotionCard
              w="full"
              variants={cardVariants}
              whileHover="hover"
              bg={bgColor}
              shadow="lg"
              borderWidth="2px"
              borderRadius="2xl"
              overflow="hidden"
            >
              <Card.Body p={0}>
                <Collapsible.Root open={collapsedSteps[3]}>
                  <Flex align="center" justify="space-between" p="4">
                    <HStack>
                      <MotionBox
                        variants={stepVariants}
                        bg={accentColor}
                        borderRadius="full"
                        boxSize="12"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        3
                      </MotionBox>
                      <Heading size="lg" color={accentColor}>
                        Meet Your Practice Partner
                      </Heading>
                    </HStack>
                    <Collapsible.Trigger asChild>
                      <IconButton
                        onClick={() => toggleCollapse(3)}
                        variant="ghost"
                        size="sm"
                        aria-label="Toggle collapse"
                      >
                        {collapsedSteps[3] ? <FiChevronDown /> : <FiChevronUp />}
                      </IconButton>
                    </Collapsible.Trigger>
                  </Flex>

                  <Collapsible.Content>
                    <Box px={6} pb={6}>
                      <Text mb={4} color={mutedColor}>
                        I&apos;ll be playing Anne Wojcicki from Vista Equity. Here&apos;s what you should know about how
                        she communicates:
                      </Text>

                      <Box bg={cardBg} p={5} borderRadius="xl" mb={4}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <HStack mb={4}>
                            <Avatar name={partnerInfo.name} size="xl" bg="blue.500" />
                            <Box>
                              <Text fontSize="xl" fontWeight="bold">
                                {partnerInfo.name}
                              </Text>
                              <Text color={mutedColor}>{partnerInfo.desc}</Text>
                            </Box>
                          </HStack>
                        </motion.div>

                        <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
                          <AnimatePresence>
                            {partnerInfo.expertise.map((skill, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                <VStack p={3} bg="white" borderRadius="lg" shadow="sm" gap={2}>
                                  <Center bg={accentColor} borderRadius="full" boxSize="8" color="white">
                                    <Icon as={skill.icon} boxSize="4" />
                                  </Center>
                                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                                    {skill.name}
                                  </Text>
                                </VStack>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </SimpleGrid>
                      </Box>

                      <Alert.Root status="info" borderRadius="lg" bg="purple.50" borderColor="purple.200">
                        <Alert.Indicator color="purple.500" />
                        <Box>
                          <Alert.Title color="purple.700">AI Coaching Enabled</Alert.Title>
                          <Alert.Description color="purple.600">
                            I&apos;ll provide real-time coaching during the conversation - just subtle hints when you
                            need them.
                          </Alert.Description>
                        </Box>
                      </Alert.Root>
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Card.Body>
            </MotionCard>
          </VStack>
        </MotionBox>
      </Container>

      {/* Fixed Bottom Action Button */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg={useColorModeValue('white', 'gray.800')}
        borderTopWidth="1px"
        borderTopColor={useColorModeValue('gray.200', 'gray.600')}
        p={4}
        zIndex={10}
        shadow="lg"
      >
        <Container maxW="container.lg">
          <MotionBox textAlign="center">
            <MotionButton
              size="lg"
              onClick={handleStartSimulation}
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.95 }}
              variants={pulseVariants}
              animate="pulse"
              shadow="lg"
              rounded="xl"
            >
              Start Voice Practice
              <FiPlay />
            </MotionButton>
            <Text mt={2} fontSize="sm" color={mutedColor}>
              Ready when you are! Click to begin your practice session.
            </Text>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  )
}
