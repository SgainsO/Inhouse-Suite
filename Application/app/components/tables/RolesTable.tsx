import {
  Paper,
  Stack,
  Title,
  Table,
  LoadingOverlay,
  Text,
  Badge,
  Group,
  Button,
  Tooltip,
  Pagination,
  Center
} from '@mantine/core';
import { IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react';

export interface PersonWithRole {
  did: string;
  name: string;
  access_level: number | null;  // 0=Needs Approval, 1=Organizer, 2=Admin, null=No Access
  role_id?: number;  // GeneralRole ID if exists
}

interface RolesTableProps {
  people: PersonWithRole[];
  loading?: boolean;
  onAssignRole?: (person: PersonWithRole) => void;
  onEditRole?: (person: PersonWithRole) => void;
  onRemoveRole?: (person: PersonWithRole) => void;
  showTitle?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const getGlobalAccessColor = (level: number | null) => {
  if (level === null) return 'gray';
  if (level === 0) return 'yellow';
  if (level === 1) return 'blue';
  if (level === 2) return 'red';
  return 'gray';
};

const getGlobalAccessLabel = (level: number | null) => {
  if (level === null) return 'No Access';
  if (level === 0) return 'Needs Approval';
  if (level === 1) return 'Organizer';
  if (level === 2) return 'Admin';
  return 'Unknown';
};

export default function RolesTable({
  people,
  loading = false,
  onAssignRole,
  onEditRole,
  onRemoveRole,
  showTitle = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: RolesTableProps) {
  return (
    <Paper p="md" withBorder style={{ position: 'relative', minHeight: '400px' }}>
      <LoadingOverlay visible={loading} />
      <Stack gap="md">
        {showTitle && <Title order={4}>Role Assignments ({people.length})</Title>}

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Discord ID</Table.Th>
              <Table.Th>Global Access Level</Table.Th>
              <Table.Th style={{ width: '150px' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {people.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" py="xl">
                    No people found. Add people first to assign roles.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              people.map((person) => (
                <Table.Tr key={person.did}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{person.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{person.did}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      size="sm"
                      color={getGlobalAccessColor(person.access_level)}
                    >
                      {getGlobalAccessLabel(person.access_level)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {person.access_level === null ? (
                        // No role assigned - show Assign button
                        onAssignRole && (
                          <Tooltip label="Assign role">
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<IconUserPlus size={14} />}
                              onClick={() => onAssignRole(person)}
                            >
                              Assign
                            </Button>
                          </Tooltip>
                        )
                      ) : (
                        // Has role - show Edit and Remove buttons
                        <div style={{display: "flex", flexDirection: "row"}}>
                          {onEditRole && (
                            <Tooltip label="Edit role">
                              <Button
                                size="xs"
                                variant="light"
                                color="blue"
                                leftSection={<IconEdit size={14} />}
                                onClick={() => onEditRole(person)}
                              >
                                Edit
                              </Button>
                            </Tooltip>
                          )}
                          {onRemoveRole && (
                            <Tooltip label="Remove role">
                              <Button
                                size="xs"
                                variant="light"
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => onRemoveRole(person)}
                              >
                                Remove
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
        {totalPages > 1 && onPageChange && (
          <Center mt="md">
            <Pagination
              value={currentPage}
              onChange={onPageChange}
              total={totalPages}
            />
          </Center>
        )}
      </Stack>
    </Paper>
  );
}
