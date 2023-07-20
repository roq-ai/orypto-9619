import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from '@roq/nextjs';
import { compose } from 'lib/compose';
import { Box, Button, Flex, IconButton, Link, Text, TextProps } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Error } from 'components/error';
import { SearchInput } from 'components/search-input';
import Table from 'components/table';
import { useDataTableParams, ListDataFiltersType } from 'components/table/hook/use-data-table-params.hook';
import { DATE_TIME_FORMAT } from 'const';
import d from 'dayjs';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { withAppLayout } from 'lib/hocs/with-app-layout.hoc';
import { AccessInfo } from 'components/access-info';
import { getStartups, deleteStartupById } from 'apiSdk/startups';
import { StartupInterface } from 'interfaces/startup';

type ColumnType = ColumnDef<StartupInterface, unknown>;

interface StartupListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
}

export function StartupListPage(props: StartupListPageProps) {
  const { filters = {}, titleProps = {}, showSearchFilter = false, hidePagination, hideTableBorders, pageSize } = props;
  const { hasAccess } = useAuthorizationApi();
  const { onFiltersChange, onSearchTermChange, params, onPageChange, onPageSizeChange, setParams } = useDataTableParams(
    {
      filters,
      searchTerm: '',
      pageSize,
      order: [
        {
          desc: true,
          id: 'created_at',
        },
      ],
    },
  );

  const fetcher = useCallback(
    async () =>
      getStartups({
        relations: [
          'user',
          'customer_support_representative.count',
          'data_analyst.count',
          'delivery_personnel.count',
          'partner_store.count',
          'team_member.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<StartupInterface>>(
    () => `/startups?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteStartupById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: StartupInterface) => {
    if (hasAccess('startup', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/startups/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    { id: 'description', header: 'description', accessorKey: 'description' },
    { id: 'image', header: 'image', accessorKey: 'image' },
    { id: 'name', header: 'name', accessorKey: 'name' },
    { id: 'tenant_id', header: 'tenant_id', accessorKey: 'tenant_id' },
    hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'user',
          header: 'User',
          accessorKey: 'user',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/users/view/${record.user?.id}`}>
              {record.user?.email}
            </Link>
          ),
        }
      : null,
    hasAccess('customer_support_representative', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'customer_support_representative',
          header: 'Customer Support Representative',
          accessorKey: 'customer_support_representative',
          cell: ({ row: { original: record } }: any) => record?._count?.customer_support_representative,
        }
      : null,
    hasAccess('data_analyst', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'data_analyst',
          header: 'Data Analyst',
          accessorKey: 'data_analyst',
          cell: ({ row: { original: record } }: any) => record?._count?.data_analyst,
        }
      : null,
    hasAccess('delivery_personnel', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'delivery_personnel',
          header: 'Delivery Personnel',
          accessorKey: 'delivery_personnel',
          cell: ({ row: { original: record } }: any) => record?._count?.delivery_personnel,
        }
      : null,
    hasAccess('partner_store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'partner_store',
          header: 'Partner Store',
          accessorKey: 'partner_store',
          cell: ({ row: { original: record } }: any) => record?._count?.partner_store,
        }
      : null,
    hasAccess('team_member', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'team_member',
          header: 'Team Member',
          accessorKey: 'team_member',
          cell: ({ row: { original: record } }: any) => record?._count?.team_member,
        }
      : null,

    {
      id: 'actions',
      header: 'actions',
      accessorKey: 'actions',
      cell: ({ row: { original: record } }: any) => (
        <>
          {hasAccess('startup', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/startups/edit/${record.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                padding="0rem 0.5rem"
                height="1.5rem"
                fontSize="0.75rem"
                variant="outline"
                color="state.info.main"
                borderRadius="6px"
                border="1px"
                borderColor="state.info.transparent"
                leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
              >
                Edit
              </Button>
            </NextLink>
          )}
          {hasAccess('startup', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
              padding="0rem 0.5rem"
              variant="outline"
              aria-label="edit"
              height="1.5rem"
              fontSize="0.75rem"
              color="state.error.main"
              borderRadius="6px"
              borderColor="state.error.transparent"
              icon={<FiTrash width="12px" height="12px" color="error.main" />}
            />
          )}
        </>
      ),
    },
  ].filter(Boolean) as ColumnType[];

  return (
    <Box p={4} rounded="md" shadow="none">
      <AccessInfo entity="startup" />
      <Flex justifyContent="space-between" mb={4}>
        <Text as="h1" fontSize="1.875rem" fontWeight="bold" color="base.content" {...titleProps}>
          Startup
        </Text>
        {hasAccess('startup', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/startups/create`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              height={'2rem'}
              padding="0rem 0.75rem"
              fontSize={'0.875rem'}
              fontWeight={600}
              bg="primary.main"
              borderRadius={'6px'}
              color="primary.content"
              _hover={{
                bg: 'primary.focus',
              }}
              mr="4"
              as="a"
            >
              <FiPlus size={16} color="primary.content" style={{ marginRight: '0.25rem' }} />
              Create
            </Button>
          </NextLink>
        )}
      </Flex>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent={{ base: 'flex-start', md: 'space-between' }}
        mb={4}
        gap={{ base: 2, md: 0 }}
      >
        {showSearchFilter && (
          <Box>
            <SearchInput value={params.searchTerm} onChange={onSearchTermChange} />
          </Box>
        )}
      </Flex>

      {error && (
        <Box mb={4}>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box mb={4}>
          <Error error={deleteError} />{' '}
        </Box>
      )}
      <>
        <Table
          hidePagination={hidePagination}
          hideTableBorders={hideTableBorders}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          columns={columns}
          data={data?.data}
          totalCount={data?.totalCount || 0}
          pageSize={params.pageSize}
          pageIndex={params.pageNumber}
          order={params.order}
          setParams={setParams}
          onRowClick={handleView}
        />
      </>
    </Box>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'startup',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(StartupListPage);
