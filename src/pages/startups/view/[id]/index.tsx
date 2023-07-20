import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { routes } from 'routes';
import useSWR from 'swr';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';

import { getStartupById } from 'apiSdk/startups';
import { StartupInterface } from 'interfaces/startup';
import { DeliveryPersonnelListPage } from 'pages/delivery-personnels';
import { PartnerStoreListPage } from 'pages/partner-stores';
import {
  getCustomerSupportRepresentatives,
  deleteCustomerSupportRepresentativeById,
  createCustomerSupportRepresentative,
} from 'apiSdk/customer-support-representatives';
import { getDataAnalysts, deleteDataAnalystById, createDataAnalyst } from 'apiSdk/data-analysts';
import { getTeamMembers, deleteTeamMemberById, createTeamMember } from 'apiSdk/team-members';

function StartupViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StartupInterface>(
    () => (id ? `/startups/${id}` : null),
    () =>
      getStartupById(id, {
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Startups',
              link: '/startups',
            },
            {
              label: 'Startup Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper>
              <Stack direction="column" spacing={2} mb={4}>
                <Text
                  sx={{
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    color: 'base.content',
                  }}
                >
                  Startup Details
                </Text>
              </Stack>
              <List spacing={3} w="100%">
                <FormListItem label="Description:" text={data?.description} />

                <FormListItem label="Image:" text={data?.image} />

                <FormListItem label="Name:" text={data?.name} />

                <FormListItem label="Created At:" text={data?.created_at as unknown as string} />

                <FormListItem label="Updated At:" text={data?.updated_at as unknown as string} />

                {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="User:"
                    text={
                      <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                        {data?.user?.email}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={4}>
              <DeliveryPersonnelListPage
                filters={{ startup_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={4}>
              <PartnerStoreListPage
                filters={{ startup_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={4}>
              <UserPageTable
                createHandler={createCustomerSupportRepresentative}
                deleteHandler={deleteCustomerSupportRepresentativeById}
                fetcher={getCustomerSupportRepresentatives}
                entity="customer_support_representative"
                title="Customer Support Representatives"
                filters={{ startup_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={4}>
              <UserPageTable
                createHandler={createDataAnalyst}
                deleteHandler={deleteDataAnalystById}
                fetcher={getDataAnalysts}
                entity="data_analyst"
                title="Data Analysts"
                filters={{ startup_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={4}>
              <UserPageTable
                createHandler={createTeamMember}
                deleteHandler={deleteTeamMemberById}
                fetcher={getTeamMembers}
                entity="team_member"
                title="Team Members"
                filters={{ startup_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
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
)(StartupViewPage);
