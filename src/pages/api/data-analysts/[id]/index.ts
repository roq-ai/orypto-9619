import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { dataAnalystValidationSchema } from 'validationSchema/data-analysts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.data_analyst
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDataAnalystById();
    case 'PUT':
      return updateDataAnalystById();
    case 'DELETE':
      return deleteDataAnalystById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDataAnalystById() {
    const data = await prisma.data_analyst.findFirst(convertQueryToPrismaUtil(req.query, 'data_analyst'));
    return res.status(200).json(data);
  }

  async function updateDataAnalystById() {
    await dataAnalystValidationSchema.validate(req.body);
    const data = await prisma.data_analyst.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDataAnalystById() {
    const data = await prisma.data_analyst.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
