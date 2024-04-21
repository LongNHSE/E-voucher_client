const config = {
  screens: {
    Voucher: {
      path: "voucher",
    },
    VoucherDetail: {
      path: "voucherDetail/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
  },
};

const linking = {
  prefixes: ["demo://app"],
  config,
};

export default linking;
