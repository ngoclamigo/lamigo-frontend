import type { CoreMessage } from 'ai'

import { LuThumbsUp, LuLightbulb, LuTriangleAlert, LuSparkles, LuBrain, LuMessageSquare, LuZap, LuTrendingUp } from 'react-icons/lu'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useRef, useEffect } from 'react'
import { Box, VStack, Text, Flex, Badge, HStack, Icon } from '@chakra-ui/react'

import { useColorModeValue } from './ui/color-mode'

// Motion components
const MotionBox = motion(Box)
const MotionVStack = motion(VStack)

interface ChatProps {
  messages: CoreMessage[]
}

interface MessageEvaluation {
  type: 'suggestion' | 'improvement' | 'warning' | 'positive'
  message: string
  icon: React.ReactNode
  color: string
}

function generatePartnerEvaluation(content: string): MessageEvaluation | null {
  const suggestions = [
    {
      triggers: ['cancel', 'refund', 'complaint'],
      evaluation: {
        type: 'suggestion' as const,
        message: 'You can acknowledge their concern first, then explain your policy clearly',
        icon: <LuLightbulb size={14} />,
        color: 'blue',
      },
    },
    {
      triggers: ['upset', 'angry', 'frustrated'],
      evaluation: {
        type: 'suggestion' as const,
        message: 'You need to show empathy and use calming language',
        icon: <LuLightbulb size={14} />,
        color: 'blue',
      },
    },
    {
      triggers: ['price', 'cost', 'expensive'],
      evaluation: {
        type: 'suggestion' as const,
        message: 'You can emphasize the value and benefits rather than just defending the price',
        icon: <LuLightbulb size={14} />,
        color: 'blue',
      },
    },
    {
      triggers: ['help', 'support', 'assistance'],
      evaluation: {
        type: 'suggestion' as const,
        message: 'You need to be proactive and offer specific solutions',
        icon: <LuLightbulb size={14} />,
        color: 'blue',
      },
    },
  ]

  const lowerContent = content.toLowerCase()

  for (const suggestion of suggestions) {
    if (suggestion.triggers.some((trigger) => lowerContent.includes(trigger))) {
      return suggestion.evaluation
    }
  }

  return null
}

function generateUserEvaluation(content: string): MessageEvaluation | null {
  const evaluations = [
    {
      triggers: ['sorry', 'apologize', 'my fault'],
      evaluation: {
        type: 'positive' as const,
        message: 'Acknowledging responsibility builds trust with customers and shows humility',
        icon: <LuThumbsUp size={14} />,
        color: 'green',
      },
    },
    {
      triggers: ['understand', 'i see', 'i hear you'],
      evaluation: {
        type: 'positive' as const,
        message: "Excellent empathy! Shows you're actively listening and processing their concerns",
        icon: <LuThumbsUp size={14} />,
        color: 'green',
      },
    },
    {
      triggers: ['no', "can't", 'impossible', 'not allowed'],
      evaluation: {
        type: 'warning' as const,
        message: 'Avoid flat rejections - focus on what you CAN do and offer alternatives',
        icon: <LuTriangleAlert size={14} />,
        color: 'orange',
      },
    },
    {
      triggers: ['policy', 'rules', 'company says'],
      evaluation: {
        type: 'improvement' as const,
        message: 'Explain the reasoning behind policies in customer-friendly language',
        icon: <LuZap size={14} />,
        color: 'blue',
      },
    },
    {
      triggers: ['let me check', "i'll find out", 'give me a moment'],
      evaluation: {
        type: 'positive' as const,
        message: 'Great initiative! Taking time to find the right answer shows dedication',
        icon: <LuTrendingUp size={14} />,
        color: 'green',
      },
    },
    {
      triggers: ['thank you', 'thanks', 'appreciate'],
      evaluation: {
        type: 'positive' as const,
        message: 'Gratitude sets a positive tone and builds mutual respect',
        icon: <LuSparkles size={14} />,
        color: 'green',
      },
    },
    {
      triggers: ['calm down', 'relax', 'chill'],
      evaluation: {
        type: 'warning' as const,
        message: 'This can sound dismissive - acknowledge their feelings instead',
        icon: <LuTriangleAlert size={14} />,
        color: 'orange',
      },
    },
    {
      triggers: ['happy to help', 'of course', 'no problem'],
      evaluation: {
        type: 'positive' as const,
        message: 'Friendly affirmations create a supportive and approachable tone',
        icon: <LuThumbsUp size={14} />,
        color: 'green',
      },
    },
  ]

  const lowerContent = content.toLowerCase()

  for (const evalItem of evaluations) {
    if (evalItem.triggers.some((trigger) => lowerContent.includes(trigger))) {
      return evalItem.evaluation
    }
  }

  // Default evaluation based on message characteristics
  if (content.length < 10) {
    return {
      type: 'improvement',
      message: 'Try providing more detailed and thoughtful responses',
      icon: <LuZap size={14} />,
      color: 'blue',
    }
  }

  if (content.includes('?')) {
    return {
      type: 'positive',
      message: 'Asking questions shows engagement and helps clarify needs',
      icon: <LuLightbulb size={14} />,
      color: 'green',
    }
  }

  return null
}

export function Recommendations({ messages }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.900')
  const headerBg = useColorModeValue('gray.50/80', 'gray.800/80')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400')
  const emptyStateBg = useColorModeValue('gray.100', 'gray.800')
  const emptyStateBorder = useColorModeValue('gray.300', 'gray.600')
  const emptyStateIcon = useColorModeValue('gray.400', 'gray.500')

  // Evaluation styles
  const evaluationStyles = {
    positive: {
      bg: useColorModeValue('green.50', 'green.900/20'),
      borderColor: useColorModeValue('green.200', 'green.700'),
      iconBg: useColorModeValue('green.500', 'green.400'),
      iconColor: 'white',
      textColor: useColorModeValue('green.800', 'green.200'),
      glowColor: useColorModeValue('green.200', 'green.600'),
    },
    warning: {
      bg: useColorModeValue('orange.50', 'orange.900/20'),
      borderColor: useColorModeValue('orange.200', 'orange.700'),
      iconBg: useColorModeValue('orange.500', 'orange.400'),
      iconColor: 'white',
      textColor: useColorModeValue('orange.800', 'orange.200'),
      glowColor: useColorModeValue('orange.200', 'orange.600'),
    },
    improvement: {
      bg: useColorModeValue('blue.50', 'blue.900/20'),
      borderColor: useColorModeValue('blue.200', 'blue.700'),
      iconBg: useColorModeValue('blue.500', 'blue.400'),
      iconColor: 'white',
      textColor: useColorModeValue('blue.800', 'blue.200'),
      glowColor: useColorModeValue('blue.200', 'blue.600'),
    },
    suggestion: {
      bg: useColorModeValue('purple.50', 'purple.900/20'),
      borderColor: useColorModeValue('purple.200', 'purple.700'),
      iconBg: useColorModeValue('purple.500', 'purple.400'),
      iconColor: 'white',
      textColor: useColorModeValue('purple.800', 'purple.200'),
      glowColor: useColorModeValue('purple.200', 'purple.600'),
    },
  }

  const getEvaluationStyle = (type: string) => {
    return evaluationStyles[type as keyof typeof evaluationStyles] || evaluationStyles.improvement
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
  }

  const headerVariants = {
    initial: { opacity: 0, y: -30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.6
      }
    }
  }

  const messageVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    },
  }

  const pulseAnimation = {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <MotionVStack
      initial="initial"
      animate="animate"
      variants={containerVariants}
      h="full"
      gap={0}
      bg={bgColor}
      borderRadius="3xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      shadow="2xl"
      position="relative"
      backdropFilter="blur(10px)"
    >
      {/* Animated background gradients */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="100%"
        bgGradient={useColorModeValue(
          'linear(135deg, blue.50/40, purple.50/20, transparent 60%)',
          'linear(135deg, blue.900/10, purple.900/5, transparent 60%)'
        )}
        pointerEvents="none"
        zIndex={0}
      />

      {/* Floating orbs for decoration */}
      <MotionBox
        position="absolute"
        top="20%"
        right="10%"
        w="100px"
        h="100px"
        bg={useColorModeValue('blue.100/30', 'blue.800/10')}
        borderRadius="full"
        filter="blur(40px)"
        pointerEvents="none"
        zIndex={0}
        {...pulseAnimation}
      />
      <MotionBox
        position="absolute"
        bottom="30%"
        left="5%"
        w="80px"
        h="80px"
        bg={useColorModeValue('purple.100/30', 'purple.800/10')}
        borderRadius="full"
        filter="blur(30px)"
        pointerEvents="none"
        zIndex={0}
        {...pulseAnimation}
        transition={{ delay: 1 }}
      />

      {/* Header */}
      <MotionBox
        variants={headerVariants}
        w="full"
        p={6}
        borderBottom="1px"
        borderColor={borderColor}
        bg={headerBg}
        backdropFilter="blur(20px)"
        position="relative"
        zIndex={10}
      >
        <HStack gap={4} align="center">
          <MotionBox
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Box
              p={3}
              borderRadius="xl"
              bg={useColorModeValue('blue.100', 'blue.900/30')}
              border="1px"
              borderColor={useColorModeValue('blue.200', 'blue.700')}
              shadow="lg"
            >
              <Icon
                as={LuBrain}
                boxSize={6}
                color={useColorModeValue('blue.600', 'blue.400')}
              />
            </Box>
          </MotionBox>
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontWeight="bold" fontSize="xl" color={textColor}>
              AI Voice Coach
            </Text>
            <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">
              Real-time guidance & intelligent feedback
            </Text>
          </VStack>
          <MotionBox
            {...pulseAnimation}
          >
            <Badge
              colorScheme="green"
              variant="subtle"
              borderRadius="full"
              px={4}
              py={2}
              fontSize="xs"
              fontWeight="bold"
              border="1px"
              borderColor={useColorModeValue('green.200', 'green.600')}
              shadow="md"
            >
              <HStack gap={2}>
                <Box w={2} h={2} bg="green.400" borderRadius="full" />
                <Text>LIVE</Text>
              </HStack>
            </Badge>
          </MotionBox>
        </HStack>
      </MotionBox>

      {/* Messages Container */}
      <Box
        flex={1}
        w="full"
        overflowY="auto"
        p={6}
        position="relative"
        zIndex={5}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '4px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: useColorModeValue('gray.400', 'gray.500'),
          },
        }}
      >
        {messages.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            textAlign="center"
            py={16}
          >
            <VStack gap={6}>
              <MotionBox
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box
                  p={6}
                  borderRadius="2xl"
                  bg={emptyStateBg}
                  border="2px dashed"
                  borderColor={emptyStateBorder}
                  shadow="lg"
                >
                  <Icon
                    as={LuMessageSquare}
                    boxSize={10}
                    color={emptyStateIcon}
                  />
                </Box>
              </MotionBox>
              <VStack gap={3}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Start your voice practice
                </Text>
                <Text fontSize="md" color={mutedTextColor} maxW="400px" textAlign="center" lineHeight="tall">
                  Your AI coach is ready to provide real-time feedback and intelligent suggestions as you practice customer service scenarios
                </Text>
              </VStack>
            </VStack>
          </MotionBox>
        ) : (
          <VStack gap={8} align="stretch">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MotionBox
                  key={`message-${index}`}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  <Flex justify={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Box maxW="90%" w="full">
                      {(() => {
                        const content = typeof message.content === 'string' ? message.content : ''
                        const evaluation = message.role === 'user'
                          ? generateUserEvaluation(content)
                          : generatePartnerEvaluation(content)

                        if (!evaluation) return null

                        const style = getEvaluationStyle(evaluation.type)

                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{
                              delay: index * 0.1,
                              duration: 0.5,
                              type: "spring",
                              stiffness: 300
                            }}
                          >
                            <Box
                              bg={style.bg}
                              border="2px"
                              borderColor={style.borderColor}
                              borderRadius="2xl"
                              p={6}
                              shadow="xl"
                              position="relative"
                              overflow="hidden"
                              backdropFilter="blur(10px)"
                              _hover={{
                                shadow: "2xl",
                                borderColor: style.glowColor,
                              }}
                              transition="all 0.3s ease"
                            >
                              {/* Animated gradient overlay */}
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                height="100%"
                                bgGradient={`linear(135deg, ${style.bg}, transparent 70%)`}
                                opacity={0.4}
                                pointerEvents="none"
                              />

                              <HStack gap={4} align="flex-start" position="relative" zIndex={2}>
                                <MotionBox
                                  whileHover={{ scale: 1.1, rotate: 10 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                >
                                  <Box
                                    p={3}
                                    borderRadius="xl"
                                    bg={style.iconBg}
                                    color={style.iconColor}
                                    flexShrink={0}
                                    shadow="lg"
                                    border="2px"
                                    borderColor="white"
                                  >
                                    {evaluation.icon}
                                  </Box>
                                </MotionBox>
                                <VStack align="flex-start" gap={3} flex={1}>
                                  <HStack gap={3} align="center">
                                    <Badge
                                      variant="solid"
                                      colorScheme={evaluation.color}
                                      borderRadius="full"
                                      fontSize="xs"
                                      fontWeight="bold"
                                      textTransform="uppercase"
                                      letterSpacing="wide"
                                      px={3}
                                      py={1}
                                      shadow="md"
                                    >
                                      {evaluation.type}
                                    </Badge>
                                    {evaluation.type === 'positive' && (
                                      <MotionBox
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      >
                                        <Icon as={LuSparkles} boxSize={4} color={style.iconBg} />
                                      </MotionBox>
                                    )}
                                  </HStack>
                                  <Text
                                    fontSize="md"
                                    color={style.textColor}
                                    lineHeight="tall"
                                    fontWeight="medium"
                                  >
                                    {evaluation.message}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          </motion.div>
                        )
                      })()}
                    </Box>
                  </Flex>
                </MotionBox>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>
    </MotionVStack>
  )
}
