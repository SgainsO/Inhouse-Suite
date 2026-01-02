'use client';

import { Table, Badge, Stack, Title, LoadingOverlay, Paper, Group, Text, Pagination, Center } from '@mantine/core';

export interface Person {
  did: string;
  name: string;
  email: string | null;
  phone: string | null;
  groups?: Group[];
  tags?: Tag[];
}

export interface Group {
  gid: number;
  name: string;
  access_level?: number;
}

export interface Tag {
  tid: number;
  name: string;
}

interface PeopleTableProps {
  people: Person[];
  loading?: boolean;
  onRowClick?: (person: Person) => void;
  showTitle?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function PeopleTable({
  people,
  loading = false,
  onRowClick,
  showTitle = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: PeopleTableProps) {
  const formatContact = (email: string | null, phone: string | null) => {
    const parts = [];
    if (email) parts.push(email);
    if (phone) parts.push(phone);
    return parts.length > 0 ? parts.join(' • ') : 'No contact info';
  };

  return (
    <Paper p="md" withBorder style={{ position: 'relative', minHeight: '400px' }}>
      <LoadingOverlay visible={loading} />
      <Stack gap="md">
        {showTitle && <Title order={4}>People ({people.length})</Title>}
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Discord ID</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Groups</Table.Th>
              <Table.Th>Tags</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {people.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" py="xl">No people found.</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              people.map((person) => (
                <Table.Tr
                  key={person.did}
                  onClick={() => onRowClick?.(person)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  <Table.Td>{person.name}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{person.did}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatContact(person.email, person.phone)}</Text>
                  </Table.Td>
                  <Table.Td>
                    {person.groups && person.groups.length > 0 ? (
                      <Group gap="xs">
                        {person.groups.slice(0, 3).map((group) => (
                          <Badge key={group.gid} variant="light" size="sm">
                            {group.name}
                          </Badge>
                        ))}
                        {person.groups.length > 3 && (
                          <Badge variant="light" size="sm" c="dimmed">
                            +{person.groups.length - 3}
                          </Badge>
                        )}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No groups</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {person.tags && person.tags.length > 0 ? (
                      <Group gap="xs">
                        {person.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.tid} variant="dot" size="sm">
                            {tag.name}
                          </Badge>
                        ))}
                        {person.tags.length > 3 && (
                          <Badge variant="dot" size="sm" c="dimmed">
                            +{person.tags.length - 3}
                          </Badge>
                        )}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">No tags</Text>
                    )}
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
