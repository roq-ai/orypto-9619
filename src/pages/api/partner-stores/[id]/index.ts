import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { partnerStoreValidationSchema } from 'validationSchema/partner-stores';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.partner_store
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPartnerStoreById();
    case 'PUT':
      return updatePartnerStoreById();
    case 'DELETE':
      return deletePartnerStoreById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPartnerStoreById() {
    const data = await prisma.partner_store.findFirst(convertQueryToPrismaUtil(req.query, 'partner_store'));
    return res.status(200).json(data);
  }

  async function updatePartnerStoreById() {
    await partnerStoreValidationSchema.validate(req.body);
    const data = await prisma.partner_store.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePartnerStoreById() {
    const data = await prisma.partner_store.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
