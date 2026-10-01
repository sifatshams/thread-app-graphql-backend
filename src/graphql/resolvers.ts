export const resolvers = {
  Query: {
    users: () => {
      return [
        {
          id: '1',
          name: 'Sifat',
          email: 'sifat@example.com',
        },
        {
          id: '2',
          name: 'Rahim',
          email: 'rahim@example.com',
        },
      ];
    },
  },
};
