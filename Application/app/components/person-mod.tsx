
import {
  Container,
  Title,
  Grid,
  Paper,
  Group,
  Badge,
  Select,
  Stack,
  Text,
  Button,
  Timeline,
  Divider,
  Box,
  TextInput
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import PersonTable from './tables/PeopleTable';
import { useState, useEffect } from 'react';

export interface Group {
  gid: number;
  name: string;
  access_level?: number;
}

export interface Tag {
  tid: number;
  name: string;
}

export interface Person {
  did: string;
  name: string;
  email: string | null;
  phone: string | null;
  groups?: Group[];
  tags?: Tag[];
}

interface WrapperProps {
  people: Person[];
  loading?: boolean;
  showTitle?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

interface PersonModPageProps {
  onPersonSelect?: (person: Person) => void;
  selectionMode?: boolean;
}

export default function PersonModPage({
  people,
  loading = false,
  showTitle = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange}: WrapperProps) {
    const [control, setControl] = useState<'table' | 'modal'>('table');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    if (control === 'table') {
      return (
          <PersonTable
            people={people}
            loading={loading}
            showTitle={false}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            changeToPersonModal={setControl}
            changePersonDetails={setSelectedPerson}
          />

      );
    }
    else if (control === 'modal') {
      return (
        <Stack gap="md">
          <Button variant="subtle" onClick={() => changeControl('table')}>
            ← Back to list
          </Button>
          <Group>
          <Paper p="md" withBorder>
            <Text fw="bold">Volunteer Details {selectedPerson.did}</Text>
            <Text fw="bold">Name: {selectedPerson.name}</Text>
            <Text fw="bold">Email: {selectedPerson.email || 'N/A'}</Text>
            <Text fw="bold">Phone: {selectedPerson.phone || 'N/A'}</Text>
            <Button variant="subtle" onClick={() => setControl('table')}>Return</Button>
          </Paper>
          <Paper p="md" withBorder>
            <Text fw="bold">Comments</Text>
          </Paper>
          </Group>
        </Stack>
      );
    }
}
