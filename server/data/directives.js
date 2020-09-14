import {
  AuthenticationError,
  defaultFieldResolver,
  SchemaDirectiveVisitor,
} from 'apollo-server';

export class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user) {
        throw new AuthenticationError('Not authenticated');
      }

      return resolver(root, args, ctx, info);
    };
  }
}
