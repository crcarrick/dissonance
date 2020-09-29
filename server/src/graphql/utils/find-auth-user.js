import { AuthenticationError } from 'apollo-server';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { TABLE_NAMES } from '@dissonance/constants';

export const findAuthUser = async ({ authorization, dbClient }) => {
  try {
    let decodedToken;
    if (authorization) {
      const token = authorization.replace('Bearer', '').trim();

      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }

    const authUser = decodedToken?.id
      ? await dbClient(TABLE_NAMES.USERS)
          .where('id', decodedToken.id)
          .select()
          .first()
      : null;

    return authUser;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    } else {
      throw error;
    }
  }
};
