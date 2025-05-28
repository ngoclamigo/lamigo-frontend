import React from 'react'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  StackSeparator,
  Badge,
  Center,
} from '@chakra-ui/react'

import { Progress } from '~/components/ui/progress'
import { Tag } from '~/components/ui/tag'

export default function SummaryPage() {
  return (
    <Box p={8}>
      <Grid
        templateAreas={`
          "congrats congrats"
          "performance talkingPoints"
          "cta cta"
        `}
        gridTemplateRows="auto 1fr auto"
        gridTemplateColumns="1fr 1fr"
        gap={6}
      >
        {/* 1. Congrats + Stats */}
        <GridItem area="congrats">
          <Card.Root height="full">
            <Card.Header alignItems="center">
              <Heading size="lg">Excellent Practice Session!</Heading>
              <Text color="fg.muted">You&apos;re ready to nail your Vista Equity call, Sarah</Text>
            </Card.Header>
            <Card.Body>
              <HStack gap="4" justify="center">
                <Tag size="lg" colorPalette="green">
                  ⏱️ 12 minutes
                </Tag>
                <Tag size="lg" colorPalette="green">
                  📈 40% improvement
                </Tag>
                <Tag size="lg" colorPalette="green">
                  ✅ 4/4 key messages
                </Tag>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* 2. Session Performance */}
        <GridItem area="performance">
          <Card.Root height="full">
            <Card.Header>
              <Heading size="lg">📊 Session Performance</Heading>
              <Text color="fg.muted">How you performed vs. your last practice</Text>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap={3} separator={<StackSeparator />}>
                {[
                  ['ESG Positioning', 'Excellent', '+30%'],
                  ['Competitive Differentiation', 'Strong', '+25%'],
                  ['Objection Handling', 'Outstanding', '+45%'],
                  ['Confidence Level', 'Very High', null],
                ].map(([label, value, rate]) => (
                  <HStack key={label} w="full">
                    <Text flex={1}>{label}</Text>
                    <HStack>
                      <Text color="green.focusRing" fontWeight="medium" fontSize="sm">
                        {value}
                      </Text>
                      {rate && <Badge colorPalette="green">{rate}</Badge>}
                    </HStack>
                  </HStack>
                ))}
                <Progress
                  value={85}
                  label="Overall Readiness"
                  width="full"
                  colorPalette="green"
                  spaceY="2"
                  valueText="85% Ready to Close"
                  showValueText
                />
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* 3. Winning Talking Points */}
        <GridItem area="talkingPoints">
          <Card.Root height="full">
            <Card.Header>
              <Heading size="lg">🏆 Winning Talking Points</Heading>
              <Text>Use these in your actual Vista call</Text>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap="3" separator={<StackSeparator />}>
                <HStack gap="3" alignItems="start">
                  <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white" flexShrink="0">
                    1
                  </Center>
                  <Box>
                    <Text fontWeight="medium">ESG Fund Opening</Text>
                    <Text color="fg.muted" fontSize="sm">
                      &quot;I&apos;ve been flowing over $2B sustainability fund launch - Our ESG analytics could be perfect for portfolio evaluation.&quot;
                    </Text>
                  </Box>
                </HStack>
                <HStack gap="3" alignItems="start">
                  <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white" flexShrink="0">
                    2
                  </Center>
                  <Box>
                    <Text fontWeight="medium">Workflow Integration</Text>
                    <Text color="fg.muted" fontSize="sm">
                      &quot;Unlike Bloomberg&apos;s general market data, we provide operational analytics specifically for PE workflow.&quot;
                    </Text>
                  </Box>
                </HStack>
                <HStack gap="3" alignItems="start">
                  <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white" flexShrink="0">
                    3
                  </Center>
                  <Box>
                    <Text fontWeight="medium">Healthcare Context</Text>
                    <Text color="fg.muted" fontSize="sm">
                      &quot;For healthcare deals like your InTouch Health acquisition, we offer clinical workflow analytics.&quot;
                    </Text>
                  </Box>
                </HStack>
                <HStack gap="3" alignItems="start">
                  <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white" flexShrink="0">
                    4
                  </Center>
                  <Box>
                    <Text fontWeight="medium">ROI Positioning</Text>
                    <Text color="fg.muted" fontSize="sm">
                      &quot;ROI typically covers annual cost within the first deal - we&apos;ve seen this with similar PE firms.&quot;
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* 4. Call to Action */}
        <GridItem area="cta">
          <Card.Root height="full">
            <Card.Header justifyContent="center" alignItems="center">
              <Heading size="lg">You&apos;re Ready for Vista Equity</Heading>
              <Text color="fg.muted">Your call is in 45 minutes. What would you like to do next?</Text>
            </Card.Header>
            <Card.Body>
              <HStack justify="center" gap="4">
                <Button colorScheme="green">✅ I&apos;m ready for the call</Button>
                <Button colorScheme="blue" variant="outline">
                  🔁 One more quick practice
                </Button>
                <Button colorScheme="gray" variant="ghost">
                  ⬅️ Back to Slack
                </Button>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>
    </Box>
  )
}
