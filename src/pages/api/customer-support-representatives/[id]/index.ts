import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customerSupportRepresentativeValidationSchema } from 'validationSchema/customer-support-representatives';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.customer_support_representative
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomerSupportRepresentativeById();
    case 'PUT':
      return updateCustomerSupportRepresentativeById();
    case 'DELETE':
      return deleteCustomerSupportRepresentativeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerSupportRepresentativeById() {
    const data = await prisma.customer_support_representative.findFirst(
      convertQueryToPrismaUtil(req.query, 'customer_support_representative'),
    );
    return res.status(200).json(data);
  }

  async function updateCustomerSupportRepresentativeById() {
    await customerSupportRepresentativeValidationSchema.validate(req.body);
    const data = await prisma.customer_support_representative.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCustomerSupportRepresentativeById() {
    const data = await prisma.customer_support_representative.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
