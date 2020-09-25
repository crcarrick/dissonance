import {
  AuthenticationError,
  defaultFieldResolver,
  SchemaDirectiveVisitor,
} from 'apollo-server';

export class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return resolve(root, args, ctx, info);
    };
  }
}

export const schemaDirectives = `
  directive @authenticated on FIELD_DEFINITION
`;
