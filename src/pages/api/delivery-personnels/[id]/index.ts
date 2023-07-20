import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { deliveryPersonnelValidationSchema } from 'validationSchema/delivery-personnels';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.delivery_personnel
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDeliveryPersonnelById();
    case 'PUT':
      return updateDeliveryPersonnelById();
    case 'DELETE':
      return deleteDeliveryPersonnelById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDeliveryPersonnelById() {
    const data = await prisma.delivery_personnel.findFirst(convertQueryToPrismaUtil(req.query, 'delivery_personnel'));
    return res.status(200).json(data);
  }

  async function updateDeliveryPersonnelById() {
    await deliveryPersonnelValidationSchema.validate(req.body);
    const data = await prisma.delivery_personnel.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDeliveryPersonnelById() {
    const data = await prisma.delivery_personnel.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
