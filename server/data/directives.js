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

export class ChannelDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { id } = this.args;
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (root, args, ctx, info) => {
      if (!ctx.user.channels.includes(id)) {
        throw new AuthenticationError('Not authorized');
      }

      return resolve(root, args, ctx, info);
    };
  }
}

export const schemaDirectives = `
  directive @authenticated on FIELD_DEFINITION
  directive @channel(id: ID!) on FIELD_DEFINITION
`;
