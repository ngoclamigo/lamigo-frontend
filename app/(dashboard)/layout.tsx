import { LuBell, LuUser } from 'react-icons/lu'
import { Box, Flex, Grid, GridItem, Heading, Icon, IconButton, Text } from '@chakra-ui/react'

import { ColorModeButton } from '~/components/ui/color-mode'
import { Navigation } from '~/components/navigation'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Grid
      templateAreas={`"sidebar header"
                      "sidebar main"
                      "sidebar footer"`}
      templateRows={'60px 1fr 50px'}
      templateColumns={'250px 1fr'}
      h="100vh"
      gap="0"
    >
      {/* Header */}
      <GridItem area={'header'} bg="bg" zIndex="1">
        <Flex h="100%" px="6" align="center" justify="space-between">
          <Flex align="center">
            <Heading size="md" mr="8">
              Dashboard
            </Heading>
          </Flex>
          <Flex align="center" gap="4">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              // size="md"
            >
              <Icon>
                <LuBell />
              </Icon>
            </IconButton>
            <ColorModeButton />
            <Flex align="center">
              <Box
                as="div"
                borderRadius="full"
                bg="gray.300"
                p="1"
                width="32px"
                height="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr="2"
              >
                <LuUser />
              </Box>
              <Text display={{ base: 'none', md: 'block' }}>John Doe</Text>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>

      {/* Sidebar */}
      <GridItem area={'sidebar'} bg="bg" borderRight="1px" borderColor="bg.inverted" p="4">
        <Navigation />
      </GridItem>

      {/* Main Content */}
      <GridItem area={'main'} bg="bg.subtle" p="6" overflowY="auto">
        {children}
      </GridItem>

      {/* Footer */}
      <GridItem area={'footer'} bg="bg" borderTop="1px" borderColor="bg" p="3">
        <Flex justify="space-between" align="center">
          <Text fontSize="sm">© 2025 Lamigo Dashboard. All rights reserved.</Text>
        </Flex>
      </GridItem>
    </Grid>
  )
}
